# Geo-IP Auto-Detect Region on First Visit

## Goal
New visitors from Atlanta see USD, from London see GBP, from Sydney see AUD, etc., without touching the selector. Returning visitors keep whatever they picked.

## How it works
Shopify's Storefront API has a `localization` query that returns the buyer's country based on their IP address (Shopify does the geo lookup server-side; no third-party geo-IP service, no extra cost, no privacy config). We call it once on first visit and set the region default from the result.

## Behavior

- **First-ever visit:** Call `localization.country.isoCode`. If it matches a market we support (US, GB, AU, NZ, CA, or any EU country → EUR), pre-select that region. Otherwise fall back to US (best-selling market, familiar currency for the widest audience). Selector still lets them switch.
- **Returning visit:** Skip detection entirely — use their saved choice from localStorage.
- **User has already used the selector:** Never overwrite their pick, even if their IP suggests a different country.

## Changes

1. **`src/stores/regionStore.ts`**
   - Add a `hasUserChosen: boolean` flag (persisted). Flip to `true` inside `setCountry`.
   - Change the default `countryCode` from `"CA"` to `"US"` as the fallback when detection fails.
   - Add a `detectAndSetCountry()` action that no-ops if `hasUserChosen` is true.

2. **`src/lib/shopify.ts`**
   - Add a `LOCALIZATION_QUERY`:
     ```graphql
     query { localization { country { isoCode } } }
     ```
   - Export a `detectBuyerCountry()` helper that runs the query and maps the ISO code to one of our supported `CountryCode` values (EU countries → `IE`, unsupported countries → `US`).

3. **`src/App.tsx`** (or a small `useRegionDetect` hook mounted once)
   - On mount, if `hasUserChosen` is false, call `detectBuyerCountry()` and pass the result to `regionStore.detectAndSetCountry()`.
   - Fire-and-forget; no loading spinner. If it resolves after products already rendered in the fallback currency, the React Query keys refetch automatically (they already include `countryCode`).

4. **`src/components/RegionSelector.tsx`**
   - No visual change. The selector already writes through `setCountry`, which now also sets `hasUserChosen = true`, locking in their pick.

## Edge cases handled

- **Detection fails / offline:** Store stays on the fallback (`US`), user can still switch manually.
- **User in an EU country (France, Germany, etc.):** Mapped to our `IE`/EUR market entry so they see euros.
- **User already picked before this feature ships:** Their existing persisted `countryCode` is preserved. We treat any existing persisted region as `hasUserChosen = true` on first load after the update (one-time migration in the persist `onRehydrateStorage`).
- **Country not in our supported list (e.g. Japan, Brazil):** Falls back to USD, which is the safest widely-understood currency.

## Out of scope

- No banner asking "You're in the US — switch to USD?" (adds friction; auto-switch is cleaner).
- No server-side rendering of the detected country (this is a Vite SPA; detection happens client-side on first paint, refetch is fast).

## Testing checklist

- New incognito visit → prices should reflect the visitor's actual country's currency.
- Switch to a different country via selector → refresh → stays on the picked country (detection skipped).
- Clear localStorage → reload → detection runs again.
- Existing users with a persisted `countryCode` (currently CA) → treated as "user chose CA," not overridden.
