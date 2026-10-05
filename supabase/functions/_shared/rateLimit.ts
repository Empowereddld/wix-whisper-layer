// Privacy-preserving rate limiter backed by public.email_rate_limits.
// Identifiers (IPs, emails) are stored only as keyed SHA-256 hashes, never raw.
// Records are purged after 2 days by a scheduled job.
// deno-lint-ignore-file no-explicit-any

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") || "unknown";
}

export async function hashId(value: string): Promise<string> {
  const salt = Deno.env.get("CRON_SECRET") || Deno.env.get("SUPABASE_URL") || "";
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(`rl:${salt}`),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value.toLowerCase()));
  return Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface Limit { bucket: string; id: string; max: number; windowMin: number }

/** Returns true if every limit allows the request; records one hit per limit when allowed. */
export async function allow(supabase: any, limits: Limit[]): Promise<boolean> {
  const hashed = await Promise.all(limits.map(async (l) => ({ ...l, hash: await hashId(l.id) })));
  for (const l of hashed) {
    const since = new Date(Date.now() - l.windowMin * 60_000).toISOString();
    const { count, error } = await supabase
      .from("email_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("bucket", l.bucket).eq("key_hash", l.hash).gte("created_at", since);
    if (error) { console.error("rate limit check failed:", error); continue; }
    if ((count ?? 0) >= l.max) {
      console.warn(`Rate limited: bucket=${l.bucket}`);
      return false;
    }
  }
  await supabase.from("email_rate_limits")
    .insert(hashed.map((l) => ({ bucket: l.bucket, key_hash: l.hash })))
    .then(() => {}, (e: unknown) => console.warn("rate limit insert failed:", e));
  return true;
}
