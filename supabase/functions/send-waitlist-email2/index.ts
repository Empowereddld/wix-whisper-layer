// Dispatches Email 2 (24-hour follow-up: How Points & Tiers Work)
// Triggered by pg_cron every 15 minutes.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};


async function logCronAuthFailure(req: Request, functionName: string) {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return;
    await fetch(`${url}/rest/v1/cron_auth_failures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": key,
        "Authorization": `Bearer ${key}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        function_name: functionName,
        ip_address:
          req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
          req.headers.get("cf-connecting-ip") ??
          null,
        user_agent: req.headers.get("user-agent") ?? null,
      }),
    });
  } catch (_) {
    // never block the response on logging
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Cron-only.
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    await logCronAuthFailure(req, "send-waitlist-email2");
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Email 2 ("Welcome back") goes out 24 hours after verification, matching
    // the locked copy. Email 1 already lands at verify, so the day-2 cadence
    // gives users time to engage before the points/tiers explainer.
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: pending, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, referral_code, verified_at")
      .eq("email_verified", true)
      .is("email2_sent_at", null)
      .not("verified_at", "is", null)
      .lte("verified_at", cutoff)
      .limit(100);

    if (error) throw error;

    let sent = 0;
    let failed = 0;

    for (const user of pending ?? []) {
      try {
        // Invoke the main email sender with the email2 template
        const { error: sendError } = await supabase.functions.invoke(
          "send-waitlist-email",
          {
            headers: { "x-cron-secret": cronSecret },
            body: {
              template: "email2_points_tiers",
              to: user.email,
              data: {
                name: user.name?.split(" ")[0] || "friend",
                referral_code: user.referral_code,
                referral_link: `https://empowereddld.com/storypros?ref=${user.referral_code}`,
              },
            },
          }
        );

        if (sendError) throw sendError;

        // Mark as sent
        await supabase
          .from("storybuilders_waitlist")
          .update({ email2_sent_at: new Date().toISOString() })
          .eq("id", user.id);

        sent++;
      } catch (e) {
        console.error(`Failed Email 2 to ${user.email}:`, e);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, candidates: pending?.length ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Email 2 dispatcher error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
