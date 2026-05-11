// Validates a Founder claim token (waitlist row UUID) and accepts the
// shipping/inscription submission OR an edit to an existing submission.
// The token is the storybuilders_waitlist.id embedded in the Tier 6 Founder
// unlock email link as ?token=...
//
// GET  /claim-founder-package?token=<uuid>
//   -> { ok, user: { name, email, founder_slot_number, already_claimed, submission } }
//
// POST /claim-founder-package  { token, ...formFields }
//   -> { ok: true, updated: boolean } (insert or update)
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
        .select(
          "id, submitted_at, updated_at, recipient_name, shipping_street, shipping_street2, shipping_city, shipping_region, shipping_postal_code, shipping_country, shipping_phone, inscription_to, inscription_note, additional_notes"
        )
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
          submission: existing ?? null,
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

      const { data: existing } = await supabase
        .from("founder_claims")
        .select("id")
        .eq("waitlist_id", w.id)
        .maybeSingle();

      const payload = {
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
        additional_notes: additional_notes || null,
      };

      let updated = false;
      if (existing) {
        const { error: updateError } = await supabase
          .from("founder_claims")
          .update(payload)
          .eq("id", existing.id);
        if (updateError) {
          console.error("founder_claims update failed:", updateError);
          return json({ ok: false, error: "update_failed" }, 500);
        }
        updated = true;
      } else {
        const { error: insertError } = await supabase
          .from("founder_claims")
          .insert(payload);
        if (insertError) {
          console.error("founder_claims insert failed:", insertError);
          return json({ ok: false, error: "insert_failed" }, 500);
        }
      }

      // Fire-and-forget confirmation email (does not block response)
      const firstName = w.name?.split(" ")[0] || "friend";
      const subject = updated
        ? `Your Founder details have been updated, ${firstName}`
        : `Your Founder package is locked in, ${firstName}`;
      const intro = updated
        ? `<p>We've updated your shipping and inscription details for Founder slot
           <strong>#${w.founder_slot_number}</strong>. The new details are below.</p>`
        : `<p>We've received your shipping details and inscription preferences for Founder slot
           <strong>#${w.founder_slot_number}</strong>. Once all 20 Founder slots are claimed,
           we'll ship your signed Dan &amp; Daria book. We'll email a tracking number when it's on the way.</p>`;

      supabase.functions
        .invoke("send-email", {
          body: {
            to: w.email,
            subject,
            html: `
              <p>Hi ${firstName},</p>
              ${intro}
              <p><strong>Shipping to:</strong><br/>
                ${escapeHtml(recipient_name)}<br/>
                ${escapeHtml(shipping_street)}${shipping_street2 ? "<br/>" + escapeHtml(shipping_street2) : ""}<br/>
                ${escapeHtml(shipping_city)}, ${escapeHtml(shipping_region)} ${escapeHtml(shipping_postal_code)}<br/>
                ${escapeHtml(shipping_country)}
              </p>
              <p><strong>Book inscription:</strong> "To ${escapeHtml(inscription_to)}"${
                inscription_note ? ` &mdash; ${escapeHtml(inscription_note)}` : ""
              }</p>
              <p>Need to change anything? Tap the same button in your Tier 6 email to edit your details anytime before fulfillment.</p>
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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
