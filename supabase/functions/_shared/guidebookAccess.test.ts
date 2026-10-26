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
