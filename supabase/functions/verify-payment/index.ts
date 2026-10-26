import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { allow, clientIp } from "../_shared/rateLimit.ts";
import { escapeHtml } from "../_shared/html.ts";
import { guidebookMeasurement } from "../_shared/guidebookMeasurement.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Exact checkbox wording shown on the guidebook page; stored with the consent record.
const NEWSLETTER_CHECKBOX_TEXT =
  "Email me practical DLD strategies and new resources. You can unsubscribe anytime.";

// Fulfillment is decided only from the Stripe Checkout Session fetched server-side
// with our secret key. The browser supplies nothing but the session id; every
// other value (user, product, resource, amount) comes from Stripe and our DB.
//
// Two caller types:
//  - Signed-in members: session metadata.user_id must match the caller.
//  - Guests (metadata.guest = "true"): the unguessable checkout session id is the
//    proof of purchase. Only the buyer receives it in the Stripe redirect, and the
//    confirmation email links back to it. Guests get a short-lived signed
//    download URL instead of hub access.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* handled below */ }
    const sessionId = typeof body.session_id === "string" ? body.session_id.trim() : "";
    if (!SESSION_ID_RE.test(sessionId)) return json({ error: "Invalid session" }, 400);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
    } catch {
      return json({ error: "Invalid session" }, 400);
    }

    const metadata = session.metadata || {};
    const isGuest = metadata.guest === "true";

    // Optional auth: required for member purchases, ignored for guest ones.
    let user: { id: string; email?: string } | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data } = await userClient.auth.getUser();
      user = data?.user ?? null;
    }

    if (isGuest) {
      // Public endpoint: bound verification attempts per network.
      const ok = await allow(admin, [
        { bucket: "verify-payment", id: clientIp(req), max: 30, windowMin: 60 },
      ]);
      if (!ok) return json({ error: "Too many attempts. Please try again later." }, 429);
    } else {
      // Member purchase: must belong to the signed-in user (set server-side in create-checkout).
      if (!user) return json({ error: "Unauthorized" }, 401);
      if (metadata.user_id !== user.id ||
          (session.client_reference_id && session.client_reference_id !== user.id)) {
        return json({ error: "Not your payment" }, 403);
      }
    }

    // Must be a completed, paid, one-time payment.
    // Delayed methods (e.g. bank debits) finish checkout before money arrives:
    // report "pending" so the page keeps waiting, never grant access early.
    if (session.mode === "payment" && (session.status === "open" ||
        (session.status === "complete" && session.payment_status === "unpaid"))) {
      return json({ pending: true });
    }
    if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") {
      return json({ error: "Payment not completed", status: session.payment_status }, 400);
    }

    const resourceId = metadata.resource_id;
    const productId = metadata.product_id;
    if (!resourceId || !productId || !UUID_RE.test(resourceId) || !UUID_RE.test(productId)) {
      return json({ error: "Invalid payment" }, 400);
    }

    // Product must be the one for this resource, and what was paid for must match it.
    const { data: product } = await admin
      .from("products")
      .select("id, resource_id, price, currency, stripe_price_id")
      .eq("id", productId)
      .eq("resource_id", resourceId)
      .maybeSingle();
    if (!product) return json({ error: "Invalid payment" }, 400);

    const items = session.line_items?.data ?? [];
    const itemOk = items.length === 1 &&
      (items[0].quantity ?? 0) === 1 &&
      !!product.stripe_price_id &&
      items[0].price?.id === product.stripe_price_id;
    const currencyOk = (session.currency || "").toLowerCase() === String(product.currency).toLowerCase();
    const amountPaid = session.amount_total ?? 0;
    if (!itemOk || !currencyOk || amountPaid <= 0) {
      console.warn("verify-payment mismatch", { session: session.id, itemOk, currencyOk, amountPaid });
      return json({ error: "Payment does not match this product" }, 400);
    }

    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
    const analyticsPurchase = await guidebookMeasurement(session.id, resourceId, session.currency || "", amountPaid);

    // Guests get a per-purchase access pass (exchanged for a 5-minute link by
    // guidebook-download); members use the hub. The session id is only good
    // for this exchange shortly after checkout, never as a lasting key.
    const GUEST_EXCHANGE_WINDOW_S = 48 * 60 * 60;
    const emailAccepted = async (): Promise<boolean> => {
      const { data: row } = await admin.from("purchases")
        .select("confirmation_email_status")
        .eq("stripe_checkout_session_id", session.id).maybeSingle();
      return row?.confirmation_email_status === "accepted";
    };
    const guestFields = async () => ({
      access_token: await guestAccessToken(),
      confirmation_email_accepted: await emailAccepted(),
    });
    const guestAccessToken = async (): Promise<string | null> => {
      if (Math.floor(Date.now() / 1000) - (session.created ?? 0) > GUEST_EXCHANGE_WINDOW_S) return null;
      const { data: row } = await admin.from("purchases")
        .select("id, status, access_status, access_token_version")
        .eq("stripe_checkout_session_id", session.id).maybeSingle();
      if (!row || row.status !== "completed" || row.access_status !== "active") return null;
      return await issueAccessToken(row.id, row.access_token_version);
    };

    // Idempotency: this session/payment already fulfilled?
    const { data: prior } = await admin
      .from("purchases")
      .select("id, user_id, resource_id")
      .or(
        paymentIntentId
          ? `stripe_checkout_session_id.eq.${session.id},stripe_payment_intent_id.eq.${paymentIntentId}`
          : `stripe_checkout_session_id.eq.${session.id}`,
      )
      .limit(1)
      .maybeSingle();
    if (prior) {
      if (!isGuest && prior.user_id !== user?.id) return json({ error: "Not your payment" }, 403);
      return json({
        success: true,
        already_recorded: true,
        resource_id: prior.resource_id,
        analytics_purchase: analyticsPurchase,
        ...(isGuest ? await guestFields() : {}),
      });
    }

    const customerEmail = session.customer_details?.email || null;

    // Insert; unique indexes block duplicates even under concurrent calls.
    const { error: insertError } = await admin.from("purchases").insert({
      user_id: isGuest ? null : user?.id,
      customer_email: isGuest ? customerEmail : null,
      resource_id: resourceId,
      product_id: product.id,
      amount_paid: amountPaid,
      currency: (session.currency || product.currency).toUpperCase(),
      status: "completed",
      stripe_payment_intent_id: paymentIntentId,
      stripe_checkout_session_id: session.id,
    });

    if (insertError) {
      if ((insertError as { code?: string }).code === "23505") {
        return json({
          success: true,
          already_recorded: true,
          resource_id: resourceId,
          analytics_purchase: analyticsPurchase,
          ...(isGuest ? await guestFields() : {}),
        });
      }
      console.error("Insert error:", insertError.message);
      return json({ error: "Failed to record purchase" }, 500);
    }

    // Receipt only on first fulfillment (fire-and-forget).
    try {
      const { data: resource } = await admin
        .from("resources").select("title").eq("id", resourceId).maybeSingle();
      const title = escapeHtml(resource?.title || "Resource");
      const amountStr = `$${(amountPaid / 100).toFixed(2)} ${(session.currency || "").toUpperCase()}`;
      const to = customerEmail || user?.email;
      if (to) {
        const accessBlock = isGuest
          ? `<p><a href="https://www.empowereddld.com/shop/payment-success?session_id=${session.id}" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Download Your Resource</a></p>
             <p>Keep this email. The link above takes you back to your download page anytime.</p>`
          : `<p>Your resource is now unlocked in your Resource Library.</p>
             <p><a href="https://www.empowereddld.com/hub/resource/${resourceId}" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Access Your Resource</a></p>`;
        await admin.functions.invoke("send-email", {
          body: {
            to,
            subject: `Your Empowered DLD purchase: ${title}`,
            bypass_suppression: true,
            html: `<p>Hi there,</p>
              <p>Thanks for your purchase!</p>
              <p><strong>Item:</strong> ${title}<br/>
              <strong>Amount:</strong> ${amountStr}</p>
              ${accessBlock}
              <p>Need help? Just reply to this email.</p>`,
          },
        });
      }
    } catch {
      console.warn("Receipt email failed");
    }

    // Newsletter opt-in: only when the buyer explicitly checked the box at checkout.
    // Record the affirmative consent first (append-only), then sync the tag.
    if (isGuest && metadata.newsletter_opt_in === "true" && customerEmail) {
      try {
        await admin.from("newsletter_consents").insert({
          email: customerEmail.toLowerCase(),
          consented: true,
          source: "guidebook-purchase",
          wording_version: "guidebook-checkout-v1",
          checkbox_text: NEWSLETTER_CHECKBOX_TEXT,
        });
        await admin.functions.invoke("emailoctopus-subscribe", {
          body: { email: customerEmail, tags: ["newsletter"] },
        });
      } catch {
        console.warn("Newsletter opt-in failed");
      }
    }

    return json({
      success: true,
      resource_id: resourceId,
      analytics_purchase: analyticsPurchase,
      ...(isGuest ? await guestFields() : {}),
    });
  } catch (err) {
    console.error("Verify error:", err instanceof Error ? err.message : err);
    return json({ error: "Internal server error" }, 500);
  }
});
