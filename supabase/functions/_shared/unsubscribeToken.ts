// Signed unsubscribe tokens. A typed-in email is never authorization to unsubscribe.
// Format: "u1.<base64url(email)>.<expires_at>.<hmac>" (unix seconds).
// Valid 365 days so links in older emails keep working well past legal minimums.
// Signed with STORYPROS_DASHBOARD_SECRET using a separate "unsubscribe:" domain.
export const UNSUB_TTL_S = 365 * 24 * 60 * 60;

const b64u = (s: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(s)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = (s: string) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
};

async function mac(payload: string): Promise<string> {
  const secret = Deno.env.get("STORYPROS_DASHBOARD_SECRET");
  if (!secret) throw new Error("signing secret missing");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`unsubscribe:${payload}`));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function issueUnsubscribeToken(email: string, ttl = UNSUB_TTL_S): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const payload = `u1.${b64u(email.trim().toLowerCase())}.${exp}`;
  return `${payload}.${await mac(payload)}`;
}

export async function unsubscribeUrl(siteBase: string, email: string): Promise<string> {
  return `${siteBase}/unsubscribe?token=${encodeURIComponent(await issueUnsubscribeToken(email))}`;
}

export async function verifyUnsubscribeToken(
  raw: unknown,
): Promise<{ email: string } | { error: "invalid_token" | "expired_token"; email?: string }> {
  if (typeof raw !== "string" || raw.length > 600) return { error: "invalid_token" };
  const parts = raw.split(".");
  if (parts.length !== 4 || parts[0] !== "u1" || !/^\d{9,11}$/.test(parts[2])) return { error: "invalid_token" };
  const expected = await mac(`${parts[0]}.${parts[1]}.${parts[2]}`);
  const sig = parts[3];
  if (expected.length !== sig.length) return { error: "invalid_token" };
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return { error: "invalid_token" };
  let email: string;
  try { email = unb64u(parts[1]); } catch { return { error: "invalid_token" }; }
  if (Number(parts[2]) < Math.floor(Date.now() / 1000)) return { error: "expired_token", email };
  return { email };
}
