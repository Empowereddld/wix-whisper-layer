// Generic Resend-powered email sender used by all transactional + bulk flows.
// Sends from "Empowered DLD <hello@mail.empowereddld.com>" via the Lovable connector gateway.
//
// Two calling modes:
//
//  1) PUBLIC TEMPLATE MODE — { template, to, data } only.
//     Public callers (contact form, footer newsletter, org lead form, hub welcome)
//     can ONLY pick from the server-side TEMPLATES registry below. They cannot
//     control the subject, the HTML body, the from address, the reply_to,
//     or bypass_suppression. This stops the function from being used as an
//     open phishing/spam relay.
//
//  2) PRIVILEGED RAW MODE — { to, subject, html|text, ... } (legacy).
//     Used by cron jobs, edge-to-edge service-role calls, and admin "send test"
//     / bulk campaigns. Requires CRON_SECRET, service-role key, or an admin JWT.
//
// Filters recipients against the suppressed_emails list before sending.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { allow, clientIp } from "../_shared/rateLimit.ts";
import { unsubscribeUrl } from "../_shared/unsubscribeToken.ts";

const SUBMISSION_WINDOW_MIN = 15;

function likeEscape(s: string) {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

type Resolved =
  | { ok: true; to: string; data: Record<string, unknown> }
  | { ok: false; status: number; error: string };

// Checks that a public template matches a form submission saved in the last
// few minutes, and returns the stored values to render with. Also rate limits
// by hashed visitor network and hashed recipient.
async function resolvePublicTemplate(
  req: Request,
  template: string,
  callerTo: string,
  data: Record<string, unknown>,
): Promise<Resolved> {
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const since = new Date(Date.now() - SUBMISSION_WINDOW_MIN * 60_000).toISOString();
  const notFound: Resolved = { ok: false, status: 403, error: "No matching recent submission" };

  let to = callerTo.trim().toLowerCase();
  let out: Record<string, unknown> = {};

  // Which address the submission must match.
  const subjectEmail = template === "contact_internal_notification"
    ? String(data.email ?? "").trim().toLowerCase()
    : to;
  if (template !== "hub_welcome" && (!subjectEmail || subjectEmail.length > 320 || !subjectEmail.includes("@"))) {
    return { ok: false, status: 400, error: "Valid email required" };
  }

  const latest = async (table: string, cols: string) => {
    const { data: rows } = await admin.from(table).select(cols)
      .ilike("email", likeEscape(subjectEmail)).gte("created_at", since)
      .order("created_at", { ascending: false }).limit(1);
    return (rows && rows[0]) as Record<string, any> | undefined;
  };

  switch (template) {
    case "contact_user_confirmation":
    case "contact_internal_notification": {
      const row = await latest("contact_submissions", "first_name, last_name, email, company_name, position, questions");
      if (!row) return notFound;
      out = {
        firstName: row.first_name, lastName: row.last_name ?? "", email: row.email,
        companyName: row.company_name, position: row.position ?? "", questions: row.questions,
      };
      break;
    }
    case "newsletter_welcome": {
      const row = await latest("waitlist", "name");
      if (!row) return notFound;
      out = { name: row.name };
      break;
    }
    case "org_lead_confirmation": {
      const row = await latest("lead_captures", "name, organization_name");
      if (!row) return notFound;
      out = { name: row.name, orgName: row.organization_name ?? "" };
      break;
    }
    case "hub_welcome": {
      const auth = req.headers.get("authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
      const { data: u } = token ? await admin.auth.getUser(token) : { data: null as any };
      const user = u?.user;
      if (!user?.email) return { ok: false, status: 401, error: "Sign in required" };
      to = user.email.toLowerCase();
      const { data: prof } = await admin.from("profiles").select("first_name").eq("id", user.id).maybeSingle();
      out = { firstName: prof?.first_name || to.split("@")[0] };
      break;
    }
    default:
      return { ok: false, status: 400, error: "Unknown template" };
  }

  const ok = await allow(admin, [
    { bucket: "send-email:ip", id: clientIp(req), max: 20, windowMin: 60 },
    { bucket: `send-email:${template}:to`, id: template === "contact_internal_notification" ? subjectEmail : to, max: 3, windowMin: 60 * 24 },
  ]);
  if (!ok) return { ok: false, status: 429, error: "Too many requests. Please try again later." };

  return { ok: true, to, data: out };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Empowered DLD <hello@mail.empowereddld.com>";
const REPLY_TO = "hello@empowereddld.com";
const INTERNAL_INBOX = "hello@empowereddld.com";
const SITE_URL = "https://www.empowereddld.com";

interface SendEmailRequest {
  // Public template mode
  template?: string;
  data?: Record<string, unknown>;
  // Raw / privileged mode
  to?: string | string[];
  subject?: string;
  html?: string;
  text?: string;
  reply_to?: string;
  from?: string;
  include_unsubscribe?: boolean;
  bypass_suppression?: boolean;
  template_name?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function asString(v: unknown, max = 500): string {
  return String(v ?? "").slice(0, max);
}

function firstNameFrom(v: unknown): string {
  const s = asString(v, 120).trim();
  if (!s) return "there";
  return s.split(/\s+/)[0];
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

async function unsubFooter(email: string) {
  const url = await unsubscribeUrl(SITE_URL, email);
  return `<p style="text-align:center;color:#aaa;font-size:11px;margin-top:8px;">
    Don't want these emails? <a href="${url}" style="color:#aaa;text-decoration:underline;">Unsubscribe</a>
  </p>`;
}

function appendFooterToHtml(html: string, footer: string) {
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${footer}</body>`);
  return html + footer;
}

// ---------------------------------------------------------------------------
// Server-side template registry — these are the only emails public callers
// (signup forms, contact form, etc.) can send. Each entry returns subject +
// html. The HTML is rendered here, NOT supplied by the client.
// ---------------------------------------------------------------------------

type RenderedTemplate = {
  subject: string;
  html: string;
  /** Where to send. If omitted, the caller-supplied `to` is used. */
  toOverride?: string;
  /** Optional reply_to override (e.g. internal notifications reply to the user). */
  replyTo?: string;
};

type TemplateFn = (data: Record<string, unknown>, callerTo: string) => RenderedTemplate;

const TEMPLATES: Record<string, TemplateFn> = {
  // 1) Contact form — confirmation back to the person who filled it out.
  contact_user_confirmation: (data, _to) => {
    const firstName = escapeHtml(firstNameFrom(data.firstName));
    const message = escapeHtml(asString(data.questions, 5000));
    return {
      subject: "We received your message, Empowered DLD",
      html: `<p>Hi ${firstName},</p>
             <p>Thanks for reaching out to Empowered DLD! We've received your message and a member of our team will get back to you within <strong>48 hours</strong>.</p>
             <p><strong>What you sent us:</strong></p>
             <blockquote style="border-left:3px solid #5B2D8E;padding:8px 16px;color:#555;background:#F8F5FC;">${message.replace(/\n/g, "<br>")}</blockquote>
             <p>In the meantime, feel free to explore our <a href="https://empowereddld.com/resources" style="color:#5B2D8E;">Resource Library</a> for guides, tools, and resources to support people with Developmental Language Disorder.</p>
             <p>Have questions? Don't hesitate to reach out.</p>
             <p>— The Empowered DLD Team</p>`,
    };
  },

  // 2) Contact form — internal notification to the team. Always goes to our
  //    own inbox regardless of what `to` the caller passes.
  contact_internal_notification: (data, _to) => {
    const firstName = escapeHtml(asString(data.firstName, 120));
    const lastName = escapeHtml(asString(data.lastName, 120));
    const email = escapeHtml(asString(data.email, 320));
    const company = escapeHtml(asString(data.companyName, 200));
    const position = escapeHtml(asString(data.position, 200)) || "—";
    const message = escapeHtml(asString(data.questions, 5000)).replace(/\n/g, "<br>");
    return {
      toOverride: INTERNAL_INBOX,
      replyTo: asString(data.email, 320) || REPLY_TO,
      subject: `New contact form: ${asString(data.firstName, 120)} ${asString(data.lastName, 120)} (${asString(data.companyName, 200)})`.slice(0, 200),
      html: `<p><strong>From:</strong> ${firstName} ${lastName} &lt;${email}&gt;</p>
             <p><strong>Company:</strong> ${company}</p>
             <p><strong>Position:</strong> ${position}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    };
  },

  // 3) Footer newsletter signup welcome.
  newsletter_welcome: (data, _to) => {
    const firstName = escapeHtml(firstNameFrom(data.name));
    return {
      subject: "Welcome to the Empowered DLD community",
      html: `<p>Hi ${firstName},</p>
             <p>Thanks for joining the Empowered DLD community! We're so glad you're here.</p>
             <p>Here's what you can expect from us:</p>
             <ul style="line-height:1.7;color:#444;">
               <li>New tools and resources to support people with Developmental Language Disorder</li>
               <li>Practical tips for parents, therapists, and educators</li>
               <li>Updates on our books, workshops, and upcoming projects</li>
             </ul>
             <p>Want to dive in right now? Explore our Resource Library for guides, tools, and resources you can use today.</p>
             <p><a href="https://empowereddld.com/hub/preview" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Explore the Resource Library →</a></p>
             <p>Talk soon,<br/>The Empowered DLD Team</p>
             <p style="font-size:12px;color:#999;margin-top:24px;">You're receiving this because you signed up at empowereddld.com. You can unsubscribe anytime.</p>`,
    };
  },

  // 4) Organizations lead form — acknowledgment to the person who inquired.
  org_lead_confirmation: (data, _to) => {
    const firstName = escapeHtml(firstNameFrom(data.name));
    const orgName = escapeHtml(asString(data.orgName, 200)) || "your organization";
    return {
      subject: "Thanks for reaching out, Empowered DLD",
      html: `<p>Hi ${firstName},</p>
             <p>Thank you for getting in touch about how Empowered DLD can support <strong>${orgName}</strong>. We received your inquiry and a member of our team will personally respond within 1–2 business days.</p>
             <p>In the meantime, feel free to explore our <a href="https://empowereddld.com/hub/preview" style="color:#5B2D8E;font-weight:600;">Resource Library</a> for guides, tools, and resources to support people with Developmental Language Disorder.</p>
             <p>Talk soon,<br/>The Empowered DLD Team</p>`,
    };
  },

  // 5) Resource Library welcome (after a logged-in user finishes onboarding).
  hub_welcome: (data, _to) => {
    const firstName = escapeHtml(firstNameFrom(data.firstName));
    return {
      subject: "Welcome to Empowered DLD 💜",
      html: `<p>Hi ${firstName},</p>
             <p>Welcome to Empowered DLD! Your Resource Library account is ready.</p>
             <p>You now have access to evidence-based tools, guides, and printable resources designed to help people with Developmental Language Disorder thrive at home, in the classroom, and in therapy.</p>
             <p><a href="https://www.empowereddld.com/hub" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Go to My Hub →</a></p>
             <p>Have questions? Don't hesitate to reach out.</p>`,
    };
  },
};

// ---------------------------------------------------------------------------
// Privileged-caller detection
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as SendEmailRequest;

    // ---- Template mode (public-safe) ---------------------------------------
    let resolvedSubject: string | undefined;
    let resolvedHtml: string | undefined;
    let resolvedTo: string | string[] | undefined = payload.to;
    let resolvedReplyTo: string | undefined = payload.reply_to;
    let resolvedFrom: string | undefined = payload.from;
    let resolvedBypassSuppression = payload.bypass_suppression ?? false;
    let resolvedIncludeUnsubscribe = payload.include_unsubscribe ?? false;
    let resolvedTemplateName = payload.template_name;

    if (payload.template) {
      const tpl = TEMPLATES[payload.template];
      if (!tpl) {
        return new Response(JSON.stringify({ error: `Unknown template: ${payload.template}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const callerTo = Array.isArray(payload.to) ? payload.to[0] : (payload.to || "");
      if (!callerTo || typeof callerTo !== "string") {
        return new Response(JSON.stringify({ error: "to is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Public templates only send for a real, just-saved form submission,
      // using the stored values (never caller-supplied text or recipients).
      // Exception: trusted server callers (e.g. newsletter-confirm after a
      // verified confirmation click) may send the newsletter welcome directly.
      const verified: Resolved = payload.template === "newsletter_welcome" && await isPrivileged(req)
        ? { ok: true, to: callerTo.trim().toLowerCase(), data: { name: payload.data?.name ?? "" } }
        : await resolvePublicTemplate(req, payload.template, callerTo, payload.data || {});
      if (!verified.ok) {
        return new Response(JSON.stringify({ error: verified.error }), {
          status: verified.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const rendered = tpl(verified.data, verified.to);

      // In template mode, server is source of truth. Caller-supplied subject,
      // html, from, bypass_suppression, include_unsubscribe are IGNORED.
      resolvedSubject = rendered.subject;
      resolvedHtml = rendered.html;
      resolvedTo = rendered.toOverride ?? callerTo;
      resolvedReplyTo = rendered.replyTo ?? REPLY_TO;
      resolvedFrom = undefined; // always default FROM
      resolvedBypassSuppression = false;
      resolvedIncludeUnsubscribe = false;
      resolvedTemplateName = payload.template;
    } else {
      // ---- Raw mode — privileged only -------------------------------------
      const privileged = await isPrivileged(req);
      if (!privileged) {
        return new Response(
          JSON.stringify({
            error: "Raw send requires a template. Pass { template, to, data } instead, or call as a privileged caller.",
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      resolvedSubject = payload.subject;
      resolvedHtml = payload.html;
      if (!resolvedTo || !resolvedSubject || (!resolvedHtml && !payload.text)) {
        return new Response(
          JSON.stringify({ error: "to, subject, and html or text are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableKey) throw new Error("LOVABLE_API_KEY not configured");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    let recipients = (Array.isArray(resolvedTo) ? resolvedTo : [resolvedTo!])
      .map((e) => String(e).trim().toLowerCase())
      .filter(Boolean);

    // Filter against suppression list unless explicitly bypassed by a privileged caller.
    let suppressed = 0;
    if (!resolvedBypassSuppression && recipients.length > 0) {
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
    const sendIndividually = resolvedIncludeUnsubscribe;
    const chunks: string[][] = sendIndividually
      ? recipients.map((r) => [r])
      : (() => {
          const out: string[][] = [];
          for (let i = 0; i < recipients.length; i += 50) out.push(recipients.slice(i, i + 50));
          return out;
        })();

    const results: any[] = [];
    for (const chunk of chunks) {
      const recipientForFooter = chunk[0];
      const footer = resolvedIncludeUnsubscribe ? await unsubFooter(recipientForFooter) : "";
      const finalHtml = resolvedHtml
        ? resolvedIncludeUnsubscribe ? appendFooterToHtml(resolvedHtml, footer) : resolvedHtml
        : defaultWrap(resolvedSubject!, `<p>${escapeHtml(payload.text!)}</p>`, footer);

      const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resolvedFrom ?? FROM,
          to: chunk,
          subject: resolvedSubject,
          html: finalHtml,
          reply_to: resolvedReplyTo ?? REPLY_TO,
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

      try {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );
        const messageId = (data as { id?: string })?.id ?? null;
        const rows = chunk.map((recipient) => ({
          message_id: messageId,
          template_name: resolvedTemplateName || "transactional",
          recipient_email: recipient,
          status: "sent",
        }));
        if (rows.length > 0) {
          await supabase.from("email_send_log").insert(rows);
        }
      } catch (logErr) {
        console.error("email_send_log insert failed:", logErr);
      }
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
