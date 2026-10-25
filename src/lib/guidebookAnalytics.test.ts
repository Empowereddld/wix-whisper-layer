import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, saveAnalyticsChoice, analyticsAllowed } from "./analyticsConsent";

beforeEach(() => {
  vi.resetModules();
  localStorage.clear(); sessionStorage.clear();
  vi.stubEnv("VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY", "G-TEST123");
  history.replaceState(null, "", "/shop/parent-guidebook?utm_source=facebook&utm_medium=paid_social&utm_campaign=guidebook60&email=parent@example.com&session_id=cs_live_secret#token");
  const win = window as Window & { dataLayer?: unknown[]; gtag?: unknown };
  delete win.dataLayer; delete win.gtag;
  document.getElementById("edld-ga4")?.remove();
});

function events() {
  return ((window as Window & { dataLayer?: unknown[] }).dataLayer || []).map(args => Array.from(args as ArrayLike<unknown>));
}
const verified = { transaction_id: `guidebook_${"a".repeat(64)}`, resource_id: "1d54403b-1185-46dd-8307-b918a731e580", currency: "USD", value: 9.99 };

describe("guidebook campaign measurement", () => {
  it("sends no tracking or attribution storage before affirmative analytics consent", async () => {
    const ga = await import("./guidebookAnalytics");
    ga.trackGuidebookVisit();
    expect(events()).toEqual([]);
    expect(document.getElementById("edld-ga4")).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });
  it("remains inactive without a Measurement ID", async () => {
    vi.stubEnv("VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY", "");
    saveAnalyticsChoice(true);
    (await import("./guidebookAnalytics")).trackGuidebookVisit();
    expect(events()).toEqual([]);
  });
  it("retains campaign labels but strips email, checkout tokens, and fragments", async () => {
    saveAnalyticsChoice(true);
    const ga = await import("./guidebookAnalytics");
    ga.trackGuidebookVisit();
    const view = events().find(args => args[1] === "page_view");
    expect(view?.[2]).toMatchObject({ page_location: `${location.origin}/shop/parent-guidebook?utm_source=facebook&utm_medium=paid_social&utm_campaign=guidebook60` });
    expect(JSON.stringify(events())).not.toMatch(/parent@example|cs_live_secret|#token/);
    expect(ga.safeCampaign("utm_source=person%40example.com&utm_content=123456789&email=x")).toEqual({});
  });
  it("deduplicates page effects and emits one base install", async () => {
    saveAnalyticsChoice(true);
    const ga = await import("./guidebookAnalytics");
    ga.trackGuidebookVisit(); ga.trackGuidebookVisit();
    expect(events().filter(args => args[1] === "page_view")).toHaveLength(1);
    expect(document.querySelectorAll("#edld-ga4")).toHaveLength(1);
  });
  it("measures a checkout start as USD 9.99 and redirects even without provider receipt", async () => {
    vi.useFakeTimers();
    saveAnalyticsChoice(true);
    const redirect = vi.fn();
    (await import("./guidebookAnalytics")).trackGuidebookCheckout(redirect);
    expect(events().find(args => args[1] === "begin_checkout")?.[2]).toMatchObject({ currency: "USD", value: 9.99 });
    vi.advanceTimersByTime(1000);
    expect(redirect).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
  it("rejects missing payment evidence and invalid USD purchase data", async () => {
    saveAnalyticsChoice(true);
    const ga = await import("./guidebookAnalytics");
    expect(ga.trackVerifiedGuidebookPurchase(undefined)).toBe(false);
    expect(ga.trackVerifiedGuidebookPurchase({ ...verified, currency: "CAD" })).toBe(false);
    expect(ga.trackVerifiedGuidebookPurchase({ ...verified, transaction_id: "cs_live_secret" })).toBe(false);
    expect(ga.trackVerifiedGuidebookPurchase({ ...verified, value: 0 })).toBe(false);
    expect(events()).toEqual([]);
  });
  it("reports server-returned revenue and deduplicates refreshes with a stable transaction ID", async () => {
    saveAnalyticsChoice(true);
    const ga = await import("./guidebookAnalytics");
    expect(ga.trackVerifiedGuidebookPurchase(verified)).toBe(true);
    expect(ga.trackVerifiedGuidebookPurchase(verified)).toBe(false);
    vi.resetModules();
    expect((await import("./guidebookAnalytics")).trackVerifiedGuidebookPurchase(verified)).toBe(false);
    expect(events().filter(args => args[1] === "purchase")).toHaveLength(1);
    expect(events().find(args => args[1] === "purchase")?.[2]).toMatchObject({ transaction_id: verified.transaction_id, currency: "USD", value: 9.99 });
  });
  it("does not replay purchases that happened while consent was refused", async () => {
    saveAnalyticsChoice(false);
    const ga = await import("./guidebookAnalytics");
    expect(ga.trackVerifiedGuidebookPurchase(verified)).toBe(false);
    saveAnalyticsChoice(true);
    ga.trackGuidebookVisit();
    expect(events().filter(args => args[1] === "purchase")).toHaveLength(0);
  });
  it("withdraws immediately, preserves acceptance evidence and prevents further sends", async () => {
    saveAnalyticsChoice(true);
    const ga = await import("./guidebookAnalytics");
    ga.trackGuidebookVisit();
    saveAnalyticsChoice(false); ga.syncAnalyticsPrivacy();
    expect(analyticsAllowed()).toBe(false);
    expect(ga.trackVerifiedGuidebookPurchase(verified)).toBe(false);
    expect(JSON.parse(localStorage.getItem(`${CONSENT_KEY}_history`) || "[]").map((entry: {accepted: boolean}) => entry.accepted)).toEqual([true, false]);
    expect(sessionStorage.length).toBe(0);
  });
});