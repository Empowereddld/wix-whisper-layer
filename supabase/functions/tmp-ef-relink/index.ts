// One-off: replacement Tier 2 guide links for members whose earlier Tier 2
// email used the retired public link. Removed after use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { issueRewardLinkToken } from "../_shared/rewardFile.ts";

Deno.serve(async (req) => {
  const cron = Deno.env.get("CRON_SECRET");
  const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const okCron = !!cron && req.headers.get("x-cron-secret") === cron;
  const okSvc = !!svc && req.headers.get("authorization") === `Bearer ${svc}`;
  if (!cron || (!okCron && !okSvc)) return new Response("Forbidden", { status: 403 });
  const { mode, only_id } = await req.json().catch(() => ({}));
  const url = Deno.env.get("SUPABASE_URL")!;
  const sb = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: rows, error } = await sb.from("storybuilders_waitlist")
    .select("id, name, email, email3_sent_at, email4_sent_at, points, email_verified")
    .not("email3_sent_at", "is", null).is("deleted_at", null).eq("email_verified", true).gte("points", 35);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  const { data: supp } = await sb.from("suppressed_emails").select("email");
  const suppressed = new Set((supp || []).map((s: any) => String(s.email).toLowerCase()));

  // Received a real Tier 2 email = Tier 3 not marked at the same moment (that pattern
  // means Tier 2 was skipped and only Tier 3 was sent).
  const got = (rows || []).filter((r: any) =>
    !r.email4_sent_at || new Date(r.email4_sent_at).getTime() - new Date(r.email3_sent_at).getTime() > 60_000);
  let list = got.filter((r: any) => !suppressed.has(String(r.email).toLowerCase()));
  if (only_id) list = list.filter((r: any) => r.id === only_id);

  // Resume support: skip anyone already emailed in the interrupted first run.
  const { data: done } = await sb.from("email_send_log").select("recipient_email")
    .gte("created_at", "2026-10-07T11:56:00Z");
  const already = new Set((done || []).map((d: any) => String(d.recipient_email).toLowerCase()));
  list = list.filter((r: any) => !already.has(String(r.email).toLowerCase()));
  const links = await Promise.all(list.map(async (r: any) =>
    `${url}/functions/v1/storypros-reward-download?t=${encodeURIComponent(await issueRewardLinkToken(r.id))}`));
  const summary = {
    received_old_link: got.length,
    suppressed_skipped: got.length - got.filter((r: any) => !suppressed.has(String(r.email).toLowerCase())).length,
    recipients: list.length,
    unique_links: new Set(links).size,
    unique_members: new Set(list.map((r: any) => r.id)).size,
  };
  if (mode !== "send") return new Response(JSON.stringify(summary));

  let sent = 0, failed = 0;
  for (let i = 0; i < list.length; i++) {
    const r: any = list[i];
    const res = await fetch(`${url}/functions/v1/send-waitlist-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-cron-secret": cron },
      body: JSON.stringify({
        template: "ef_guide_link_update", to: r.email,
        data: { name: (r.name || "").trim().split(" ")[0] || "there", guide_download_url: links[i] },
      }),
    });
    if (res.ok) sent++; else { failed++; console.error("relink send failed for member", r.id, res.status); }
    await new Promise((z) => setTimeout(z, 600));
  }
  return new Response(JSON.stringify({ ...summary, sent, failed }));
});
