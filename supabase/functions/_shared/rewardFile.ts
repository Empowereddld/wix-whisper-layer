// Story Pros Tier 2 reward (Executive Function guide). The file lives only in
// the private bucket; access is granted per request after checking eligibility.
// Email links carry a server-signed, expiring token (never a referral code).
// deno-lint-ignore-file no-explicit-any
export const EF_REWARD_PATH = "storypros/executive-function-skills-guide.pdf";
export const EF_REWARD_MIN_POINTS = 35;
const LINK_TTL_S = 365 * 24 * 60 * 60;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function mac(payload: string): Promise<string> {
  const secret = Deno.env.get("STORYPROS_DASHBOARD_SECRET");
  if (!secret) throw new Error("STORYPROS_DASHBOARD_SECRET missing");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`sp-reward-ef:${payload}`));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function issueRewardLinkToken(waitlistId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + LINK_TTL_S;
  const payload = `r1.${waitlistId}.${exp}`;
  return `${payload}.${await mac(payload)}`;
}

export async function verifyRewardLinkToken(raw: unknown): Promise<{ id: string } | { error: string }> {
  if (typeof raw !== "string" || raw.length > 200) return { error: "invalid" };
  const p = raw.split(".");
  if (p.length !== 4 || p[0] !== "r1" || !UUID_RE.test(p[1]) || !/^\d{9,11}$/.test(p[2])) return { error: "invalid" };
  const expected = await mac(`r1.${p[1]}.${p[2]}`);
  if (expected.length !== p[3].length) return { error: "invalid" };
  let d = 0;
  for (let i = 0; i < expected.length; i++) d |= expected.charCodeAt(i) ^ p[3].charCodeAt(i);
  if (d !== 0) return { error: "invalid" };
  if (Number(p[2]) < Math.floor(Date.now() / 1000)) return { error: "expired" };
  return { id: p[1] };
}

/** Returns a 5-minute signed URL if the member is eligible, else null. */
export async function eligibleRewardUrl(supabase: any, waitlistId: string): Promise<string | null> {
  const { data: m, error } = await supabase.from("storybuilders_waitlist")
    .select("id, points, email_verified").eq("id", waitlistId).is("deleted_at", null).maybeSingle();
  if (error || !m || m.email_verified !== true || (m.points ?? 0) < EF_REWARD_MIN_POINTS) return null;
  const { data: s, error: sErr } = await supabase.storage.from("resources-private")
    .createSignedUrl(EF_REWARD_PATH, 300, { download: "Executive-Function-Skills-Guide.pdf" });
  if (sErr || !s?.signedUrl) return null;
  return s.signedUrl;
}
