// One-shot admin-triggered nudge to all unverified Story Pros waitlist signups.
// Sends a friendly "did you get our email?" message with a fresh verify link,
// from hello@mail.empowereddld.com (established sender) for better deliverability.
//
// Admin-only: requires a valid admin JWT.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://empowereddld.com";
const BRAND = "#5B2D8E";

function buildHtml(firstName: string, verifyLink: string) {
  return `<!doctype html><html><body style="margin:0;background:#F4EEFB;font-family:'Nunito',Arial,sans-serif;color:#2A2438;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border-radius:14px;padding:32px;box-shadow:0 4px 14px rgba(91,45,142,0.08);">
      <h1 style="color:${BRAND};font-size:22px;margin:0 0 16px;">Hi ${firstName}, did our email land in spam?</h1>
      <p style="font-size:15px;line-height:1.65;margin:0 0 14px;">
        You signed up for the Story Pros waitlist - thank you! We sent your welcome and verification link a little while ago, but we've heard from a few of you that it didn't show up in your inbox.
      </p>
      <p style="font-size:15px;line-height:1.65;margin:0 0 14px;">
        If you don't see it, please check your <strong>Spam</strong> or <strong>Promotions</strong> folder and search for "Story Pros".
      </p>
      <p style="font-size:15px;line-height:1.65;margin:0 0 22px;">
        To make it easy, here's a fresh verification link. Click it to confirm your spot and unlock your dashboard, referral link, and rewards:
      </p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${verifyLink}" style="display:inline-block;background:${BRAND};color:#fff !important;padding:15px 34px;text-decoration:none;border-radius:999px;font-weight:700;font-size:15px;box-shadow:0 6px 14px rgba(91,45,142,0.28);">Confirm my spot</a>
      </p>
      <p style="font-size:13px;color:#6B6478;margin:22px 0 0;">
        Adding <strong>hello@mail.empowereddld.com</strong> to your contacts will help future emails land in your inbox.
      </p>
      <p style="font-size:15px;margin:24px 0 0;">Warmly,<br/>Camesha &amp; Jinean</p>
    </div>
    <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">
      Empowered DLD - <a href="${SITE}" style="color:${BRAND};">empowereddld.com</a>
    </p>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Admin auth check
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: userRes } = await supabase.auth.getUser(token);
    if (!userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await supabase
      .from("user_roles").select("role")
      .eq("user_id", userRes.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional dry-run mode (default true to be safe)
    const body = await req.json().catch(() => ({}));
    const dryRun = body.dry_run !== false;

    const { data: targets, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, verification_token")
      .eq("email_verified", false)
      .is("deleted_at", null)
      .not("verification_token", "is", null);

    if (error) throw error;

    if (dryRun) {
      return new Response(JSON.stringify({
        dry_run: true,
        would_send_to: targets?.length ?? 0,
        sample: (targets ?? []).slice(0, 5).map((t) => t.email),
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let sent = 0, failed = 0;
    const errors: string[] = [];

    for (const u of targets ?? []) {
      try {
        const firstName = u.name?.split(" ")[0] || "friend";
        const verifyLink = `${supabaseUrl}/functions/v1/verify-email-waitlist?token=${u.verification_token}`;
        const html = buildHtml(firstName, verifyLink);

        const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: u.email,
            subject: "Did our Story Pros email land in spam? (here's a fresh link)",
            html,
            bypass_suppression: false,
          }),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
        }
        sent++;
        // small pause to smooth bursts
        await new Promise((r) => setTimeout(r, 150));
      } catch (e) {
        failed++;
        errors.push(`${u.email}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    return new Response(JSON.stringify({
      success: true, sent, failed, errors: errors.slice(0, 10),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("admin-nudge-unverified error:", err);
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : "unknown",
    }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
