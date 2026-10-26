import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  issueAccessToken, normalizePrivatePath, purchaseGrantsAccess, verifyAccessToken,
} from "./guidebookAccess.ts";

const S = "test-secret-for-unit-tests-only";
const ID = "1d54403b-1185-46dd-8307-b918a731e580";

Deno.test("valid pass verifies", async () => {
  const t = await issueAccessToken(ID, 1, S);
  assertEquals(await verifyAccessToken(t, S), { purchaseId: ID, version: 1 });
});

Deno.test("tampered pass is refused", async () => {
  const t = await issueAccessToken(ID, 1, S);
  assertEquals(await verifyAccessToken(t.replace(".1.", ".2."), S), null);
  assertEquals(await verifyAccessToken(t.slice(0, -2) + "xx", S), null);
  assertEquals(await verifyAccessToken("cs_live_abcdefghijkl", S), null);
});

Deno.test("refunded, revoked or reissued purchases get no access", () => {
  const ok = { status: "completed", access_status: "active", access_token_version: 1 };
  assert(purchaseGrantsAccess(ok, 1));
  assert(!purchaseGrantsAccess({ ...ok, access_status: "revoked" }, 1));
  assert(!purchaseGrantsAccess({ ...ok, status: "refunded" }, 1));
  assert(!purchaseGrantsAccess(ok, 0));
  assert(!purchaseGrantsAccess(null, 1));
});

Deno.test("bucket prefix is stripped from guest file paths", () => {
  assertEquals(normalizePrivatePath("resources-private/guide.pdf"), "guide.pdf");
  assertEquals(normalizePrivatePath("guide.pdf"), "guide.pdf");
});

import { accessAfterCharge, sessionIsPending } from "./fulfillCheckout.ts";
Deno.test("full refund revokes access", () => {
  const d = accessAfterCharge({ amount: 999, amount_refunded: 999, disputed: false });
  if (d.access_status !== "revoked" || d.status !== "refunded") throw new Error(JSON.stringify(d));
});
Deno.test("partial refund keeps access", () => {
  const d = accessAfterCharge({ amount: 999, amount_refunded: 300, disputed: false });
  if (d.access_status !== "active" || d.status) throw new Error(JSON.stringify(d));
});
Deno.test("open dispute suspends, won restores, lost revokes", () => {
  if (accessAfterCharge({ amount: 999, amount_refunded: 0, disputed: true, dispute_status: "needs_response" }).access_status !== "suspended") throw new Error("open");
  if (accessAfterCharge({ amount: 999, amount_refunded: 0, disputed: true, dispute_status: "won" }).access_status !== "active") throw new Error("won");
  const lost = accessAfterCharge({ amount: 999, amount_refunded: 0, disputed: true, dispute_status: "lost" });
  if (lost.access_status !== "revoked" || lost.status !== "refunded") throw new Error("lost");
});
Deno.test("delayed payment is pending, never paid", () => {
  if (!sessionIsPending({ mode: "payment", status: "complete", payment_status: "unpaid" })) throw new Error("unpaid");
  if (sessionIsPending({ mode: "payment", status: "complete", payment_status: "paid" })) throw new Error("paid");
});

import { emailSendable, guidebookAccessLink, guidebookEmailHtml, guidebookEmailText, GUIDEBOOK_EMAIL_SUBJECT, MAX_EMAIL_ATTEMPTS } from "./guidebookEmail.ts";
Deno.test("email uses the approved subject and wording with a per-purchase link", () => {
  if (GUIDEBOOK_EMAIL_SUBJECT !== "Your Empowered DLD Parent Guidebook is ready 💜") throw new Error("subject");
  const link = guidebookAccessLink("g1.11111111-1111-1111-1111-111111111111.1.abcdefghijklmnopqrstuvwx");
  if (!link.startsWith("https://www.empowereddld.com/shop/guidebook-access#t=g1.")) throw new Error(link);
  const t = guidebookEmailText(link);
  for (const line of [
    "Thank you for purchasing Discussing DLD with Your Child!",
    "We're so glad you've chosen to explore these important conversations with your child.",
    "Your digital guidebook is ready to download.",
    "You can save the PDF to your device and print the activities whenever you'd like.",
    "Remember, you don't need to cover everything in one sitting. Follow your child's lead, celebrate their strengths, and revisit these conversations as their understanding grows.",
    "Thank you for supporting Empowered DLD. Every purchase helps us continue creating resources for families navigating DLD.",
    "Warmly,\nJinean and Camesha\nEmpowered DLD",
  ]) if (!t.includes(line)) throw new Error(`missing: ${line}`);
  const h = guidebookEmailHtml(link);
  if (!h.includes(">Access Your Parent Guidebook</a>") || !h.includes("#t=g1.")) throw new Error("button");
  if (/example|placeholder/i.test(h)) throw new Error("placeholder");
});
Deno.test("an accepted email is never resent; failures retry up to the limit", () => {
  if (emailSendable({ confirmation_email_status: "accepted" })) throw new Error("accepted");
  if (emailSendable({ confirmation_email_status: "accepted" }, Date.now(), { manual: true })) throw new Error("manual accepted");
  if (!emailSendable({ confirmation_email_status: "failed", confirmation_email_attempts: 2 })) throw new Error("retry");
  if (emailSendable({ confirmation_email_status: "failed", confirmation_email_attempts: MAX_EMAIL_ATTEMPTS })) throw new Error("limit");
});
Deno.test("after 6 failures only an admin resend is allowed", () => {
  if (emailSendable({ confirmation_email_status: "gave_up", confirmation_email_attempts: 6 })) throw new Error("auto");
  if (!emailSendable({ confirmation_email_status: "gave_up", confirmation_email_attempts: 6 }, Date.now(), { manual: true })) throw new Error("manual");
});
Deno.test("an in-progress send blocks others until it is stale", () => {
  const now = Date.now();
  if (emailSendable({ confirmation_email_status: "sending", confirmation_email_claimed_at: new Date(now - 60_000).toISOString() }, now)) throw new Error("fresh");
  if (!emailSendable({ confirmation_email_status: "sending", confirmation_email_claimed_at: new Date(now - 11 * 60_000).toISOString() }, now)) throw new Error("stale");
});
