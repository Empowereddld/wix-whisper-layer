import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create user client to verify JWT
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { resource_id } = await req.json();
    if (!resource_id) {
      return new Response(JSON.stringify({ error: "resource_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin client for DB queries and signed URLs
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Get resource (private_file_path readable here via service role)
    const { data: resource, error: resErr } = await admin
      .from("resources")
      .select("id, file_url, private_file_path, is_private, title")
      .eq("id", resource_id)
      .single();

    if (resErr || !resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve the private storage path. Prefer the new column; fall back to legacy file_url prefix.
    const r: any = resource;
    const privatePath: string | null =
      r.private_file_path ||
      (r.file_url && typeof r.file_url === "string" && r.file_url.startsWith("resources-private/")
        ? r.file_url.replace("resources-private/", "")
        : null);
    const isPrivate = r.is_private === true || !!privatePath;

    if (!privatePath && !r.file_url) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if resource is paid
    const { data: product } = await admin
      .from("products")
      .select("id, price")
      .eq("resource_id", resource_id)
      .eq("is_active", true)
      .single();

    const isPaid = product && product.price > 0;

    if (isPaid) {
      // Check purchase
      const { data: purchase } = await admin
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("resource_id", resource_id)
        .eq("status", "completed")
        .limit(1)
        .single();

      // Also allow admins
      const { data: isAdmin } = await admin.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (!purchase && !isAdmin) {
        return new Response(JSON.stringify({ error: "Purchase required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Public (non-private) URL — just return it directly
    if (!isPrivate) {
      return new Response(JSON.stringify({ url: r.file_url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bucket = "resources-private";
    const path = privatePath!;

    // Generate signed URL (60 seconds)
    const { data: signedUrl, error: signErr } = await admin.storage
      .from(bucket)
      .createSignedUrl(path, 60);

    if (signErr || !signedUrl) {
      return new Response(JSON.stringify({ error: "Failed to generate download URL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: signedUrl.signedUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
