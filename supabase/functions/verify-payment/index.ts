import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Fulfillment is decided only from the Stripe Checkout Session fetched server-side
// with our secret key. The browser supplies nothing but the session id; every
// other value (user, product, resource, amount) comes from Stripe and our DB.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

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

    // Must belong to the signed-in user (set server-side in create-checkout).
    if (metadata.user_id !== user.id ||
        (session.client_reference_id && session.client_reference_id !== user.id)) {
      return json({ error: "Not your payment" }, 403);
    }

    // Must be a completed, paid, one-time payment.
    if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") {
      return json({ error: "Payment not completed", status: session.payment_status }, 400);
    }

    const resourceId = metadata.resource_id;
    const productId = metadata.product_id;
    if (!resourceId || !productId || !UUID_RE.test(resourceId) || !UUID_RE.test(productId)) {
      return json({ error: "Invalid payment" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

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
      if (prior.user_id !== user.id) return json({ error: "Not your payment" }, 403);
      return json({ success: true, already_recorded: true, resource_id: prior.resource_id });
    }

    // Insert; unique indexes block duplicates even under concurrent calls.
    const { error: insertError } = await admin.from("purchases").insert({
      user_id: user.id,
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
        return json({ success: true, already_recorded: true, resource_id: resourceId });
      }
      console.error("Insert error:", insertError.message);
      return json({ error: "Failed to record purchase" }, 500);
    }

    // Receipt only on first fulfillment (fire-and-forget).
    try {
      const { data: resource } = await admin
        .from("resources").select("title").eq("id", resourceId).maybeSingle();
      const amountStr = `$${(amountPaid / 100).toFixed(2)} ${(session.currency || "").toUpperCase()}`;
      const customerEmail = session.customer_details?.email || user.email;
      if (customerEmail) {
        await admin.functions.invoke("send-email", {
          body: {
            to: customerEmail,
            subject: `Your Empowered DLD purchase: ${resource?.title || "Resource"}`,
            bypass_suppression: true,
            html: `<p>Hi there,</p>
              <p>Thanks for your purchase! Your resource is now unlocked in your Resource Library.</p>
              <p><strong>Item:</strong> ${(resource?.title || "Resource").replace(/[<>&"]/g, "")}<br/>
              <strong>Amount:</strong> ${amountStr}</p>
              <p><a href="https://www.empowereddld.com/hub/resource/${resourceId}" style="display:inline-block;background:#5B2D8E;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;">Access Your Resource</a></p>
              <p>Need help? Just reply to this email.</p>`,
          },
        });
      }
    } catch {
      console.warn("Receipt email failed");
    }

    return json({ success: true, resource_id: resourceId });
  } catch (err) {
    console.error("Verify error:", err instanceof Error ? err.message : err);
    return json({ error: "Internal server error" }, 500);
  }
});
