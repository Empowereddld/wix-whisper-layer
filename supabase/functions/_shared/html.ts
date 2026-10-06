// Escape user-controlled text before placing it in email HTML. Keeps all
// readable characters (accents, apostrophes, non-Latin scripts) and only
// neutralises characters that could create tags, attributes or entities.
export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}
