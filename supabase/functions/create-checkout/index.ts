import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { allow, clientIp } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Return links use only known Empowered DLD sites; anything else falls back to the main domain.
const ALLOWED_ORIGINS = new Set([
  "https://www.empowereddld.com",
  "https://empowereddld.com",
  "https://wix-whisper-layer.lovable.app",
  "https://id-preview--51a660d5-acfd-48f5-86f4-38b3ac526ca2.lovable.app",
]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Checkout works for signed-in hub members and for guests (no account).
// Guests get no user_id anywhere; Stripe collects their email at checkout and
// fulfillment is proven later by the unguessable checkout session id.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Optional auth: a valid token means a signed-in member, otherwise guest.
    const authHeader = req.headers.get("Authorization");
    let user: { id: string; email?: string } | null = null;
    if (authHeader) {
      const userClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data } = await userClient.auth.getUser();
      user = data?.user ?? null;
    }

    // Guest checkout is public, so bound it per network (hashed, short retention).
    if (!user) {
      const ok = await allow(admin, [
        { bucket: "create-checkout", id: clientIp(req), max: 10, windowMin: 60 },
      ]);
      if (!ok) return json({ error: "Too many attempts. Please try again later." }, 429);
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid request" }, 400);
    }
    const resource_id = typeof body.resource_id === "string" ? body.resource_id.trim() : "";
    if (!UUID_RE.test(resource_id)) {
      return json({ error: "Invalid resource" }, 400);
    }
    const newsletterOptIn = body.newsletter_opt_in === true;

    // Get product and resource info
    const { data: product, error: prodErr } = await admin
      .from("products")
      .select("id, price, currency, stripe_price_id, resource_id")
      .eq("resource_id", resource_id)
      .eq("is_active", true)
      .single();

    if (prodErr || !product) {
      return json({ error: "Product not found" }, 404);
    }

    const { data: resource } = await admin
      .from("resources")
      .select("title")
      .eq("id", resource_id)
      .single();

    // Signed-in members cannot buy the same resource twice.
    if (user) {
      const { data: existing } = await admin
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("resource_id", resource_id)
        .eq("status", "completed")
        .limit(1)
        .single();

      if (existing) {
        return json({ error: "Already purchased" }, 400);
      }
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get or create Stripe price
    let stripePriceId = product.stripe_price_id;

    if (!stripePriceId) {
      const stripeProduct = await stripe.products.create({
        name: resource?.title || "DLD Resource",
        metadata: { resource_id, product_id: product.id },
      });

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: product.currency.toLowerCase(),
      });

      stripePriceId = stripePrice.id;

      await admin
        .from("products")
        .update({ stripe_price_id: stripePriceId })
        .eq("id", product.id);
    }

    // Check for existing Stripe customer (signed-in members only)
    let customerId: string | undefined;
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      customerId = customers.data.length > 0 ? customers.data[0].id : undefined;
    }

    const requestOrigin = (req.headers.get("origin") || "").replace(/\/+$/, "");
    const origin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : "https://www.empowereddld.com";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      ...(user
        ? {
            customer: customerId,
            customer_email: customerId ? undefined : user.email,
            client_reference_id: user.id,
            payment_intent_data: { receipt_email: user.email },
          }
        : {}),
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "payment",
      success_url: user
        ? `${origin}/hub/payment-success?session_id={CHECKOUT_SESSION_ID}`
        : `${origin}/shop/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: user
        ? `${origin}/hub/resource/${resource_id}`
        : `${origin}/shop/parent-guidebook`,
      metadata: {
        ...(user ? { user_id: user.id } : { guest: "true" }),
        resource_id,
        product_id: product.id,
        amount: String(product.price),
        currency: product.currency,
        newsletter_opt_in: newsletterOptIn ? "true" : "false",
      },
    });

    return json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return json({ error: err instanceof Error ? err.message : "Internal server error" }, 500);
  }
});
