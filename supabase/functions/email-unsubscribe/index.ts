// Public unsubscribe endpoint.
// - { token }: signed link from an email -> unsubscribes that address.
// - { email }: NEVER unsubscribes directly. Sends a confirmation email with a
//   fresh signed link to that address (covers older emails that had plain
//   ?email= links). Always returns the same neutral response.
// Rate-limited by hashed IP and hashed recipient.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { allow, clientIp } from "../_shared/rateLimit.ts";
import { unsubscribeUrl, verifyUnsubscribeToken } from "../_shared/unsubscribeToken.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const SITE = "https://www.empowereddld.com";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function sendConfirmation(email: string) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) throw new Error("email not configured");
  const url = await unsubscribeUrl(SITE, email);
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#333;">
    <h1 style="color:#5B2D8E;font-size:20px;">Confirm you'd like to unsubscribe</h1>
    <p>We received a request to stop emails from Empowered DLD to this address. To confirm, tap the button below.</p>
    <p><a href="${url}" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Unsubscribe me</a></p>
    <p style="font-size:13px;color:#666;">If you didn't ask for this, you can ignore this email and nothing will change.</p>
  </div>`;
  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": resendKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Empowered DLD <hello@mail.empowereddld.com>",
      to: [email],
      subject: "Confirm your unsubscribe request",
      html,
      reply_to: "hello@empowereddld.com",
    }),
  });
  if (!res.ok) console.error("unsubscribe confirmation send failed:", res.status, await res.text());
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = clientIp(req);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  try {
    // Signed link path.
    if (typeof body.token === "string") {
      if (!(await allow(supabase, [{ bucket: "unsub-token-ip", id: ip, max: 30, windowMin: 60 }]))) {
        return json({ error: "Too many requests. Please try again later." }, 429);
      }
      const v = await verifyUnsubscribeToken(body.token);
      if ("error" in v) {
        // Expired links are handled safely: nothing is unsubscribed; the page
        // offers to email a fresh link to the address.
        return json({ error: v.error }, v.error === "expired_token" ? 410 : 400);
      }
      const { error } = await supabase
        .from("suppressed_emails")
        .upsert({ email: v.email, reason: "unsubscribe" }, { onConflict: "email", ignoreDuplicates: true });
      if (error) throw error;
      return json({ success: true, email: v.email });
    }

    // Typed-in / legacy ?email= path: confirmation email only.
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email) || email.length > 254) return json({ error: "Valid email required" }, 400);
    const ok = await allow(supabase, [
      { bucket: "unsub-confirm-ip", id: ip, max: 5, windowMin: 60 },
      { bucket: "unsub-confirm-to", id: email, max: 2, windowMin: 1440 },
    ]);
    if (ok) await sendConfirmation(email);
    return json({ success: true, confirmation_sent: true });
  } catch (err) {
    console.error("email-unsubscribe error:", err);
    return json({ error: "Unsubscribe failed. Please try again." }, 500);
  }
});
