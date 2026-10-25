export const CONSENT_KEY = "edld_analytics_choice_v1";
export const CONSENT_NOTICE = "Allow Google Analytics to measure page visits, campaign sources, checkout starts and purchases using cookies and browser identifiers? We do not send your name or email. Your choice does not affect purchases or downloads.";
export const CONSENT_VERSION = "analytics-only-v1";
export type AnalyticsChoice = { accepted: boolean; at: string; version: string; notice: string };

export function readAnalyticsChoice(): AnalyticsChoice | null {
  try {
    const record = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    return typeof record?.accepted === "boolean" && record.version === CONSENT_VERSION ? record : null;
  } catch { return null; }
}

export function analyticsAllowed() {
  return readAnalyticsChoice()?.accepted === true &&
    !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl &&
    navigator.doNotTrack !== "1";
}

export function saveAnalyticsChoice(accepted: boolean) {
  // Preserve previous choices and notice evidence, including acceptance on withdrawal.
  try {
    const history = JSON.parse(localStorage.getItem(`${CONSENT_KEY}_history`) || "[]");
    const record: AnalyticsChoice = { accepted, at: new Date().toISOString(), version: CONSENT_VERSION, notice: CONSENT_NOTICE };
    localStorage.setItem(`${CONSENT_KEY}_history`, JSON.stringify([...history, record]));
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch { return; } // Fail closed when consent cannot be persisted.
  window.dispatchEvent(new Event("edld-analytics-choice"));
}