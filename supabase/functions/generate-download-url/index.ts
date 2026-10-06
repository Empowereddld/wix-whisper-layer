import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Private file access FAILS CLOSED. A private file is delivered only when:
//   - the caller is an admin, OR
//   - the caller has a completed purchase of this exact resource, OR
//   - the resource is published AND has no product rows at all (deliberately free).
// Any pricing row (active, inactive, duplicate, zero) or lookup error blocks
// non-purchasers. Unpublished resources are admin-only.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    let body: any = null;
    try { body = await req.json(); } catch { /* handled below */ }
    const resource_id = body?.resource_id;
    if (typeof resource_id !== "string" || !UUID_RE.test(resource_id)) {
      return json({ error: "resource_id required" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: resource, error: resErr } = await admin
      .from("resources")
      .select("id, file_url, is_private, is_published")
      .eq("id", resource_id)
      .maybeSingle();
    if (resErr) return json({ error: "Internal server error" }, 500);
    if (!resource) return json({ error: "Resource not found" }, 404);

    const { data: isAdminData, error: adminErr } = await admin.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (adminErr) return json({ error: "Internal server error" }, 500);
    const isAdmin = isAdminData === true;

    // Unpublished: admin-only
    if (resource.is_published !== true && !isAdmin) {
      return json({ error: "Resource not found" }, 404);
    }

    const { data: privateRow, error: pfErr } = await admin
      .from("resource_private_files")
      .select("storage_path")
      .eq("resource_id", resource_id)
      .maybeSingle();
    if (pfErr) return json({ error: "Internal server error" }, 500);

    const privatePath: string | null = privateRow?.storage_path ?? null;
    const isPrivate = resource.is_private === true || !!privatePath;

    if (!isPrivate) {
      // Public free downloads unchanged
      if (!resource.file_url) return json({ error: "Resource not found" }, 404);
      return json({ url: resource.file_url });
    }

    if (!privatePath) return json({ error: "Resource not found" }, 404);

    if (!isAdmin) {
      // Own completed purchase of this exact resource (survives price being turned off)
      const { data: purchases, error: purErr } = await admin
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("resource_id", resource_id)
        .eq("status", "completed")
        .limit(1);
      if (purErr) return json({ error: "Internal server error" }, 500);
      const hasPurchase = (purchases?.length ?? 0) > 0;

      if (!hasPurchase) {
        // Deliberately free = zero product rows of any kind. Anything else fails closed.
        const { count, error: prodErr } = await admin
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("resource_id", resource_id);
        if (prodErr || count === null) return json({ error: "Internal server error" }, 500);
        if (count > 0) return json({ error: "Purchase required" }, 403);
      }
    }

    const path = privatePath.startsWith("resources-private/")
      ? privatePath.replace("resources-private/", "")
      : privatePath;

    const { data: signedUrl, error: signErr } = await admin.storage
      .from("resources-private")
      .createSignedUrl(path, 60);
    if (signErr || !signedUrl) return json({ error: "Failed to generate download URL" }, 500);

    return json({ url: signedUrl.signedUrl });
  } catch {
    return json({ error: "Internal server error" }, 500);
  }
});
