// Validates a Founder claim token (waitlist row UUID) and accepts the
// shipping/inscription submission. The token is the storybuilders_waitlist.id
// embedded in the Tier 6 Founder unlock email link as ?token=...
//
// GET  /claim-founder-package?token=<uuid>
//   -> { ok, user: { name, email, founder_slot_number, already_claimed } }
//
// POST /claim-founder-package  { token, ...formFields }
//   -> { ok: true } and queues a confirmation email.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const FOUNDER_SLOT_CAP = 50;

const isUuid = (s: unknown): s is string =>
  typeof s === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const trimStr = (v: unknown, max = 500) => {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const token = url.searchParams.get("token") ?? "";
      if (!isUuid(token)) {
        return json({ ok: false, error: "invalid_token" }, 400);
      }

      const { data: w, error } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, email, founder_slot_number, points, deleted_at")
        .eq("id", token)
        .maybeSingle();

      if (error || !w) return json({ ok: false, error: "not_found" }, 404);
      if (w.deleted_at) return json({ ok: false, error: "not_found" }, 404);
      if (
        !w.founder_slot_number ||
        w.founder_slot_number > FOUNDER_SLOT_CAP ||
        (w.points ?? 0) < 500
      ) {
        return json({ ok: false, error: "not_eligible" }, 403);
      }

      const { data: existing } = await supabase
        .from("founder_claims")
        .select("id, submitted_at")
        .eq("waitlist_id", w.id)
        .maybeSingle();

      return json({
        ok: true,
        user: {
          name: w.name,
          email: w.email,
          founder_slot_number: w.founder_slot_number,
          already_claimed: !!existing,
          submitted_at: existing?.submitted_at ?? null,
        },
      });
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const token = body?.token;
      if (!isUuid(token)) return json({ ok: false, error: "invalid_token" }, 400);

      const recipient_name = trimStr(body.recipient_name, 120);
      const shipping_street = trimStr(body.shipping_street, 200);
      const shipping_street2 = trimStr(body.shipping_street2, 200);
      const shipping_city = trimStr(body.shipping_city, 120);
      const shipping_region = trimStr(body.shipping_region, 120);
      const shipping_postal_code = trimStr(body.shipping_postal_code, 30);
      const shipping_country = trimStr(body.shipping_country, 80);
      const shipping_phone = trimStr(body.shipping_phone, 40);
      const inscription_to = trimStr(body.inscription_to, 80);
      const inscription_note = trimStr(body.inscription_note, 280);
      const merch_size = trimStr(body.merch_size, 20);
      const additional_notes = trimStr(body.additional_notes, 500);

      const required = {
        recipient_name,
        shipping_street,
        shipping_city,
        shipping_region,
        shipping_postal_code,
        shipping_country,
        inscription_to,
      };
      const missing = Object.entries(required)
        .filter(([, v]) => !v)
        .map(([k]) => k);
      if (missing.length) {
        return json({ ok: false, error: "missing_fields", fields: missing }, 400);
      }

      // Re-validate eligibility
      const { data: w } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, email, founder_slot_number, points, deleted_at")
        .eq("id", token)
        .maybeSingle();

      if (!w || w.deleted_at) return json({ ok: false, error: "not_found" }, 404);
      if (
        !w.founder_slot_number ||
        w.founder_slot_number > FOUNDER_SLOT_CAP ||
        (w.points ?? 0) < 500
      ) {
        return json({ ok: false, error: "not_eligible" }, 403);
      }

      const { error: insertError } = await supabase.from("founder_claims").insert({
        waitlist_id: w.id,
        founder_slot_number: w.founder_slot_number,
        recipient_name,
        shipping_street,
        shipping_street2: shipping_street2 || null,
        shipping_city,
        shipping_region,
        shipping_postal_code,
        shipping_country,
        shipping_phone: shipping_phone || null,
        inscription_to,
        inscription_note: inscription_note || null,
        merch_size: merch_size || null,
        additional_notes: additional_notes || null,
      });

      if (insertError) {
        // Unique violation = already submitted
        if ((insertError as any).code === "23505") {
          return json({ ok: true, already_claimed: true });
        }
        console.error("founder_claims insert failed:", insertError);
        return json({ ok: false, error: "insert_failed" }, 500);
      }

      // Fire-and-forget confirmation email (does not block response)
      supabase.functions
        .invoke("send-email", {
          body: {
            to: w.email,
            subject: `Your Founder package is locked in, ${w.name?.split(" ")[0] || "friend"}`,
            html: `
              <p>Hi ${w.name?.split(" ")[0] || "friend"},</p>
              <p>We've received your shipping details and inscription preferences for Founder slot
              <strong>#${w.founder_slot_number}</strong>. Once all 50 Founder slots are claimed,
              we'll ship your signed Dan &amp; Daria book and DLD-themed merch together.</p>
              <p><strong>Shipping to:</strong><br/>
                ${escapeHtml(recipient_name)}<br/>
                ${escapeHtml(shipping_street)}${shipping_street2 ? "<br/>" + escapeHtml(shipping_street2) : ""}<br/>
                ${escapeHtml(shipping_city)}, ${escapeHtml(shipping_region)} ${escapeHtml(shipping_postal_code)}<br/>
                ${escapeHtml(shipping_country)}
              </p>
              <p><strong>Book inscription:</strong> "To ${escapeHtml(inscription_to)}"${
                inscription_note ? ` — ${escapeHtml(inscription_note)}` : ""
              }</p>
              <p>If anything looks off, reply to this email and we'll fix it before fulfillment.</p>
              <p>Warmly,<br/>Camesha, Jinean and the Story Pros Team</p>
            `,
          },
        })
        .catch((e) => console.warn("Founder confirmation email failed:", e));

      return json({ ok: true });
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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
