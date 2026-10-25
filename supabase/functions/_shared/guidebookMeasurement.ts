// Only called after paid status, product, currency and purchase-record checks.
// Hash the checkout capability so it is never sent to Google or exposed as an event ID.
export async function guidebookMeasurement(sessionId: string, resourceId: string, currency: string, amount: number) {
  if (resourceId !== "1d54403b-1185-46dd-8307-b918a731e580" || currency.toUpperCase() !== "USD") return undefined;
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sessionId));
  const hash = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
  return { transaction_id: `guidebook_${hash}`, resource_id: resourceId, currency: "USD", value: amount / 100 };
}