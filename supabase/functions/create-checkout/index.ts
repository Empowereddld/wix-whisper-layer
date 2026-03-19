import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { resource_id } = await req.json();
    if (!resource_id) {
      return new Response(JSON.stringify({ error: "resource_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Get product and resource info
    const { data: product, error: prodErr } = await admin
      .from("products")
      .select("id, price, currency, stripe_price_id, resource_id")
      .eq("resource_id", resource_id)
      .eq("is_active", true)
      .single();

    if (prodErr || !product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: resource } = await admin
      .from("resources")
      .select("title")
      .eq("id", resource_id)
      .single();

    // Check if already purchased
    const { data: existing } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("resource_id", resource_id)
      .eq("status", "completed")
      .limit(1)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ error: "Already purchased" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get or create Stripe price
    let stripePriceId = product.stripe_price_id;

    if (!stripePriceId) {
      // Create Stripe product and price
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

      // Save stripe_price_id back to DB
      await admin
        .from("products")
        .update({ stripe_price_id: stripePriceId })
        .eq("id", product.id);
    }

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    const origin = req.headers.get("origin") || "https://wix-whisper-layer.lovable.app";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/hub/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/hub/resource/${resource_id}`,
      metadata: {
        user_id: user.id,
        resource_id,
        product_id: product.id,
        amount: String(product.price),
        currency: product.currency,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
