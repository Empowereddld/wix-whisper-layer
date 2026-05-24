// Weekly app metrics summary email.
// Triggered by pg_cron every Monday 14:00 UTC (9am EST).
// Compares last 7 days vs prior 7 days across signups, waitlist, downloads,
// purchases, leads, contact form submissions, and top resources.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENTS = ["hello@empowereddld.com"];
const BRAND = "#5B2D8E";
const SITE = "https://www.empowereddld.com";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function pctChange(curr: number, prev: number): string {
  if (prev === 0 && curr === 0) return "—";
  if (prev === 0) return `↑ new (${curr})`;
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) return "→ 0%";
  const arrow = pct > 0 ? "↑" : "↓";
  const color = pct > 0 ? "#1a7f4e" : "#b3261e";
  return `<span style="color:${color};font-weight:600;">${arrow} ${Math.abs(pct)}%</span>`;
}

async function countRange(
  supa: ReturnType<typeof createClient>,
  table: string,
  column: string,
  start: string,
  end: string,
  filter?: { col: string; val: string }
) {
  let q = supa.from(table).select("*", { count: "exact", head: true }).gte(column, start).lt(column, end);
  if (filter) q = q.eq(filter.col, filter.val);
  const { count, error } = await q;
  if (error) {
    console.error(`count ${table}:`, error.message);
    return 0;
  }
  return count ?? 0;
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

  try {
    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const wkAgo = new Date(now.getTime() - 7 * 86400_000);
    const twoWkAgo = new Date(now.getTime() - 14 * 86400_000);

    const cur = { start: fmtDate(wkAgo), end: fmtDate(now) };
    const prev = { start: fmtDate(twoWkAgo), end: fmtDate(wkAgo) };

    // Parallel metric fetches
    const [
      profCur, profPrev,
      wlCur, wlPrev,
      sbCur, sbPrev,
      dlCur, dlPrev,
      purCur, purPrev,
      leadCur, leadPrev,
      contactCur, contactPrev,
    ] = await Promise.all([
      countRange(supa, "profiles", "created_at", cur.start, cur.end),
      countRange(supa, "profiles", "created_at", prev.start, prev.end),
      countRange(supa, "waitlist", "created_at", cur.start, cur.end),
      countRange(supa, "waitlist", "created_at", prev.start, prev.end),
      countRange(supa, "storybuilders_waitlist", "created_at", cur.start, cur.end),
      countRange(supa, "storybuilders_waitlist", "created_at", prev.start, prev.end),
      countRange(supa, "user_downloads", "downloaded_at", cur.start, cur.end),
      countRange(supa, "user_downloads", "downloaded_at", prev.start, prev.end),
      countRange(supa, "purchases", "purchased_at", cur.start, cur.end, { col: "status", val: "completed" }),
      countRange(supa, "purchases", "purchased_at", prev.start, prev.end, { col: "status", val: "completed" }),
      countRange(supa, "lead_captures", "created_at", cur.start, cur.end),
      countRange(supa, "lead_captures", "created_at", prev.start, prev.end),
      countRange(supa, "contact_submissions", "created_at", cur.start, cur.end),
      countRange(supa, "contact_submissions", "created_at", prev.start, prev.end),
    ]);

    // Revenue this week
    const { data: revRows } = await supa
      .from("purchases")
      .select("amount_paid, currency")
      .eq("status", "completed")
      .gte("purchased_at", cur.start)
      .lt("purchased_at", cur.end);
    const revenueCents = (revRows ?? []).reduce((s: number, r: any) => s + (r.amount_paid ?? 0), 0);
    const revenue = `CA$${(revenueCents / 100).toFixed(2)}`;

    // Top downloads this week
    const { data: dlRows } = await supa
      .from("user_downloads")
      .select("resource_id")
      .gte("downloaded_at", cur.start)
      .lt("downloaded_at", cur.end);
    const dlCounts = new Map<string, number>();
    (dlRows ?? []).forEach((r: any) => dlCounts.set(r.resource_id, (dlCounts.get(r.resource_id) ?? 0) + 1));
    const topIds = [...dlCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    let topResourcesHtml = "<li style='color:#888'>No downloads this week</li>";
    if (topIds.length) {
      const { data: resRows } = await supa
        .from("resources")
        .select("id, title")
        .in("id", topIds.map(([id]) => id));
      const titleMap = new Map((resRows ?? []).map((r: any) => [r.id, r.title]));
      topResourcesHtml = topIds
        .map(([id, n]) => `<li><strong>${n}×</strong> &nbsp; ${titleMap.get(id) ?? "(unknown)"}</li>`)
        .join("");
    }

    // Top StoryPros referrers (by invite_count) this week
    const { data: refRows } = await supa
      .from("storybuilders_waitlist")
      .select("name, email, invite_count, points")
      .gt("invite_count", 0)
      .order("invite_count", { ascending: false })
      .limit(5);
    const topRefHtml = (refRows ?? []).length
      ? (refRows ?? []).map((r: any) => `<li><strong>${r.invite_count}</strong> invites · ${r.name} (${r.points} pts)</li>`).join("")
      : "<li style='color:#888'>No referrals yet</li>";

    // Recent waitlist signups (last 7d, sample 5)
    const { data: recentSignups } = await supa
      .from("storybuilders_waitlist")
      .select("name, email, created_at, referred_by_code")
      .gte("created_at", cur.start)
      .order("created_at", { ascending: false })
      .limit(5);
    const recentHtml = (recentSignups ?? []).length
      ? (recentSignups ?? []).map((s: any) => `<li>${s.name} ${s.referred_by_code ? `<span style="color:#888;font-size:12px">(via ${s.referred_by_code})</span>` : ""}</li>`).join("")
      : "<li style='color:#888'>No new signups this week</li>";

    // Build HTML
    const totalNew = wlCur + sbCur + profCur;
    const subject = `Empowered DLD weekly: ${totalNew} new signups, ${dlCur} downloads`;

    const row = (label: string, c: number, p: number, suffix = "") => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${c}${suffix}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-size:13px;color:#666;">vs ${p}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${pctChange(c, p)}</td>
      </tr>`;

    const html = `<!doctype html><html><body style="margin:0;background:#F8F5FC;font-family:'Nunito',Arial,sans-serif;color:#333;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(91,45,142,0.08);">
      <h1 style="color:${BRAND};font-size:22px;margin:0 0 4px;">Weekly summary</h1>
      <p style="color:#888;font-size:13px;margin:0 0 24px;">${cur.start} → ${cur.end} &nbsp;·&nbsp; compared to prior week</p>

      <h2 style="color:${BRAND};font-size:16px;margin:24px 0 8px;">📈 Growth at a glance</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${row("New Resource Library signups", profCur, profPrev)}
        ${row("Newsletter waitlist", wlCur, wlPrev)}
        ${row("Story Pros waitlist", sbCur, sbPrev)}
        ${row("Resource downloads", dlCur, dlPrev)}
        ${row("Completed purchases", purCur, purPrev)}
        ${row("Organization leads", leadCur, leadPrev)}
        ${row("Contact form messages", contactCur, contactPrev)}
      </table>

      <div style="margin:24px 0;padding:16px;background:#F8F5FC;border-radius:8px;text-align:center;">
        <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Revenue this week</div>
        <div style="color:${BRAND};font-size:28px;font-weight:700;margin-top:4px;">${revenue}</div>
      </div>

      <h2 style="color:${BRAND};font-size:16px;margin:32px 0 8px;">🏆 Top resources downloaded</h2>
      <ul style="font-size:14px;line-height:1.8;padding-left:20px;margin:0;">${topResourcesHtml}</ul>

      <h2 style="color:${BRAND};font-size:16px;margin:32px 0 8px;">🤝 Top Story Pros referrers (all-time)</h2>
      <ul style="font-size:14px;line-height:1.8;padding-left:20px;margin:0;">${topRefHtml}</ul>

      <h2 style="color:${BRAND};font-size:16px;margin:32px 0 8px;">👋 Recent Story Pros signups</h2>
      <ul style="font-size:14px;line-height:1.8;padding-left:20px;margin:0;">${recentHtml}</ul>

      <h2 style="color:${BRAND};font-size:16px;margin:32px 0 8px;">💡 Things to consider this week</h2>
      <ul style="font-size:14px;line-height:1.7;padding-left:20px;margin:0;color:#444;">
        <li>If Story Pros signups are flat, share your referral link or post a fresh teaser to your Facebook group.</li>
        <li>Top-downloaded resources are signals: feature them on the homepage or use them as lead magnets.</li>
        <li>Reply to any contact form messages within 24 hours — Camesha and Jinean's response time is a competitive edge.</li>
        <li>Reach out to your top referrers personally to thank them. Word-of-mouth compounds.</li>
        <li>Ask me in chat for a "site traffic report for last week" — I'll pull Facebook referrals, page views, and geographic breakdown.</li>
      </ul>

      <p style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;">
        Automated weekly digest · <a href="${SITE}" style="color:${BRAND};">empowereddld.com</a>
      </p>
    </div>
  </div></body></html>`;

    // Send via existing send-email function
    const sendRes = await supa.functions.invoke("send-email", {
      body: {
        to: RECIPIENTS,
        subject,
        html,
        bypass_suppression: true,
      },
    });

    if (sendRes.error) {
      console.error("send-email error:", sendRes.error);
      return new Response(JSON.stringify({ error: sendRes.error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ok: true, recipients: RECIPIENTS, subject, range: cur }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("weekly-app-summary error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
