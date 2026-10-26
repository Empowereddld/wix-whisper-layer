// Stripe notifications: records paid checkouts even if the customer closed the
// tab, waits for delayed payments, and applies the refund/dispute access policy.
// Authenticated only by Stripe's signature (STRIPE_WEBHOOK_SECRET).
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fulfillCheckout, accessAfterCharge } from "../_shared/fulfillCheckout.ts";

const ok = (body: unknown = { received: true }, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return ok({ error: "Method not allowed" }, 405);
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    console.error("stripe-webhook: signing secret not configured");
    return ok({ error: "Not configured" }, 503);
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) return ok({ error: "Missing signature" }, 400);

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, secret, undefined, Stripe.createSubtleCryptoProvider());
  } catch {
    return ok({ error: "Invalid signature" }, 400);
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const s = event.data.object as Stripe.Checkout.Session;
        // Re-fetch from Stripe so we act on current state, not the event copy.
        const session = await stripe.checkout.sessions.retrieve(s.id, { expand: ["line_items"] });
        const r = await fulfillCheckout(admin, session);
        console.log("webhook fulfill", { event: event.id, type: event.type, result: r.kind });
        // A server error makes Stripe retry later; invalid/pending are final for this event.
        if (r.kind === "error") return ok({ error: "retry" }, 500);
        break;
      }
      case "checkout.session.async_payment_failed":
        console.log("webhook delayed payment failed", { event: event.id });
        break;
      case "charge.refunded":
      case "charge.dispute.created":
      case "charge.dispute.updated":
      case "charge.dispute.closed":
      case "charge.dispute.funds_reinstated": {
        const obj = event.data.object as Stripe.Charge | Stripe.Dispute;
        const chargeId = typeof (obj as Stripe.Dispute).charge === "string"
          ? (obj as Stripe.Dispute).charge as string
          : (obj as Stripe.Charge).id;
        const charge = await stripe.charges.retrieve(chargeId, { expand: ["dispute"] });
        const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        if (!pi) break;
        const dispute = charge.dispute && typeof charge.dispute === "object" ? charge.dispute : null;
        const decision = accessAfterCharge({
          amount: charge.amount, amount_refunded: charge.amount_refunded,
          disputed: !!dispute, dispute_status: dispute?.status ?? null,
        });
        const { data: row } = await admin.from("purchases")
          .select("id, status, access_status, access_token_version").eq("stripe_payment_intent_id", pi).maybeSingle();
        if (!row) break;
        const update: Record<string, unknown> = {
          amount_refunded: charge.amount_refunded,
          access_status: decision.access_status,
          access_change_reason: decision.reason,
          access_changed_at: new Date().toISOString(),
        };
        if (decision.status) {
          update.status = decision.status;
          if (!charge.refunded && decision.reason === "full_refund") update.refunded_at = new Date().toISOString();
          if (decision.reason === "full_refund") update.refunded_at = new Date().toISOString();
        } else if (row.status === "refunded" && decision.reason === "dispute_won") {
          update.status = "completed";
        }
        if (row.status === "duplicate_payment" && !decision.status) delete update.access_status;
        await admin.from("purchases").update(update).eq("id", row.id);
        console.log("webhook access", { event: event.id, purchase: row.id, decision: decision.reason });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("stripe-webhook error", err instanceof Error ? err.message : err);
    return ok({ error: "retry" }, 500);
  }
  return ok();
});
