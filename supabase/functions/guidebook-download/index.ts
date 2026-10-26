import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { allow, clientIp } from "../_shared/rateLimit.ts";
import {
  purchaseGrantsAccess, signedDownloadForResource, tokenFingerprint, verifyAccessToken,
} from "../_shared/guidebookAccess.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Exchanges a guest access pass for a 5-minute download link. The pass is sent
// in the POST body only (never a URL), and is never logged in full.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    if (!(await allow(admin, [{ bucket: "guidebook-download", id: clientIp(req), max: 60, windowMin: 60 }]))) {
      return json({ error: "Too many attempts. Please try again later." }, 429);
    }
    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* invalid below */ }
    const parsed = await verifyAccessToken(body.access_token);
    if (!parsed) return json({ error: "This access link is not valid." }, 403);

    const { data: row, error } = await admin.from("purchases")
      .select("id, resource_id, status, access_status, access_token_version")
      .eq("id", parsed.purchaseId).maybeSingle();
    if (error) return json({ error: "Internal server error" }, 500);
    if (!purchaseGrantsAccess(row, parsed.version)) {
      console.warn("guidebook-download refused", { fp: await tokenFingerprint(String(body.access_token)) });
      return json({ error: "This access link is no longer active. Please contact us." }, 403);
    }
    const url = await signedDownloadForResource(admin, row!.resource_id, "Discussing-DLD-with-Your-Child.pdf");
    if (!url) return json({ error: "Download is temporarily unavailable." }, 500);
    return json({ url, expires_in: 300 });
  } catch (e) {
    console.error("guidebook-download error", e instanceof Error ? e.message : "unknown");
    return json({ error: "Internal server error" }, 500);
  }
});
