const KEY = "resource-library-return";
export function safeResourceReturn(value: string | null | undefined): string | null {
  if (!value || !/^\/hub(?:\?[^#]*|\/resource\/[0-9a-f-]+(?:\?[^#]*)?)?$/i.test(value)) return null;
  return value;
}
export function rememberResourceReturn(value: string) {
  const safe = safeResourceReturn(value);
  if (safe) { try { sessionStorage.setItem(KEY, safe); } catch { /* storage unavailable */ } }
}
export function getResourceReturn(search = window.location.search): string {
  const requested = safeResourceReturn(new URLSearchParams(search).get("next"));
  if (requested) return requested;
  try { return safeResourceReturn(sessionStorage.getItem(KEY)) || "/hub"; } catch { return "/hub"; }
}
export function authPath(path: string, destination: string) {
  return `${path}?next=${encodeURIComponent(safeResourceReturn(destination) || "/hub")}`;
}
export function clearResourceReturn() { try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ } }