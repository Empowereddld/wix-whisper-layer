// Retries Parent Guidebook confirmation emails.
//  - Scheduled run (x-cron-secret = CRON_SECRET): retries failed or stale sends,
//    up to the automatic attempt limit.
//  - Admin resend ({ purchase_id }, verified admin session): one manual send,
//    allowed even after automatic attempts are exhausted.
// Never returns or logs recipients, passes or links.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { sendGuidebookConfirmation, MAX_EMAIL_ATTEMPTS, STALE_CLAIM_MS } from "../_shared/guidebookEmail.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const cronSecret = Deno.env.get("CRON_SECRET");
  const isCron = !!cronSecret && req.headers.get("x-cron-secret") === cronSecret;

  if (isCron) {
    const staleBefore = new Date(Date.now() - STALE_CLAIM_MS).toISOString();
    const { data: rows } = await admin.from("purchases").select("id")
      .is("user_id", null).eq("status", "completed").eq("access_status", "active")
      .lt("confirmation_email_attempts", MAX_EMAIL_ATTEMPTS)
      .or(`confirmation_email_status.eq.failed,confirmation_email_status.eq.pending,and(confirmation_email_status.eq.sending,confirmation_email_claimed_at.lt.${staleBefore})`)
      .limit(20);
    const results: Record<string, number> = {};
    for (const r of rows ?? []) {
      const o = await sendGuidebookConfirmation(admin, r.id);
      results[o] = (results[o] ?? 0) + 1;
    }
    return json({ processed: rows?.length ?? 0, results });
  }

  // Admin manual resend.
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const { data: u } = token ? await admin.auth.getUser(token) : { data: null };
  const userId = u?.user?.id;
  if (!userId) return json({ error: "Unauthorized" }, 401);
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!isAdmin) return json({ error: "Forbidden" }, 403);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* handled below */ }
  const purchaseId = typeof body.purchase_id === "string" ? body.purchase_id : "";
  if (!UUID_RE.test(purchaseId)) return json({ error: "Invalid purchase" }, 400);

  const outcome = await sendGuidebookConfirmation(admin, purchaseId, { manual: true });
  await admin.from("audit_logs").insert({ admin_id: userId, action: `guidebook_email_resend:${purchaseId}:${outcome}` });
  return json({ outcome });
});
