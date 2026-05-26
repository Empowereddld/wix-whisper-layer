// Generic Resend-powered email sender used by all transactional + bulk flows.
// Sends from "Empowered DLD <hello@mail.empowereddld.com>" via the Lovable connector gateway.
// Filters recipients against the suppressed_emails list before sending.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Empowered DLD <hello@mail.empowereddld.com>";
const REPLY_TO = "hello@empowereddld.com";
const SITE_URL = "https://www.empowereddld.com";

interface SendEmailRequest {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
  from?: string;
  // If true, append the unsubscribe footer (use for bulk campaigns).
  // Defaults to false for transactional sends.
  include_unsubscribe?: boolean;
  // If true, skip suppression filtering. Use ONLY for hard transactional
  // (e.g., password resets, purchase receipts). Default false.
  bypass_suppression?: boolean;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function defaultWrap(subject: string, bodyHtml: string, unsubscribeFooter: string) {
  const brand = "#5B2D8E";
  return `<!doctype html><html><body style="margin:0;background:#F8F5FC;font-family:'Nunito',Arial,sans-serif;color:#333;">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(91,45,142,0.08);">
        <h1 style="color:${brand};font-size:22px;margin:0 0 16px;">${escapeHtml(subject)}</h1>
        <div style="font-size:15px;line-height:1.6;">${bodyHtml}</div>
        <p style="margin-top:32px;font-size:13px;color:#666;">— The Empowered DLD Team</p>
      </div>
      <p style="text-align:center;color:#999;font-size:12px;margin-top:16px;">
        Empowered DLD · <a href="${SITE_URL}" style="color:${brand};">empowereddld.com</a>
      </p>
      ${unsubscribeFooter}
    </div></body></html>`;
}

function unsubFooter(email: string) {
  const url = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  return `<p style="text-align:center;color:#aaa;font-size:11px;margin-top:8px;">
    Don't want these emails? <a href="${url}" style="color:#aaa;text-decoration:underline;">Unsubscribe</a>
  </p>`;
}

function appendFooterToHtml(html: string, footer: string) {
  // Try to inject before closing body, else append.
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${footer}</body>`);
  return html + footer;
}

// Privileged caller check: either x-cron-secret matches CRON_SECRET (cron jobs
// and edge-to-edge calls) OR Authorization JWT belongs to an admin user.
// Public callers (contact forms, signup) get only the safe defaults.
async function isPrivileged(req: Request): Promise<boolean> {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret && req.headers.get("x-cron-secret") === cronSecret) return true;

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return false;

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (serviceKey && token === serviceKey) return true;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: userRes } = await supabase.auth.getUser(token);
    if (!userRes?.user) return false;
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userRes.user.id)
      .eq("role", "admin")
      .maybeSingle();
    return !!roleRow;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as SendEmailRequest;
    const { to, subject, html, text, reply_to, from, include_unsubscribe = false, bypass_suppression = false } = payload;

    if (!to || !subject || (!html && !text)) {
      return new Response(JSON.stringify({ error: "to, subject, and html or text are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Privileged-only options: custom `from` and `bypass_suppression`.
    // Public callers (contact form, signup welcome) cannot spoof the sender
    // domain or email people who unsubscribed.
    const privileged = (from || bypass_suppression) ? await isPrivileged(req) : false;
    if (from && !privileged) {
      return new Response(JSON.stringify({ error: "Custom 'from' requires privileged caller" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (bypass_suppression && !privileged) {
      return new Response(JSON.stringify({ error: "bypass_suppression requires privileged caller" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableKey) throw new Error("LOVABLE_API_KEY not configured");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    let recipients = (Array.isArray(to) ? to : [to])
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Filter against suppression list unless explicitly bypassed by a privileged caller.
    let suppressed = 0;
    if (!bypass_suppression && recipients.length > 0) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data: blocked } = await supabase
        .from("suppressed_emails")
        .select("email")
        .in("email", recipients);
      const blockedSet = new Set((blocked || []).map((r: any) => r.email));
      const before = recipients.length;
      recipients = recipients.filter((e) => !blockedSet.has(e));
      suppressed = before - recipients.length;
    }

    if (recipients.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0, suppressed, results: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resend allows up to 50 recipients per call. Chunk for bulk sends.
    // For bulk campaigns we send individually so each recipient gets their own
    // unsubscribe link. For transactional we batch.
    const sendIndividually = include_unsubscribe;
    const chunks: string[][] = sendIndividually
      ? recipients.map((r) => [r])
      : (() => {
          const out: string[][] = [];
          for (let i = 0; i < recipients.length; i += 50) out.push(recipients.slice(i, i + 50));
          return out;
        })();

    const results: any[] = [];
    for (const chunk of chunks) {
      const recipientForFooter = chunk[0]; // only meaningful when sendIndividually
      const footer = include_unsubscribe ? unsubFooter(recipientForFooter) : "";
      const finalHtml = html
        ? include_unsubscribe ? appendFooterToHtml(html, footer) : html
        : defaultWrap(subject, `<p>${escapeHtml(text!)}</p>`, footer);

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

    return new Response(
      JSON.stringify({ success: true, sent: recipients.length, suppressed, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Send failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
