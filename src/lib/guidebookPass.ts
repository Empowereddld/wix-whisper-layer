// Holds a guest's guidebook access pass for this browser tab only, so the page
// keeps working after the pass is removed from the address bar (including on
// refresh) without ever leaving it in the URL, history or analytics.
const KEY = "gb_access_pass";
const PASS_RE = /^g1\.[0-9a-f-]{36}\.\d{1,6}\.[A-Za-z0-9_-]{20,100}$/i;

export function isPlausiblePass(v: unknown): v is string {
  return typeof v === "string" && PASS_RE.test(v);
}

/** Reads "#t=<pass>" from a hash string. */
export function passFromHash(hash: string): string | null {
  const m = /(?:^#|&)t=([^&]+)/.exec(hash);
  if (!m) return null;
  try {
    const v = decodeURIComponent(m[1]);
    return isPlausiblePass(v) ? v : null;
  } catch {
    return null;
  }
}

export function savePass(pass: string) {
  try { sessionStorage.setItem(KEY, pass); } catch { /* storage blocked */ }
}

export function loadPass(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return isPlausiblePass(v) ? v : null;
  } catch {
    return null;
  }
}

export function clearPass() {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
