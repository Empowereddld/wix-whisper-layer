## Goal
Let customers switch their region on the storefront so product prices, cart, and checkout display in the correct local currency via Shopify Markets (CA/CAD, US/USD, GB/GBP, EU markets/EUR, AU/AUD, NZ/NZD).

## Approach

Shopify's Storefront API returns Market-specific pricing when queries include the `@inContext(country: CODE)` directive, and `cartCreate` accepts a `buyerIdentity.countryCode` (which carries through to checkout). We'll store the selected country in a small Zustand store persisted to `localStorage`, thread it through all product/cart queries, and expose it via a dropdown component in the footer and near the cart icon.

## Supported regions
Selector options (map country → currency label shown):
- Canada — CAD
- United States — USD
- United Kingdom — GBP
- European Union (Ireland `IE` as representative EU country) — EUR
- Australia — AUD
- New Zealand — NZD

Default: Canada (CAD). Persisted to localStorage as `empowered-region`.

## Implementation

**1. New `src/stores/regionStore.ts`**
Zustand + persist store: `{ countryCode: 'CA'|'US'|'GB'|'IE'|'AU'|'NZ', setCountry(code) }`. On `setCountry` also call `useMerchCartStore.getState().clearCart()` so a stale cart in another currency isn't carried over (Shopify carts are locked to one currency; switching mid-cart is the correct UX).

**2. `src/lib/shopify.ts`**
- Add `COUNTRY_OPTIONS` constant (code, label, currency).
- Update `STOREFRONT_PRODUCTS_QUERY` and the single-product query to accept `$country: CountryCode!` and use `@inContext(country: $country)` on the operation.
- Update `storefrontApiRequest` / the product hooks (`useShopifyProducts`, `useShopifyProduct`) to read `countryCode` from the region store and pass as a variable; include `countryCode` in React Query keys so switching triggers a refetch.

**3. `src/stores/merchCartStore.ts`**
- `createShopifyCart` mutation: pass `buyerIdentity: { countryCode }` in `CartInput` and add `@inContext(country: $country)` to the mutation so `checkoutUrl` opens with the correct market.
- When region changes, cart is cleared (see step 1), so no need to migrate existing carts.

**4. New `src/components/RegionSelector.tsx`**
Compact dropdown using existing shadcn `DropdownMenu`:
- Trigger: `🌐 {country label} | {currency}` with a chevron; mobile-friendly (44px min height, truncates gracefully).
- Menu items list the 6 regions; selected one is checked.
- Two size variants via prop: `compact` (header, icon + code only e.g. "🌐 CAD") and `default` (footer, full label).

**5. Placement**
- `src/components/Footer.tsx`: add the selector in Row 2 alongside social icons (left of newsletter on desktop, above socials on mobile).
- `src/components/Header.tsx`: add the compact variant to the right of the cart icon on `/shop*` and `/product*` routes (use `useLocation` to conditionally render so it doesn't clutter the general-audience nav). Also add compact variant to the merch cart button area.

**6. Cart drawer note**
`MerchCartDrawer` already reads prices from the cart items which now come back in the selected currency, so no changes needed beyond confirming the price formatter uses `item.price.currencyCode`.

## Verification
- Switch to each region on `/shop/merch`, confirm product tile prices update.
- Open a product page, confirm price + variant prices update.
- Add to cart, open cart drawer, confirm currency matches.
- Click "Checkout with Shopify" and confirm the Shopify checkout page opens in the selected currency (this requires Shopify Payments + Markets local-currency setting on Shopify's side, which the user is enabling separately).
- Switch region while items are in cart → cart clears with a toast explaining why.

## Notes / caveats
- Prices only actually convert if Shopify Markets has that country enabled with local-currency pricing. Until Shopify Payments is on, non-primary markets may fall back to the store's base currency; the selector still functions and will "light up" automatically once Markets is fully configured.
- EU is represented by a single `IE` country code because Shopify Markets treats each EU country individually; using one representative country keeps the selector to one "European Union — EUR" option. If preferred, we can expand this to list individual EU countries later.
