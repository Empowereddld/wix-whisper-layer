// Hourly waitlist email pipeline monitor.
//
// Runs 4 checks each invocation:
//   1. Stuck unverified users (>26h, no reminder 1) -> alert if > 2
//   2. Verified >30min ago but no welcome sent     -> alert if > 0
//   3. Reminder sent to already-verified user       -> alert if > 0
//   4. Bounces/complaints/dlq in 24h OR auth-gate 403
//      -> alert if > 5 bounces, or any 403
//
// Per-check 6-hour cooldown via waitlist_healthcheck_state.
// Every run is recorded in waitlist_healthcheck_runs (paper trail).
// If alert email fails to send, function returns HTTP 500 so cron's
// job_run_details captures the failure independently of email delivery.
//
// Triggered by pg_cron hourly. Requires x-cron-secret.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const ALERT_TO = "hello@empowereddld.com";
const COOLDOWN_HOURS = 6;

type CheckId = "check1" | "check2" | "check3" | "check4";

interface CheckResult {
  id: CheckId;
  label: string;
  tripped: boolean;
  count: number;
  detail: string;
  suggestedAction: string;
}

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
  const supabase = createClient(supabaseUrl, serviceKey);

  const results: CheckResult[] = [];

  // ---------- Check 1: stuck unverified, no reminder 1 ----------
  try {
    const cutoff = new Date(Date.now() - 26 * 3600 * 1000).toISOString();
    const { count, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id", { count: "exact", head: true })
      .eq("email_verified", false)
      .is("verification_reminder_1_sent_at", null)
      .lt("verification_sent_at", cutoff)
      .is("deleted_at", null);
    if (error) throw error;
    const n = count ?? 0;
    results.push({
      id: "check1",
      label: "Stuck unverified users (>26h, no reminder)",
      tripped: n > 2,
      count: n,
      detail: `${n} users signed up >26h ago, unverified, and have not received reminder 1.`,
      suggestedAction: "Check send-verification-reminders cron + edge function logs.",
    });
  } catch (e) {
    results.push({
      id: "check1", label: "Stuck unverified users", tripped: true, count: -1,
      detail: `Query failed: ${(e as Error).message}`,
      suggestedAction: "Inspect storybuilders_waitlist schema/permissions.",
    });
  }

  // ---------- Check 2: verified >30min, no welcome ----------
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id", { count: "exact", head: true })
      .eq("email_verified", true)
      .is("welcome_sent_at", null)
      .lt("verified_at", cutoff)
      .is("deleted_at", null);
    if (error) throw error;
    const n = count ?? 0;
    results.push({
      id: "check2",
      label: "Verified users missing Welcome email",
      tripped: n > 0,
      count: n,
      detail: `${n} users verified >30min ago with no welcome_sent_at.`,
      suggestedAction: "Check send-waitlist-email (Welcome) + verify-email-waitlist flow.",
    });
  } catch (e) {
    results.push({
      id: "check2", label: "Verified missing Welcome", tripped: true, count: -1,
      detail: `Query failed: ${(e as Error).message}`,
      suggestedAction: "Inspect storybuilders_waitlist schema/permissions.",
    });
  }

  // ---------- Check 3: reminder sent to already-verified user ----------
  try {
    const { data, error } = await supabase
      .from("storybuilders_waitlist")
      .select("id, email, verified_at, verification_reminder_1_sent_at, verification_reminder_2_sent_at")
      .eq("email_verified", true)
      .or("verification_reminder_1_sent_at.not.is.null,verification_reminder_2_sent_at.not.is.null")
      .is("deleted_at", null)
      .limit(200);
    if (error) throw error;
    const offenders = (data ?? []).filter((r: any) => {
      const v = r.verified_at ? new Date(r.verified_at).getTime() : 0;
      const r1 = r.verification_reminder_1_sent_at ? new Date(r.verification_reminder_1_sent_at).getTime() : 0;
      const r2 = r.verification_reminder_2_sent_at ? new Date(r.verification_reminder_2_sent_at).getTime() : 0;
      return (r1 > v && r1 > 0) || (r2 > v && r2 > 0);
    });
    const n = offenders.length;
    results.push({
      id: "check3",
      label: "Reminder sent to already-verified user",
      tripped: n > 0,
      count: n,
      detail: `${n} users received a verification reminder AFTER verifying.`,
      suggestedAction: "send-verification-reminders is not filtering email_verified=true. Fix immediately.",
    });
  } catch (e) {
    results.push({
      id: "check3", label: "Reminder to verified", tripped: true, count: -1,
      detail: `Query failed: ${(e as Error).message}`,
      suggestedAction: "Inspect storybuilders_waitlist schema/permissions.",
    });
  }

  // ---------- Check 4: bounces/dlq in 24h OR auth-gate 403 ----------
  let gateStatus: number | null = null;
  let gateBody = "";
  try {
    const probe = await fetch(`${supabaseUrl}/functions/v1/send-waitlist-email`, {
      method: "POST",
      headers: { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ template: "__healthcheck_probe__", to: "healthcheck@empowereddld.com" }),
    });
    gateStatus = probe.status;
    gateBody = (await probe.text()).slice(0, 200);
  } catch (e) {
    gateStatus = -1;
    gateBody = (e as Error).message;
  }

  let bounceCount = 0;
  try {
    const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await supabase
      .from("email_send_log")
      .select("id", { count: "exact", head: true })
      .in("status", ["bounced", "complained", "dlq", "failed"])
      .gte("created_at", cutoff);
    bounceCount = count ?? 0;
  } catch (_) { /* ignore */ }

  const gateBroken = gateStatus === 403;
  const check4Tripped = gateBroken || bounceCount > 5;
  results.push({
    id: "check4",
    label: "Email delivery health (bounces + auth gate)",
    tripped: check4Tripped,
    count: bounceCount,
    detail: `Auth gate status: ${gateStatus}${gateBroken ? " (BROKEN)" : ""}. Bounces/complaints/dlq in 24h: ${bounceCount}.`,
    suggestedAction: gateBroken
      ? "send-waitlist-email auth gate is rejecting the service-role key. Fix the gate code."
      : "Investigate Resend dashboard for bounce patterns; check suppressed_emails.",
  });

  // ---------- Load cooldown state ----------
  const { data: stateRow } = await supabase
    .from("waitlist_healthcheck_state")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const cooldownMs = COOLDOWN_HOURS * 3600 * 1000;
  const lastAlertAt: Record<CheckId, number> = {
    check1: stateRow?.check1_last_alert_at ? new Date(stateRow.check1_last_alert_at).getTime() : 0,
    check2: stateRow?.check2_last_alert_at ? new Date(stateRow.check2_last_alert_at).getTime() : 0,
    check3: stateRow?.check3_last_alert_at ? new Date(stateRow.check3_last_alert_at).getTime() : 0,
    check4: stateRow?.check4_last_alert_at ? new Date(stateRow.check4_last_alert_at).getTime() : 0,
  };

  const now = Date.now();
  const trippedNotCooling = results.filter(
    (r) => r.tripped && (now - lastAlertAt[r.id] > cooldownMs),
  );

  // ---------- Send consolidated digest alert ----------
  let alertSent = false;
  let alertSendError: string | null = null;

  if (trippedNotCooling.length > 0) {
    const subject = `[ALERT] Waitlist health: ${trippedNotCooling.length} check(s) failing`;
    const rows = trippedNotCooling.map((r) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;vertical-align:top;"><strong>${r.label}</strong><br/>
          <span style="color:#666;font-size:12px;">${r.id}</span></td>
        <td style="padding:8px;border:1px solid #ddd;vertical-align:top;">${r.count}</td>
        <td style="padding:8px;border:1px solid #ddd;vertical-align:top;">${r.detail}<br/>
          <em style="color:#444;">${r.suggestedAction}</em></td>
      </tr>`).join("");
    const html = `
      <p><strong>${trippedNotCooling.length} waitlist health check(s) tripped.</strong></p>
      <p>Run at ${new Date().toISOString()}. Per-check cooldown is ${COOLDOWN_HOURS}h.</p>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <thead><tr>
          <th style="padding:8px;border:1px solid #ddd;background:#f5f5f5;text-align:left;">Check</th>
          <th style="padding:8px;border:1px solid #ddd;background:#f5f5f5;text-align:left;">Count</th>
          <th style="padding:8px;border:1px solid #ddd;background:#f5f5f5;text-align:left;">Detail / Action</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#666;font-size:12px;margin-top:16px;">
        Gate probe: ${gateStatus} — <code>${gateBody}</code>
      </p>`;

    try {
      const resp = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          "x-cron-secret": cronSecret,
        },
        body: JSON.stringify({ to: ALERT_TO, subject, html, bypass_suppression: true }),
      });
      if (!resp.ok) {
        alertSendError = `send-email returned ${resp.status}: ${(await resp.text()).slice(0, 200)}`;
      } else {
        alertSent = true;
        // Update cooldown timestamps for checks we actually alerted on
        const update: Record<string, string> = { updated_at: new Date().toISOString() };
        for (const r of trippedNotCooling) update[`${r.id}_last_alert_at`] = new Date().toISOString();
        await supabase.from("waitlist_healthcheck_state").update(update).eq("id", 1);
      }
    } catch (e) {
      alertSendError = (e as Error).message;
    }
  }

  // ---------- Always write a run row ----------
  const checksTripped: Record<string, unknown> = {};
  for (const r of results) {
    checksTripped[r.id] = {
      label: r.label,
      tripped: r.tripped,
      count: r.count,
      cooled_down: r.tripped && now - lastAlertAt[r.id] <= cooldownMs,
    };
  }
  await supabase.from("waitlist_healthcheck_runs").insert({
    checks_tripped: checksTripped,
    alert_sent: alertSent,
    alert_send_error: alertSendError,
  });

  // ---------- Response ----------
  const anyTripped = results.some((r) => r.tripped);
  const failure = anyTripped && trippedNotCooling.length > 0 && !alertSent;
  const status = failure ? 500 : 200;

  return new Response(
    JSON.stringify({
      ok: !failure,
      checked_at: new Date().toISOString(),
      results,
      alert_sent: alertSent,
      alert_send_error: alertSendError,
      tripped_count: results.filter((r) => r.tripped).length,
      alerted_count: trippedNotCooling.length,
    }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
