// Daily synthetic health check for the waitlist email pipeline.
// Pings send-waitlist-email's privileged auth gate with the current
// service-role key. If the gate returns 403, the service-role key format
// has changed (or auth logic is broken) and we email an alert so we can
// fix it BEFORE real signups silently lose their verification emails.
//
// Triggered by pg_cron daily. Requires x-cron-secret.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const ALERT_TO = "hello@empowereddld.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Probe the privileged auth gate by requesting a non-public template
  // with a deliberately invalid recipient. We expect either:
  //   - 200/4xx other than 403 (auth passed; downstream may complain about
  //     the dummy email, which is fine — we only care about the gate)
  //   - 403 (auth gate rejected the service-role key -> BROKEN)
  const probe = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template: "__healthcheck_probe__", // unknown template; passes gate, fails later
      to: "healthcheck@empowereddld.com",
    }),
  });

  const status = probe.status;
  const body = await probe.text();
  const gateBroken = status === 403;

  if (gateBroken) {
    // Fire an alert email via the generic sender (uses Resend connector,
    // independent of the broken gate).
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          "x-cron-secret": cronSecret,
        },
        body: JSON.stringify({
          to: ALERT_TO,
          subject: "🚨 Waitlist email pipeline DOWN (auth gate returning 403)",
          html: `<p><strong>send-waitlist-email is rejecting the service-role key.</strong></p>
            <p>New signups are NOT receiving verification emails.</p>
            <p>Probe response: <code>${status}</code> — <code>${body.slice(0, 300)}</code></p>
            <p>Most likely cause: Supabase rotated the service-role key format again.
            Update the auth gate in <code>send-waitlist-email/index.ts</code> to accept it.</p>`,
          bypass_suppression: true,
        }),
      });
    } catch (e) {
      console.error("Failed to send healthcheck alert email:", e);
    }
  }

  return new Response(
    JSON.stringify({
      ok: !gateBroken,
      gate_status: status,
      gate_broken: gateBroken,
      checked_at: new Date().toISOString(),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
