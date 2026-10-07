// Redacts an email for diagnostic logs: keeps first character and domain only.
export function maskEmail(email: unknown): string {
  if (typeof email !== "string" || !email.includes("@")) return "[no-email]";
  const [local, domain] = email.trim().toLowerCase().split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}
