// Story Pros dashboard access tokens. A referral code is NEVER proof of
// ownership; only this server-signed token is.
//
// Format: "v1.<waitlist_id>.<issued_at>.<expires_at>.<hmac>" (unix seconds).
// - Sliding expiry: each renewal sets expires_at = now + 30 days.
// - Absolute lifetime: expires_at can never pass issued_at + 180 days, and
//   issued_at is preserved on renewal, so renewing cannot extend a token forever.
// - Signed with STORYPROS_DASHBOARD_SECRET (server-only).
export const DASHBOARD_TOKEN_TTL_S = 30 * 24 * 60 * 60;
export const DASHBOARD_TOKEN_MAX_S = 180 * 24 * 60 * 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function mac(payload: string): Promise<string> {
  const secret = Deno.env.get("STORYPROS_DASHBOARD_SECRET");
  if (!secret) throw new Error("STORYPROS_DASHBOARD_SECRET missing");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`sp-dashboard:${payload}`));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function build(id: string, iat: number, exp: number) {
  const payload = `v1.${id}.${iat}.${exp}`;
  return `${payload}.${await mac(payload)}`;
}

export async function issueDashboardToken(waitlistId: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return build(waitlistId, now, now + DASHBOARD_TOKEN_TTL_S);
}

export type VerifiedToken = { id: string; iat: number; exp: number };

export async function verifyDashboardToken(
  raw: unknown,
): Promise<VerifiedToken | { error: "invalid_token" | "expired_token" }> {
  if (typeof raw !== "string" || raw.length > 300) return { error: "invalid_token" };
  const parts = raw.split(".");
  if (parts.length !== 5 || parts[0] !== "v1") return { error: "invalid_token" };
  const [, id, iatS, expS, sig] = parts;
  if (!UUID_RE.test(id) || !/^\d{9,11}$/.test(iatS) || !/^\d{9,11}$/.test(expS)) {
    return { error: "invalid_token" };
  }
  const expected = await mac(`v1.${id}.${iatS}.${expS}`);
  if (expected.length !== sig.length) return { error: "invalid_token" };
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return { error: "invalid_token" };
  const iat = Number(iatS), exp = Number(expS), now = Math.floor(Date.now() / 1000);
  if (exp > iat + DASHBOARD_TOKEN_MAX_S) return { error: "invalid_token" };
  if (exp < now || now > iat + DASHBOARD_TOKEN_MAX_S) return { error: "expired_token" };
  return { id, iat, exp };
}

// Renewal keeps the original issued_at, so it is capped by the absolute lifetime.
export async function renewDashboardToken(t: VerifiedToken): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = Math.min(now + DASHBOARD_TOKEN_TTL_S, t.iat + DASHBOARD_TOKEN_MAX_S);
  return build(t.id, t.iat, exp);
}
