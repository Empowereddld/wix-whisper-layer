// Single recording step for paid Checkout Sessions, shared by verify-payment
// (customer returns from Stripe) and stripe-webhook (Stripe notifies us), so a
// purchase is recorded once and its receipt is sent once whichever arrives first.
// deno-lint-ignore-file no-explicit-any
import type Stripe from "https://esm.sh/stripe@18.5.0";
import { escapeHtml } from "./html.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NEWSLETTER_CHECKBOX_TEXT =
  "Email me practical DLD strategies and new resources. You can unsubscribe anytime.";

export type FulfillResult =
  | { kind: "pending" }
  | { kind: "invalid"; reason: string }
  | { kind: "error" }
  | {
    kind: "ok";
    recordedNow: boolean;
    purchaseId: string | null;
    resourceId: string;
    isGuest: boolean;
    duplicatePayment: boolean;
  };

/** Delayed methods finish checkout before money arrives: never paid yet. */
export function sessionIsPending(s: { mode?: string | null; status?: string | null; payment_status?: string | null }) {
  return s.mode === "payment" &&
    (s.status === "open" || (s.status === "complete" && s.payment_status === "unpaid"));
}

export async function fulfillCheckout(admin: any, session: Stripe.Checkout.Session): Promise<FulfillResult> {
  if (sessionIsPending(session)) return { kind: "pending" };
  if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") {
    return { kind: "invalid", reason: "not_paid" };
  }
  const metadata = session.metadata || {};
  const isGuest = metadata.guest === "true";
  const resourceId = metadata.resource_id;
  const productId = metadata.product_id;
  if (!resourceId || !productId || !UUID_RE.test(resourceId) || !UUID_RE.test(productId)) {
    return { kind: "invalid", reason: "metadata" };
  }
  if (!isGuest && (!metadata.user_id || !UUID_RE.test(metadata.user_id))) {
    return { kind: "invalid", reason: "metadata" };
  }

  const { data: product } = await admin.from("products")
    .select("id, resource_id, price, currency, stripe_price_id")
    .eq("id", productId).eq("resource_id", resourceId).maybeSingle();
  if (!product) return { kind: "invalid", reason: "product" };

  const items = session.line_items?.data ?? [];
  const itemOk = items.length === 1 && (items[0].quantity ?? 0) === 1 &&
    !!product.stripe_price_id && items[0].price?.id === product.stripe_price_id;
  const currencyOk = (session.currency || "").toLowerCase() === String(product.currency).toLowerCase();
  const amountPaid = session.amount_total ?? 0;
  if (!itemOk || !currencyOk || amountPaid <= 0) {
    console.warn("fulfill mismatch", { session: session.id, itemOk, currencyOk, amountPaid });
    return { kind: "invalid", reason: "mismatch" };
  }

  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent : session.payment_intent?.id ?? null;
  const userId = isGuest ? null : metadata.user_id;
  const customerEmail = session.customer_details?.email || null;

  const findBySession = async () => {
    const { data } = await admin.from("purchases").select("id, status")
      .or(paymentIntentId
        ? `stripe_checkout_session_id.eq.${session.id},stripe_payment_intent_id.eq.${paymentIntentId}`
        : `stripe_checkout_session_id.eq.${session.id}`)
      .limit(1).maybeSingle();
    return data;
  };

  const prior = await findBySession();
  if (prior) {
    return { kind: "ok", recordedNow: false, purchaseId: prior.id, resourceId, isGuest,
      duplicatePayment: prior.status === "duplicate_payment" };
  }

  const row = {
    user_id: userId,
    customer_email: isGuest ? customerEmail : null,
    resource_id: resourceId,
    product_id: product.id,
    amount_paid: amountPaid,
    currency: (session.currency || product.currency).toUpperCase(),
    status: "completed",
    stripe_payment_intent_id: paymentIntentId,
    stripe_checkout_session_id: session.id,
  };
  const { data: inserted, error } = await admin.from("purchases").insert(row).select("id").maybeSingle();

  if (error) {
    if ((error as { code?: string }).code !== "23505") {
      console.error("fulfill insert error:", error.message);
      return { kind: "error" };
    }
    // Same session recorded concurrently by the other path?
    const again = await findBySession();
    if (again) {
      return { kind: "ok", recordedNow: false, purchaseId: again.id, resourceId, isGuest,
        duplicatePayment: again.status === "duplicate_payment" };
    }
    // Otherwise this buyer already owns the resource: a second, separate payment.
    // Record it (not as a sale granting new access) so it can be refunded.
    const { data: dup, error: dupErr } = await admin.from("purchases")
      .insert({ ...row, status: "duplicate_payment" }).select("id").maybeSingle();
    if (dupErr) {
      const existing = await findBySession();
      if (existing) {
        return { kind: "ok", recordedNow: false, purchaseId: existing.id, resourceId, isGuest, duplicatePayment: true };
      }
      console.error("fulfill duplicate insert error:", dupErr.message);
      return { kind: "error" };
    }
    console.warn("duplicate payment recorded", { purchase: dup?.id });
    return { kind: "ok", recordedNow: true, purchaseId: dup?.id ?? null, resourceId, isGuest, duplicatePayment: true };
  }

  await sendReceipt(admin, { isGuest, resourceId, amountPaid, currency: session.currency || "",
    to: customerEmail || (isGuest ? null : await memberEmail(admin, userId!)), sessionId: session.id });

  if (isGuest && metadata.newsletter_opt_in === "true" && customerEmail) {
    try {
      await admin.from("newsletter_consents").insert({
        email: customerEmail.toLowerCase(), consented: true, source: "guidebook-purchase",
        wording_version: "guidebook-checkout-v1", checkbox_text: NEWSLETTER_CHECKBOX_TEXT,
      });
      await admin.functions.invoke("emailoctopus-subscribe", { body: { email: customerEmail, tags: ["newsletter"] } });
    } catch {
      console.warn("Newsletter opt-in failed");
    }
  }

  return { kind: "ok", recordedNow: true, purchaseId: inserted?.id ?? null, resourceId, isGuest, duplicatePayment: false };
}

