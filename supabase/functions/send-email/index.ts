// Generic Resend-powered email sender used by all transactional + bulk flows.
// Sends from "Empowered DLD <hello@mail.empowereddld.com>".

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Empowered DLD <hello@mail.empowereddld.com>";
const REPLY_TO = "hello@empowereddld.com";

interface SendEmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
  from?: string;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function defaultWrap(subject: string, bodyHtml: string) {
  const brand = "#5B2D8E";
  return `<!doctype html><html><body style="margin:0;background:#F8F5FC;font-family:'Nunito',Arial,sans-serif;color:#333;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(91,45,142,0.08);">
        <h1 style="color:${brand};font-size:22px;margin:0 0 16px;">${escapeHtml(subject)}</h1>
        <div style="font-size:15px;line-height:1.6;">${bodyHtml}</div>
        <p style="margin-top:32px;font-size:13px;color:#666;">— The Empowered DLD Team</p>
      </div>
      <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">
        Empowered DLD · <a href="https://empowereddld.com" style="color:${brand};">empowereddld.com</a>
      </p>
    </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as SendEmailRequest;
    const { to, subject, html, text, reply_to, from } = payload;

    if (!to || !subject || (!html && !text)) {
      return new Response(JSON.stringify({ error: "to, subject, and html or text are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableKey) throw new Error("LOVABLE_API_KEY not configured");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const finalHtml = html ?? defaultWrap(subject, `<p>${escapeHtml(text!)}</p>`);
    const recipients = Array.isArray(to) ? to : [to];

    // Resend allows up to 50 recipients per call. Chunk for bulk sends.
    const chunks: string[][] = [];
    for (let i = 0; i < recipients.length; i += 50) chunks.push(recipients.slice(i, i + 50));

    const results: any[] = [];
    for (const chunk of chunks) {
      const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: from ?? FROM,
          to: chunk,
          subject,
          html: finalHtml,
          reply_to: reply_to ?? REPLY_TO,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Resend error:", data);
        return new Response(JSON.stringify({ error: data?.message || "Resend send failed", details: data }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      results.push(data);
    }

    return new Response(JSON.stringify({ success: true, sent: recipients.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Send failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
