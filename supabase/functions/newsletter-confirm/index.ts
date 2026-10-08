// Footer newsletter opt-in for an address that is already on file (e.g. the
// workshop list). The footer cannot prove inbox ownership, so we email a
// signed, 7-day confirmation link; only clicking it records consent and adds
// the "newsletter" tag. Actions:
//   { action: "request", email }  -> neutral reply; sends the confirmation email
//   { action: "confirm", token }  -> verifies the link, records consent, tags, welcome
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { allow, clientIp } from "../_shared/rateLimit.ts";

const SITE = "https://www.empowereddld.com";
const TTL_S = 7 * 24 * 60 * 60;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/;
const CONSENT_SOURCE = "footer-newsletter-confirmed";
const CONSENT_TEXT = "Footer newsletter form submitted, then confirmed by clicking the emailed confirmation link.";

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const b64u = (s: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = (s: string) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
};

async function mac(payload: string): Promise<string> {
  const secret = Deno.env.get("STORYPROS_DASHBOARD_SECRET");
  if (!secret) throw new Error("signing secret missing");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`newsletter-confirm:${payload}`));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function issue(email: string) {
  const payload = `n1.${b64u(email)}.${Math.floor(Date.now() / 1000) + TTL_S}`;
  return `${payload}.${await mac(payload)}`;
}

async function verify(raw: unknown): Promise<{ email: string } | { error: string }> {
  if (typeof raw !== "string" || raw.length > 600) return { error: "invalid_token" };
  const p = raw.split(".");
  if (p.length !== 4 || p[0] !== "n1" || !/^\d{9,11}$/.test(p[2])) return { error: "invalid_token" };
  const expected = await mac(`${p[0]}.${p[1]}.${p[2]}`);
  if (expected.length !== p[3].length) return { error: "invalid_token" };
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ p[3].charCodeAt(i);
  if (diff !== 0) return { error: "invalid_token" };
  if (Number(p[2]) < Math.floor(Date.now() / 1000)) return { error: "expired_token" };
  try { return { email: unb64u(p[1]) }; } catch { return { error: "invalid_token" }; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey);
  const svc = { Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" };
  const neutral = () => json({ success: true });

  // Existing contact subscribing from the footer: add the newsletter tag right
  // away (owner's choice: no extra confirmation step). Still limited to
  // addresses already on file, rate limited, suppression respected.
  if (body.action === "subscribe") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email) || email.length > 254) return json({ error: "A valid email address is required" }, 400);
    const ok = await allow(admin, [
      { bucket: "nl-direct:ip", id: clientIp(req), max: 5, windowMin: 60 },
      { bucket: "nl-direct:email", id: email, max: 2, windowMin: 60 * 24 },
    ]);
    if (!ok) return json({ error: "Too many requests. Please try again later." }, 429);
    const { data: rows } = await admin.from("waitlist").select("id").ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`)).limit(1);
    if (!rows?.length) return neutral();
    return await subscribeExisting(email, "footer-newsletter-existing",
      "Footer newsletter form submitted by an address already on file; newsletter tag added immediately.", "newsletter-direct-v1");
  }

  async function subscribeExisting(email: string, source: string, text: string, version: string) {
    const { data: blocked } = await admin.from("suppressed_emails").select("id").eq("email", email).limit(1);
    if (blocked?.length) return json({ success: true });
    const { data: prior } = await admin.from("newsletter_consents").select("id")
      .eq("email", email).in("source", [CONSENT_SOURCE, "footer-newsletter-existing"]).eq("consented", true).limit(1);
    if (prior?.length) return json({ success: true, already: true });
    const { error: insErr } = await admin.from("newsletter_consents").insert({
      email, consented: true, source, wording_version: version, checkbox_text: text, helper_text: null,
    });
    if (insErr) {
      console.error("newsletter-confirm: consent insert failed", insErr);
      return json({ error: "Could not save" }, 500);
    }
    const { data: row } = await admin.from("waitlist").select("name")
      .ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`)).limit(1).maybeSingle();
    const parts = String(row?.name ?? "").trim().split(/\s+/).filter(Boolean);
    const sub = await fetch(`${url}/functions/v1/emailoctopus-subscribe`, {
      method: "POST", headers: svc,
      body: JSON.stringify({ email, tags: ["newsletter"], first_name: parts[0] ?? "", last_name: parts.slice(1).join(" ") }),
    });
    await sub.text();
    const wel = await fetch(`${url}/functions/v1/send-email`, {
      method: "POST", headers: svc,
      body: JSON.stringify({ template: "newsletter_welcome", to: email, data: { name: row?.name ?? "" } }),
    });
    await wel.text();
    return json({ success: true });
  }

  if (body.action === "request") {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!EMAIL_RE.test(email) || email.length > 254) return json({ error: "A valid email address is required" }, 400);

    const ok = await allow(admin, [
      { bucket: "nl-confirm:ip", id: clientIp(req), max: 5, windowMin: 60 },
      { bucket: "nl-confirm:email", id: email, max: 2, windowMin: 60 * 24 },
    ]);
    if (!ok) return json({ error: "Too many requests. Please try again later." }, 429);

    // Only for addresses already on file; suppressed addresses get nothing.
    const { data: rows } = await admin.from("waitlist").select("id").ilike("email", email.replace(/[\\%_]/g, (c) => `\\${c}`)).limit(1);
    if (!rows?.length) return neutral();
    const { data: blocked } = await admin.from("suppressed_emails").select("id").eq("email", email).limit(1);
    if (blocked?.length) return neutral();

    const link = `${SITE}/newsletter/confirm?token=${encodeURIComponent(await issue(email))}`;
    const html = `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,sans-serif;color:#333;">
      <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
        <p style="font-size:15px;line-height:1.6;">Hi,</p>
        <p style="font-size:15px;line-height:1.6;">Someone asked to subscribe this email address to the Empowered DLD newsletter. Please confirm it was you.</p>
        <p style="margin:24px 0;"><a href="${link}" style="display:inline-block;background:#5B2D8E;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Confirm my subscription</a></p>
        <p style="font-size:13px;line-height:1.6;color:#666;">This link expires in 7 days. If you didn't request this, you can ignore this email and nothing will change.</p>
        <p style="font-size:13px;color:#666;">Empowered DLD</p>
      </div></body></html>`;
    const r = await fetch(`${url}/functions/v1/send-email`, {
      method: "POST", headers: svc,
      body: JSON.stringify({
        to: email,
        subject: "Confirm your Empowered DLD newsletter subscription",
        html,
        template_name: "newsletter_confirm",
      }),
    });
    await r.text();
    if (!r.ok) console.error("newsletter-confirm: send failed", r.status);
    return neutral();
  }

  if (body.action === "confirm") {
    const v = await verify(body.token);
    if ("error" in v) return json({ error: v.error }, 400);
    const email = v.email;

    return await subscribeExisting(email, CONSENT_SOURCE, CONSENT_TEXT, "newsletter-confirm-v1");
  }

  return json({ error: "Invalid action" }, 400);
});
