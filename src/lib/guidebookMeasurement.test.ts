import { describe, expect, it } from "vitest";
import { guidebookMeasurement } from "../../supabase/functions/_shared/guidebookMeasurement";

describe("verified guidebook purchase payload", () => {
  it("uses actual USD cents and a stable transaction hash, never the checkout capability", async () => {
    const first = await guidebookMeasurement("cs_live_private_capability", "1d54403b-1185-46dd-8307-b918a731e580", "usd", 999);
    const repeat = await guidebookMeasurement("cs_live_private_capability", "1d54403b-1185-46dd-8307-b918a731e580", "usd", 999);
    const other = await guidebookMeasurement("cs_live_other_capability", "1d54403b-1185-46dd-8307-b918a731e580", "usd", 999);
    expect(first).toEqual(repeat);
    expect(first?.transaction_id).toMatch(/^guidebook_[a-f0-9]{64}$/);
    expect(first?.transaction_id).not.toEqual(other?.transaction_id);
    expect(first?.value).toBe(9.99);
    expect(first?.currency).toBe("USD");
    expect(JSON.stringify(first)).not.toContain("cs_live");
  });
  it("does not measure CAD or unrelated products as guidebook purchases", async () => {
    expect(await guidebookMeasurement("session", "1d54403b-1185-46dd-8307-b918a731e580", "cad", 999)).toBeUndefined();
    expect(await guidebookMeasurement("session", "other", "usd", 999)).toBeUndefined();
  });
});