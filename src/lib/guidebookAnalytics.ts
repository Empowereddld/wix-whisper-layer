import { analyticsAllowed } from "./analyticsConsent";

export const GUIDEBOOK_ID = "1d54403b-1185-46dd-8307-b918a731e580";
const item = { item_id: GUIDEBOOK_ID, item_name: "Parent Guidebook", quantity: 1 };
const ATTRIBUTION_KEY = "edld_guidebook_campaign_v1";
type Parameters = Record<string, unknown>;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let configured = false;
let lastPage = "";
const sent = new Set<string>();

export function measurementId() {
  const id = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY;
  return typeof id === "string" && /^G-[A-Z0-9]+$/.test(id) ? id : null;
}

export function safeCampaign(search: string) {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params.get(key);
    // Campaign labels only: never forward raw queries, click IDs, email, phone or tokens.
    if (value && /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(value) && !/\d{7}|cs_|eyJ/.test(value)) result[key] = value;
  }
  return result;
}

function campaign() {
  try {
    const current = safeCampaign(location.search);
    if (current.utm_source || current.utm_campaign) sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
    return safeCampaign(new URLSearchParams(JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}")).toString());
  } catch { return {}; }
}

function safeLocation() {
  // Only fixed campaign paths. Never forward checkout capabilities or private URLs.
  const path = location.pathname === "/shop/parent-guidebook" ? location.pathname : "/shop/payment-success";
  const query = new URLSearchParams(campaign()).toString();
  return `${location.origin}${path}${query ? `?${query}` : ""}`;
}

function referrer() {
  try {
    const url = new URL(document.referrer);
    if (url.hostname === "checkout.stripe.com" || url.hostname.endsWith(".stripe.com")) return "";
    return url.origin; // No paths, queries or fragments from referring sites.
  } catch { return ""; }
}

function initialize() {
  const id = measurementId();
  if (!id || !analyticsAllowed()) return null;
  const win = window as AnalyticsWindow;
  if (!configured) {
    win.dataLayer = win.dataLayer || [];
    win.gtag = function (..._args: unknown[]) { win.dataLayer?.push(arguments); };
    win.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    win.gtag("consent", "update", { analytics_storage: "granted" });
    win.gtag("set", "developer_id.dZjgwMW", true);
    win.gtag("js", new Date());
    win.gtag("config", id, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: safeLocation(), page_referrer: referrer(), page_title: "Empowered DLD Parent Guidebook",
    });
    const script = document.createElement("script");
    script.id = "edld-ga4";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
    configured = true;
  }
  return win.gtag;
}

export function syncAnalyticsPrivacy() {
  if (analyticsAllowed()) return;
  const id = measurementId();
  if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
  (window as AnalyticsWindow).gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  try { sessionStorage.removeItem(ATTRIBUTION_KEY); } catch { /* no storage */ }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) continue;
    for (const domain of ["", location.hostname, ".empowereddld.com"]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

function event(name: string, params: Parameters, complete?: () => void) {
  const gtag = initialize();
  if (!gtag) { complete?.(); return false; }
  const id = measurementId();
  if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("event", name, {
    ...params, page_location: safeLocation(), page_referrer: referrer(),
    page_title: "Empowered DLD Parent Guidebook", send_to: id,
    ...(complete ? { event_callback: complete, event_timeout: 900 } : {}),
  });
  return true;
}

export function trackGuidebookVisit() {
  const page = safeLocation();
  if (lastPage === page) return;
  if (event("page_view", { page_path: "/shop/parent-guidebook" })) lastPage = page;
}

export function trackGuidebookCheckout(redirect: () => void) {
  // Checkout has actually returned a Stripe URL; a failed button click is not a start.
  const fallback = window.setTimeout(redirect, 1000);
  event("begin_checkout", { currency: "USD", value: 9.99, items: [{ ...item, price: 9.99 }] }, () => {
    clearTimeout(fallback); redirect();
  });
}

export type VerifiedPurchase = { transaction_id: string; resource_id: string; currency: string; value: number };
export function trackVerifiedGuidebookPurchase(payload: unknown) {
  const p = payload as Partial<VerifiedPurchase> | null;
  if (!p || p.resource_id !== GUIDEBOOK_ID || p.currency !== "USD" ||
      typeof p.value !== "number" || !Number.isFinite(p.value) || p.value <= 0 ||
      typeof p.transaction_id !== "string" || !/^guidebook_[a-f0-9]{64}$/.test(p.transaction_id)) return false;
  const key = `edld_ga_purchase_${p.transaction_id}`;
  try { if (localStorage.getItem(key)) return false; } catch { /* GA transaction ID still deduplicates */ }
  if (sent.has(key)) return false;
  if (!event("purchase", { transaction_id: p.transaction_id, currency: "USD", value: p.value, items: [{ ...item, price: p.value }] })) return false;
  sent.add(key);
  try { localStorage.setItem(key, "sent"); } catch { /* GA transaction ID still deduplicates */ }
  return true;
}