// Hourly watchdog: checks for unauthorized invocation attempts against the
// cron-only edge functions. If failures in the last hour exceed THRESHOLD,
// emails all admins. Idempotent per hour-window via cron_abuse_alerts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const THRESHOLD = 20; // failures/hour before alerting
const WINDOW_MS = 60 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date();
    // Bucket to the start of the current hour.
    const windowStart = new Date(now);
    windowStart.setMinutes(0, 0, 0);
    const windowEnd = new Date(windowStart.getTime() + WINDOW_MS);
    const lookbackStart = new Date(now.getTime() - WINDOW_MS).toISOString();

    const { data: failures, error } = await supabase
      .from("cron_auth_failures")
      .select("function_name, ip_address, user_agent, created_at")
      .gte("created_at", lookbackStart);

    if (error) throw error;

    const count = failures?.length ?? 0;
    if (count < THRESHOLD) {
      return new Response(
        JSON.stringify({ success: true, failures: count, alerted: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Already alerted for this window?
    const { data: existing } = await supabase
      .from("cron_abuse_alerts")
      .select("id")
      .eq("alert_window_start", windowStart.toISOString())
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ success: true, failures: count, alerted: false, reason: "already_alerted" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Aggregate by function and IP for the email body.
    const byFn: Record<string, number> = {};
    const byIp: Record<string, number> = {};
    for (const f of failures ?? []) {
      byFn[f.function_name] = (byFn[f.function_name] ?? 0) + 1;
      if (f.ip_address) byIp[f.ip_address] = (byIp[f.ip_address] ?? 0) + 1;
    }

    const fnRows = Object.entries(byFn)
      .sort((a, b) => b[1] - a[1])
      .map(([fn, n]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;">${fn}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;"><b>${n}</b></td></tr>`)
      .join("");

    const ipRows = Object.entries(byIp)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, n]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;font-family:monospace;font-size:13px;">${ip}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;"><b>${n}</b></td></tr>`)
      .join("");

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;">
        <h2 style="color:#b3261e;margin:0 0 12px;">⚠️ Cron endpoint abuse detected</h2>
        <p style="margin:0 0 16px;line-height:1.5;">
          <b>${count}</b> unauthorized invocation attempts against cron-only edge functions
          in the last hour (threshold: ${THRESHOLD}).
        </p>
        <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.5px;color:#666;">By function</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">${fnRows}</table>
        <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.5px;color:#666;">Top source IPs</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">${ipRows || '<tr><td style="padding:6px 12px;color:#666;">No IP data</td></tr>'}</table>
        <p style="margin:24px 0 0;font-size:13px;color:#666;line-height:1.5;">
          All attempts were rejected with 403. These functions are protected by
          the <code>x-cron-secret</code> header. If this is sustained,
          consider rotating <code>CRON_SECRET</code>.
        </p>
      </div>`;

    // Look up admin emails.
    const { data: admins, error: adminErr } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (adminErr) throw adminErr;

    const adminEmails: string[] = [];
    for (const a of admins ?? []) {
      const { data: u } = await supabase.auth.admin.getUserById(a.user_id);
      if (u?.user?.email) adminEmails.push(u.user.email);
    }

    let emailed = 0;
    for (const to of adminEmails) {
      try {
        const { error: sendErr } = await supabase.functions.invoke("send-email", {
          body: {
            template: "raw",
            to,
            subject: `[Empowered DLD] Cron abuse alert — ${count} failed attempts in last hour`,
            html,
          },
        });
        if (!sendErr) emailed++;
      } catch (e) {
        console.error("alert send failed:", e);
      }
    }

    await supabase.from("cron_abuse_alerts").insert({
      alert_window_start: windowStart.toISOString(),
      alert_window_end: windowEnd.toISOString(),
      failure_count: count,
      details: { by_function: byFn, by_ip: byIp, admins_emailed: emailed },
    });

    return new Response(
      JSON.stringify({ success: true, failures: count, alerted: true, admins_emailed: emailed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("monitor-cron-abuse error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
