import { createClient } from "npm:@supabase/supabase-js@2";

// Receives Shopify "Order creation" webhooks. Every request must carry a valid
// HMAC signature made with the store's webhook signing key, so nobody else can
// insert fake orders.
async function validHmac(raw: string, header: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const expected = btoa(String.fromCharCode(...new Uint8Array(sig)));
  if (expected.length !== header.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ header.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");
  if (!secret) return new Response("Not configured", { status: 503 });

  const raw = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256") ?? "";
  if (!hmac || !(await validHmac(raw, hmac, secret))) {
    return new Response("Unauthorized", { status: 401 });
  }

  let o: any;
  try { o = JSON.parse(raw); } catch { return new Response("Bad request", { status: 400 }); }
  if (!o?.id) return new Response("Bad request", { status: 400 });

  const c = o.customer ?? {};
  const name = [c.first_name, c.last_name].filter(Boolean).join(" ") ||
    [o.billing_address?.first_name, o.billing_address?.last_name].filter(Boolean).join(" ") || null;
  const items = (o.line_items ?? []).map((li: any) => ({
    title: String(li.title ?? "").slice(0, 200),
    variant: li.variant_title ? String(li.variant_title).slice(0, 200) : null,
    quantity: Number(li.quantity) || 0,
    price: li.price ?? null,
  }));

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin.from("merch_orders").upsert({
    shopify_order_id: String(o.id),
    order_name: o.name ?? null,
    customer_name: name,
    customer_email: o.email ?? c.email ?? null,
    items,
    total_price: o.total_price ? Number(o.total_price) : null,
    currency: o.currency ?? null,
    financial_status: o.financial_status ?? null,
    ordered_at: o.created_at ?? null,
  }, { onConflict: "shopify_order_id" });
  if (error) {
    console.error("merch order save failed", error.message);
    return new Response("Error", { status: 500 });
  }
  return new Response("ok");
});
