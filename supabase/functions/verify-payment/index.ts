import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { allow, clientIp } from "../_shared/rateLimit.ts";
import { fulfillCheckout } from "../_shared/fulfillCheckout.ts";
import { issueAccessToken } from "../_shared/guidebookAccess.ts";
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
    const result = await fulfillCheckout(admin, session);
    if (result.kind === "pending") return json({ pending: true });
    if (result.kind === "invalid") {
      return json({ error: result.reason === "not_paid" ? "Payment not completed" : "Invalid payment" }, 400);
    }
    if (result.kind === "error") return json({ error: "Failed to record purchase" }, 500);

    const analyticsPurchase = await guidebookMeasurement(session.id, result.resourceId, session.currency || "", session.amount_total ?? 0);

    // Guests get a per-purchase access pass (exchanged for a 5-minute link by
    // guidebook-download). The session id is only good for this exchange
    // shortly after checkout, never as a lasting key. A repeat payment by a
    // buyer who already owns the guidebook unlocks their existing purchase.
    const GUEST_EXCHANGE_WINDOW_S = 48 * 60 * 60;
    const guestFields = async () => {
      if (Math.floor(Date.now() / 1000) - (session.created ?? 0) > GUEST_EXCHANGE_WINDOW_S) {
        return { access_token: null, confirmation_email_accepted: false };
      }
      let q = admin.from("purchases")
        .select("id, status, access_status, access_token_version, confirmation_email_status");
      const email = session.customer_details?.email;
      q = result.duplicatePayment && email
        ? q.ilike("customer_email", email).eq("resource_id", result.resourceId).eq("status", "completed").is("user_id", null)
        : q.eq("stripe_checkout_session_id", session.id);
      const { data: row } = await q.limit(1).maybeSingle();
      const ok = row && row.status === "completed" && row.access_status === "active";
      return {
        access_token: ok ? await issueAccessToken(row.id, row.access_token_version) : null,
        confirmation_email_accepted: row?.confirmation_email_status === "accepted",
      };
    };

    return json({
      success: true,
      ...(result.recordedNow ? {} : { already_recorded: true }),
      resource_id: result.resourceId,
      analytics_purchase: analyticsPurchase,
      ...(result.isGuest ? await guestFields() : {}),
    });
  } catch (err) {
    console.error("Verify error:", err instanceof Error ? err.message : err);
    return json({ error: "Internal server error" }, 500);
  }
});
