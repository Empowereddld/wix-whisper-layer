// Recovery flow: user enters their email; if it matches an active row in
// storybuilders_waitlist we send them an email with a link back to their
// dashboard.
//
// SECURITY: This endpoint MUST NOT leak which emails are on the waitlist.
// It always returns the same generic shape regardless of match, and rate-limits
// by IP so attackers can't grind it for enumeration.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_BASE = "https://www.empowereddld.com";
const RATE_LIMIT_MAX = 5; // attempts per IP
const RATE_LIMIT_WINDOW_MIN = 60; // per hour

const GENERIC_OK = {
  ok: true,
  // Kept for backwards compatibility with the existing client (it checks `found`)
  // but ALWAYS true so the response shape never leaks membership.
  found: true,
  message: "If that email is on our waitlist, we just sent you a link.",
};

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const first = fwd.split(",")[0]?.trim();
  return first || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Always return 200 with the generic shape on any expected outcome.
  // Only truly unexpected runtime errors get a 500.
  const okResponse = () =>
    new Response(JSON.stringify(GENERIC_OK), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    // Validate format silently — bad input still returns generic OK so we
    // don't help attackers distinguish "invalid email" from "not on list".
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Rate limit by IP. Count attempts in the rolling window.
    const ip = clientIp(req);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
    const { count } = await supabase
      .from("waitlist_recovery_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("attempted_at", windowStart);

    // Log this attempt regardless (so repeated probing keeps tripping the limit).
    await supabase
      .from("waitlist_recovery_attempts")
      .insert({ ip_address: ip })
      .then(() => {}, (e) => console.warn("recovery_attempts insert failed:", e));

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      // Don't send email, but still respond identically. The user sees the
      // same UI either way; abusive scripts get no signal.
      return okResponse();
    }

    if (!emailLooksValid) return okResponse();

    const { data: user } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, referral_code, deleted_at")
      .eq("email", email)
      .is("deleted_at", null)
      .maybeSingle();

    if (!user || !user.referral_code) {
      // Not on the list (or has no referral code yet). Silently succeed.
      return okResponse();
    }

    const dashboardLink = `${SITE_BASE}/storypros/dashboard?ref=${encodeURIComponent(user.referral_code)}`;
    const firstName = (user.name || "").split(" ")[0] || "there";

    await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: "dashboard_recovery",
        to: user.email,
        data: {
          name: firstName,
          dashboard_link: dashboardLink,
        },
      }),
    });

    return okResponse();
  } catch (err) {
    console.error("find-storypros-dashboard error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
