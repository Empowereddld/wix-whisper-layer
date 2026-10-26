// Approved Parent Guidebook confirmation email (guest purchases only).
// Sent through the existing Resend sender with a per-purchase idempotency key,
// guarded by an atomic claim on purchases.confirmation_email_status
// (pending | sending | accepted | failed | gave_up). Logs never include the
// recipient, the access pass or the access link.
// deno-lint-ignore-file no-explicit-any
import { escapeHtml } from "./html.ts";
import { issueAccessToken } from "./guidebookAccess.ts";

export const GUIDEBOOK_RESOURCE_ID = "1d54403b-1185-46dd-8307-b918a731e580";
export const MAX_EMAIL_ATTEMPTS = 6;
export const STALE_CLAIM_MS = 10 * 60 * 1000;
const SITE = "https://www.empowereddld.com";
const FROM = "Empowered DLD <hello@mail.empowereddld.com>";
const REPLY_TO = "hello@empowereddld.com";

export const GUIDEBOOK_EMAIL_SUBJECT = "Your Empowered DLD Parent Guidebook is ready 💜";

/** Personal access link: the pass sits after "#", so it is never sent to servers or analytics. */
export function guidebookAccessLink(token: string): string {
  return `${SITE}/shop/guidebook-access#t=${encodeURIComponent(token)}`;
}

export function guidebookEmailText(link: string): string {
  return [
    "Thank you for purchasing Discussing DLD with Your Child!",
    "",
    "We're so glad you've chosen to explore these important conversations with your child.",
    "",
    "Your digital guidebook is ready to download.",
    "",
    `Access Your Parent Guidebook: ${link}`,
    "",
    "You can save the PDF to your device and print the activities whenever you'd like.",
    "",
    "Remember, you don't need to cover everything in one sitting. Follow your child's lead, celebrate their strengths, and revisit these conversations as their understanding grows.",
    "",
    "Thank you for supporting Empowered DLD. Every purchase helps us continue creating resources for families navigating DLD.",
    "",
    "Warmly,",
    "Jinean and Camesha",
    "Empowered DLD",
  ].join("\n");
}

export function guidebookEmailHtml(link: string): string {
  const href = escapeHtml(link);
  const p = (t: string) =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2b2b2b;">${t}</p>`;
  return `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
${p("<strong>Thank you for purchasing Discussing DLD with Your Child!</strong>")}
${p("We're so glad you've chosen to explore these important conversations with your child.")}
${p("Your digital guidebook is ready to download.")}
<p style="margin:8px 0 24px;"><a href="${href}" style="display:inline-block;background:#5B2D8E;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">Access Your Parent Guidebook</a></p>
${p("You can save the PDF to your device and print the activities whenever you'd like.")}
${p("Remember, you don't need to cover everything in one sitting. Follow your child's lead, celebrate their strengths, and revisit these conversations as their understanding grows.")}
${p("Thank you for supporting Empowered DLD. Every purchase helps us continue creating resources for families navigating DLD.")}
${p("Warmly,<br/>Jinean and Camesha<br/>Empowered DLD")}
</div></body></html>`;
}

/** Pure decision: may this row be (re)sent now? */
export function emailSendable(
  row: { confirmation_email_status?: string; confirmation_email_attempts?: number; confirmation_email_claimed_at?: string | null },
  now = Date.now(),
  opts: { manual?: boolean } = {},
): boolean {
  const s = row.confirmation_email_status;
  if (s === "accepted") return false;
  if (s === "sending") {
    const t = row.confirmation_email_claimed_at ? Date.parse(row.confirmation_email_claimed_at) : 0;
    return now - t > STALE_CLAIM_MS;
  }
  if (s === "gave_up") return !!opts.manual;
  return opts.manual || (row.confirmation_email_attempts ?? 0) < MAX_EMAIL_ATTEMPTS;
}

type SendOutcome = "accepted" | "failed" | "gave_up" | "skipped";

/**
 * Claims the purchase row, sends the approved email, records the provider's result.
 * `manual` lets an admin resend after automatic attempts are exhausted.
 */
export async function sendGuidebookConfirmation(admin: any, purchaseId: string, opts: { manual?: boolean } = {}): Promise<SendOutcome> {
  const { data: row } = await admin.from("purchases")
    .select("id, user_id, resource_id, customer_email, status, access_status, access_token_version, confirmation_email_status, confirmation_email_attempts, confirmation_email_claimed_at")
    .eq("id", purchaseId).maybeSingle();
  if (!row || row.user_id || !row.customer_email || row.status !== "completed" || row.access_status !== "active") {
    return "skipped";
  }
  if (!emailSendable(row, Date.now(), opts)) return "skipped";

  // Atomic claim: only succeeds if the status is still what we just read.
  const nowIso = new Date().toISOString();
  let claim = admin.from("purchases").update({
    confirmation_email_status: "sending",
    confirmation_email_claimed_at: nowIso,
    confirmation_email_attempts: (row.confirmation_email_attempts ?? 0) + 1,
  }).eq("id", row.id).eq("confirmation_email_status", row.confirmation_email_status);
  claim = row.confirmation_email_claimed_at
    ? claim.eq("confirmation_email_claimed_at", row.confirmation_email_claimed_at)
    : claim.is("confirmation_email_claimed_at", null);
  const { data: claimed } = await claim.select("id");
  if (!claimed || claimed.length === 0) return "skipped";

  const attempts = (row.confirmation_email_attempts ?? 0) + 1;
  const link = guidebookAccessLink(await issueAccessToken(row.id, row.access_token_version));

  let errorNote: string | null = null;
  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableKey || !resendKey) throw new Error("email keys missing");
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
        "Content-Type": "application/json",
        // Resend drops repeats of the same key for 24h. The pass inside the link
        // is identical for a given version, so repeats carry the same content.
        "Idempotency-Key": opts.manual
          ? `guidebook-confirm-${row.id}-v${row.access_token_version}-manual-${attempts}`
          : `guidebook-confirm-${row.id}-v${row.access_token_version}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [row.customer_email],
        reply_to: REPLY_TO,
        subject: GUIDEBOOK_EMAIL_SUBJECT,
        html: guidebookEmailHtml(link),
        text: guidebookEmailText(link),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      // Provider error names only; never the body (could echo the recipient).
      let name = "";
      try { name = String(JSON.parse(body)?.name ?? ""); } catch { /* ignore */ }
      errorNote = `provider ${res.status}${name ? ` ${name}` : ""}`.slice(0, 120);
    }
  } catch (e) {
    errorNote = (e instanceof Error ? e.message : "send error").slice(0, 120);
  }

  if (!errorNote) {
    await admin.from("purchases").update({
      confirmation_email_status: "accepted",
      confirmation_email_sent_at: new Date().toISOString(),
      confirmation_email_last_error: null,
    }).eq("id", row.id);
    await admin.from("email_send_log").insert({
      template_name: "guidebook-confirmation", recipient_email: row.customer_email, status: "sent",
      metadata: { purchase_id: row.id, manual: !!opts.manual },
    });
    console.log("guidebook email accepted", { purchase: row.id, attempts });
    return "accepted";
  }

  const finalStatus = !opts.manual && attempts >= MAX_EMAIL_ATTEMPTS ? "gave_up" : "failed";
  await admin.from("purchases").update({
    confirmation_email_status: finalStatus,
    confirmation_email_last_error: errorNote,
  }).eq("id", row.id);
  console.warn("guidebook email not accepted", { purchase: row.id, attempts, status: finalStatus, error: errorNote });
  return finalStatus;
}
