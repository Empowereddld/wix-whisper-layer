import "https://deno.land/std@0.224.0/dotenv/load.ts";

const URL_ = Deno.env.get("VITE_SUPABASE_URL")!;
const KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const SECRET = Deno.env.get("STORYPROS_DASHBOARD_SECRET");
const EMAIL = "delivered+b71791402284@resend.dev";

const b64u = (s: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function mac(p: string) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET!), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const s = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(`newsletter-confirm:${p}`));
  return btoa(String.fromCharCode(...new Uint8Array(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function call(token: string) {
  const r = await fetch(`${URL_}/functions/v1/newsletter-confirm`, {
    method: "POST", headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "confirm", token }),
  });
  return `${r.status} ${await r.text()}`;
}

Deno.test("confirm flow", async () => {
  if (!SECRET || !EMAIL) { console.log("secret or email unavailable here"); return; }
  const now = Math.floor(Date.now() / 1000);
  const exp = `n1.${b64u(EMAIL)}.${now - 10}`;
  console.log("expired:", await call(`${exp}.${await mac(exp)}`));
  const ok = `n1.${b64u(EMAIL)}.${now + 3600}`;
  console.log("valid:", await call(`${ok}.${await mac(ok)}`));
  console.log("repeat:", await call(`${ok}.${await mac(ok)}`));
});
