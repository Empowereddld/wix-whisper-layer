// Guest access passes for purchased resources (Parent Guidebook).
// Format: g1.<purchaseId>.<version>.<hmac>. No expiry inside the pass; revocation
// works by bumping purchases.access_token_version or changing access_status.
// deno-lint-ignore-file no-explicit-any
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function mac(payload: string, secret?: string): Promise<string> {
  const s = secret ?? Deno.env.get("GUIDEBOOK_ACCESS_SECRET");
  if (!s) throw new Error("GUIDEBOOK_ACCESS_SECRET missing");
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(s), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`guidebook-access:${payload}`));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function issueAccessToken(purchaseId: string, version: number, secret?: string): Promise<string> {
  const payload = `g1.${purchaseId}.${version}`;
  return `${payload}.${await mac(payload, secret)}`;
}

export async function verifyAccessToken(
  raw: unknown, secret?: string,
): Promise<{ purchaseId: string; version: number } | null> {
  if (typeof raw !== "string" || raw.length > 200) return null;
  const p = raw.split(".");
  if (p.length !== 4 || p[0] !== "g1" || !UUID_RE.test(p[1]) || !/^\d{1,6}$/.test(p[2])) return null;
  const expected = await mac(`g1.${p[1]}.${p[2]}`, secret);
  if (expected.length !== p[3].length) return null;
  let d = 0;
  for (let i = 0; i < expected.length; i++) d |= expected.charCodeAt(i) ^ p[3].charCodeAt(i);
  if (d !== 0) return null;
  return { purchaseId: p[1], version: Number(p[2]) };
}

/** Short fingerprint for logs; never log the pass itself. */
export async function tokenFingerprint(raw: string): Promise<string> {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(h)).slice(0, 4).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Storage paths may be saved with the bucket prefix; the storage API wants it stripped. */
export function normalizePrivatePath(path: string): string {
  return path.startsWith("resources-private/") ? path.slice("resources-private/".length) : path;
}

/** Pure access decision so it can be unit tested. */
export function purchaseGrantsAccess(
  row: { status?: string; access_status?: string; access_token_version?: number } | null,
  version: number,
): boolean {
  return !!row && row.status === "completed" && row.access_status === "active" &&
    row.access_token_version === version;
}

/** 5-minute signed download URL for the purchased resource's private file. */
export async function signedDownloadForResource(admin: any, resourceId: string, filename: string) {
  const { data: fileRow } = await admin.from("resource_private_files")
    .select("storage_path").eq("resource_id", resourceId).maybeSingle();
  if (!fileRow?.storage_path) return null;
  const { data } = await admin.storage.from("resources-private")
    .createSignedUrl(normalizePrivatePath(fileRow.storage_path), 300, { download: filename });
  return data?.signedUrl ?? null;
}
