// Weekly Google Search Console canonical recheck.
// Inspects key URLs and emails a summary showing Google's declared canonical
// per URL, flagging any that still resolve to the www variant.
// Triggered by pg_cron (weekly). Requires x-cron-secret header.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const RECIPIENTS = ["hello@empowereddld.com"];
const SITE_URL = "https://empowereddld.com/";
const URLS_TO_INSPECT = [
  "https://empowereddld.com/",
  "https://empowereddld.com/blog",
  "https://empowereddld.com/hub",
  "https://empowereddld.com/storypros",
  "https://empowereddld.com/contact",
];

async function inspectUrl(inspectionUrl: string, lovableKey: string, gscKey: string) {
  const res = await fetch(
    "https://connector-gateway.lovable.dev/google_search_console/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gscKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inspectionUrl, siteUrl: SITE_URL }),
    }
  );
  const body = await res.text();
  if (!res.ok) {
    return { inspectionUrl, error: `HTTP ${res.status}: ${body.slice(0, 200)}` };
  }
  try {
    const json = JSON.parse(body);
    const idx = json?.inspectionResult?.indexStatusResult ?? {};
    return {
      inspectionUrl,
      verdict: idx.verdict ?? "UNKNOWN",
      coverage: idx.coverageState ?? "",
      userCanonical: idx.userCanonical ?? "",
      googleCanonical: idx.googleCanonical ?? "",
      lastCrawl: idx.lastCrawlTime ?? "",
    };
  } catch {
    return { inspectionUrl, error: "Failed to parse response" };
  }
}

async function sendEmail(subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Empowered DLD <hello@empowereddld.com>",
      to: RECIPIENTS,
      subject,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
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
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const gscKey = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    if (!lovableKey || !gscKey) {
      return new Response(JSON.stringify({ error: "Missing GSC credentials" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = await Promise.all(
      URLS_TO_INSPECT.map((u) => inspectUrl(u, lovableKey, gscKey))
    );

    const wwwFlagged = results.filter(
      (r: any) => r.googleCanonical && r.googleCanonical.includes("www.")
    );

    const rows = results
      .map((r: any) => {
        if (r.error) {
          return `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${r.inspectionUrl}</td>
            <td colspan="3" style="padding:8px;border-bottom:1px solid #eee;color:#b3261e;">${r.error}</td></tr>`;
        }
        const isWww = r.googleCanonical?.includes("www.");
        const badge = isWww
          ? `<span style="color:#b3261e;font-weight:600;">www ⚠</span>`
          : `<span style="color:#1a7f4e;font-weight:600;">non-www ✓</span>`;
        return `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${r.inspectionUrl}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px;">${r.verdict}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;color:#555;">${r.googleCanonical || "—"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${badge}</td>
        </tr>`;
      })
      .join("");

    const subject = wwwFlagged.length
      ? `GSC recheck: ${wwwFlagged.length}/${results.length} still on www`
      : `GSC recheck: all ${results.length} URLs on non-www ✓`;

    const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#333;background:#F8F5FC;margin:0;">
      <div style="max-width:720px;margin:0 auto;padding:24px;">
        <div style="background:#fff;border-radius:12px;padding:28px;">
          <h1 style="color:#5B2D8E;font-size:20px;margin:0 0 8px;">GSC canonical recheck</h1>
          <p style="margin:0 0 16px;color:#666;font-size:14px;">${new Date().toUTCString()}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead><tr style="background:#F3EDFA;">
              <th style="padding:8px;text-align:left;">URL</th>
              <th style="padding:8px;text-align:left;">Verdict</th>
              <th style="padding:8px;text-align:left;">Google canonical</th>
              <th style="padding:8px;text-align:right;">Status</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin-top:20px;font-size:13px;color:#666;">
            ${wwwFlagged.length ? "Some URLs still report a www canonical. Google may take longer to re-crawl." : "All inspected URLs report a non-www canonical."}
          </p>
        </div>
      </div>
    </body></html>`;

    await sendEmail(subject, html);

    return new Response(
      JSON.stringify({ ok: true, checked: results.length, wwwFlagged: wwwFlagged.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("gsc-canonical-recheck error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