async function memberEmail(admin: any, userId: string): Promise<string | null> {
  try {
    const { data } = await admin.auth.admin.getUserById(userId);
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

// Interim receipt; Stage 4 replaces the guest version with the approved template.
async function sendReceipt(admin: any, p: {
  isGuest: boolean; resourceId: string; amountPaid: number; currency: string; to: string | null; sessionId: string;
}) {
  if (!p.to) return;
  try {
    const { data: resource } = await admin.from("resources").select("title").eq("id", p.resourceId).maybeSingle();
    const title = escapeHtml(resource?.title || "Resource");
    const amountStr = `$${(p.amountPaid / 100).toFixed(2)} ${p.currency.toUpperCase()}`;
    const accessBlock = p.isGuest
      ? `<p><a href="https://www.empowereddld.com/shop/payment-success?session_id=${p.sessionId}" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Download Your Resource</a></p>`
      : `<p>Your resource is now unlocked in your Resource Library.</p>
         <p><a href="https://www.empowereddld.com/hub/resource/${p.resourceId}" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Access Your Resource</a></p>`;
    await admin.functions.invoke("send-email", {
      body: {
        to: p.to,
        subject: `Your Empowered DLD purchase: ${title}`,
        bypass_suppression: true,
        html: `<p>Hi there,</p><p>Thanks for your purchase!</p>
          <p><strong>Item:</strong> ${title}<br/><strong>Amount:</strong> ${amountStr}</p>
          ${accessBlock}<p>Need help? Just reply to this email.</p>`,
      },
    });
  } catch {
    console.warn("Receipt email failed");
  }
}

/** Access policy for refunds and disputes (pure, unit tested). */
export function accessAfterCharge(c: {
  amount: number; amount_refunded: number; disputed: boolean; dispute_status?: string | null;
}): { status?: "refunded"; access_status: "active" | "suspended" | "revoked"; reason: string } {
  if (c.disputed && c.dispute_status === "lost") return { status: "refunded", access_status: "revoked", reason: "dispute_lost" };
  if (c.amount > 0 && c.amount_refunded >= c.amount) return { status: "refunded", access_status: "revoked", reason: "full_refund" };
  if (c.disputed && c.dispute_status && c.dispute_status !== "won" && c.dispute_status !== "warning_closed") {
    return { access_status: "suspended", reason: "dispute_open" };
  }
  if (c.disputed && (c.dispute_status === "won" || c.dispute_status === "warning_closed")) {
    return { access_status: "active", reason: "dispute_won" };
  }
  return { access_status: "active", reason: c.amount_refunded > 0 ? "partial_refund" : "paid" };
}
