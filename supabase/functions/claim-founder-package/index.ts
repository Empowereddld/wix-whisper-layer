// Founder claim endpoint. Accepts ONLY the signed, expiring token embedded in
// the Tier 6 Founder email by dispatch-tier-emails:
//   "<waitlist_id>.<exp_unix_seconds>.<hmac>"
// Plain waitlist IDs, tampered tokens and expired tokens are refused.
//
// GET  ?token=...  -> minimal status only (first name, slot, claimed yes/no,
//                     date, masked email). Never returns address/phone/notes.
// POST { token, confirm_replace?, ...fields } -> insert, or replace an existing
//                     claim only when confirm_replace === true.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const FOUNDER_SLOT_CAP = 20;

const isUuid = (s: unknown): s is string =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

type TokenResult = { id: string } | { error: "invalid_token" | "expired_token" };

async function verifyClaimToken(raw: unknown): Promise<TokenResult> {
  if (typeof raw !== "string") return { error: "invalid_token" };
  const parts = raw.split(".");
  if (parts.length !== 3) return { error: "invalid_token" };
  const [id, expStr, sig] = parts;
  if (!isUuid(id) || !/^\d{9,11}$/.test(expStr) || !sig) return { error: "invalid_token" };
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`founder-claim:v2:${id}:${expStr}`),
  );
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  if (expected.length !== sig.length) return { error: "invalid_token" };
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return { error: "invalid_token" };
  if (Number(expStr) * 1000 < Date.now()) return { error: "expired_token" };
  return { id };
}

const trimStr = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const maskEmail = (e: string | null) => {
  if (!e || !e.includes("@")) return "";
  const [u, d] = e.split("@");
  return `${u.slice(0, 1)}${"*".repeat(Math.max(1, Math.min(u.length - 1, 5)))}@${d}`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const loadEligible = async (id: string) => {
    const { data: w } = await supabase
      .from("storybuilders_waitlist")
      .select("id, name, email, founder_slot_number, points, deleted_at")
      .eq("id", id)
      .maybeSingle();
    if (!w || w.deleted_at) return { err: json({ ok: false, error: "not_found" }, 404) };
    if (!w.founder_slot_number || w.founder_slot_number > FOUNDER_SLOT_CAP || (w.points ?? 0) < 500) {
      return { err: json({ ok: false, error: "not_eligible" }, 403) };
    }
    return { w };
  };

  try {
    if (req.method === "GET") {
      const v = await verifyClaimToken(new URL(req.url).searchParams.get("token"));
      if ("error" in v) return json({ ok: false, error: v.error }, 401);
      const { w, err } = await loadEligible(v.id);
      if (err) return err;

      const { data: existing } = await supabase
        .from("founder_claims")
        .select("submitted_at")
        .eq("waitlist_id", w!.id)
        .maybeSingle();

      return json({
        ok: true,
        user: {
          first_name: w!.name?.split(" ")[0] || "",
          masked_email: maskEmail(w!.email),
          founder_slot_number: w!.founder_slot_number,
          already_claimed: !!existing,
          submitted_at: existing?.submitted_at ?? null,
        },
      });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const v = await verifyClaimToken(body?.token);
      if ("error" in v) return json({ ok: false, error: v.error }, 401);

      const fields = {
        recipient_name: trimStr(body.recipient_name, 120),
        shipping_street: trimStr(body.shipping_street, 200),
        shipping_street2: trimStr(body.shipping_street2, 200),
        shipping_city: trimStr(body.shipping_city, 120),
        shipping_region: trimStr(body.shipping_region, 120),
        shipping_postal_code: trimStr(body.shipping_postal_code, 30),
        shipping_country: trimStr(body.shipping_country, 80),
        shipping_phone: trimStr(body.shipping_phone, 40),
        inscription_to: trimStr(body.inscription_to, 80),
        inscription_note: trimStr(body.inscription_note, 280),
        additional_notes: trimStr(body.additional_notes, 500),
      };
      const requiredKeys = [
        "recipient_name", "shipping_street", "shipping_city", "shipping_region",
        "shipping_postal_code", "shipping_country", "inscription_to",
      ] as const;
      const missing = requiredKeys.filter((k) => !fields[k]);
      if (missing.length) return json({ ok: false, error: "missing_fields", fields: missing }, 400);

      const { w, err } = await loadEligible(v.id);
      if (err) return err;

      const { data: existing } = await supabase
        .from("founder_claims")
        .select("id")
        .eq("waitlist_id", w!.id)
        .maybeSingle();

      if (existing && body?.confirm_replace !== true) {
        return json({ ok: false, error: "confirm_required" }, 409);
      }

      const payload = {
        waitlist_id: w!.id,
        founder_slot_number: w!.founder_slot_number,
        ...fields,
        shipping_street2: fields.shipping_street2 || null,
        shipping_phone: fields.shipping_phone || null,
        inscription_note: fields.inscription_note || null,
        additional_notes: fields.additional_notes || null,
      };

      const updated = !!existing;
      const { error: writeError } = existing
        ? await supabase.from("founder_claims").update(payload).eq("id", existing.id)
        : await supabase.from("founder_claims").insert(payload);
      if (writeError) {
        console.error("founder_claims write failed:", writeError);
        return json({ ok: false, error: "save_failed" }, 500);
      }

      // Confirmation email to the address on file (not caller-chosen).
      const firstName = escapeHtml(w!.name?.split(" ")[0] || "friend");
      const subject = updated
        ? `Your Founder details have been updated, ${firstName}`
        : `Your Founder package is locked in, ${firstName}`;
      const intro = updated
        ? `<p>We've replaced your shipping and inscription details for Founder slot
           <strong>#${w!.founder_slot_number}</strong>. The new details are below.</p>`
        : `<p>We've received your shipping details and inscription preferences for Founder slot
           <strong>#${w!.founder_slot_number}</strong>. Once all 20 Founder slots are claimed,
           we'll ship your signed Dan &amp; Daria book. We'll email a tracking number when it's on the way.</p>`;
      const f = fields;
      supabase.functions
        .invoke("send-email", {
          body: {
            to: w!.email,
            subject,
            html: `
              <p>Hi ${firstName},</p>
              ${intro}
              <p><strong>Shipping to:</strong><br/>
                ${escapeHtml(f.recipient_name)}<br/>
                ${escapeHtml(f.shipping_street)}${f.shipping_street2 ? "<br/>" + escapeHtml(f.shipping_street2) : ""}<br/>
                ${escapeHtml(f.shipping_city)}, ${escapeHtml(f.shipping_region)} ${escapeHtml(f.shipping_postal_code)}<br/>
                ${escapeHtml(f.shipping_country)}
              </p>
              <p><strong>Book inscription:</strong> "To ${escapeHtml(f.inscription_to)}"${
                f.inscription_note ? `, ${escapeHtml(f.inscription_note)}` : ""
              }</p>
              <p>Need to change anything? Tap the same button in your Tier 6 email and submit your details again before fulfillment.</p>
              <p>Warmly,<br/>Camesha, Jinean and the Story Pros Team</p>
            `,
          },
        })
        .catch((e) => console.warn("Founder confirmation email failed:", e));

      return json({ ok: true, updated });
    }

    return json({ ok: false, error: "method_not_allowed" }, 405);
  } catch (err) {
    console.error("claim-founder-package error:", err);
    return json({ ok: false, error: "internal" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
