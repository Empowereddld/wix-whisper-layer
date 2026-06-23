# Shop Merch (Shopify + Gelato) — Build Plan

Goal: stand up a branded `/shop/merch` page that pulls products from a new Shopify store, hands checkout off to Shopify, and is fulfilled by Gelato. Page stays hidden from visitors until you give the green light. **Phase 2 first** (build the page with placeholder products) so you know the exact image sizes before designing real mockups.

## Phase 2 (do this first) — Branded /shop/merch page with placeholders

A new page at `/shop/merch`, styled to match Empowered DLD (DM Sans, purple palette, 1100–1300px container, rounded-xl cards, WebP imagery, scroll fade-ins). Sections:

1. **Hero** — purple band, headline "Wear It. Share It. Start the Conversation.", subhead about DLD awareness.
2. **Mission strip** — short editorial paragraph: every shirt, mug, and tote helps more people learn what DLD is. No "free" framing.
3. **Product grid** — 3 placeholder products (t-shirt, mug, tote) with generated on-brand mockup images so you can see the layout. Card style matches existing Shop category cards.
4. **Product detail** (`/shop/merch/:handle`) — gallery, variant selector (size/color), price, add-to-cart, description, shipping note ("Printed on demand and shipped worldwide by our print partner. Allow 5–10 days.").
5. **Cart drawer** — slide-out from header with line items, qty controls, subtotal, "Checkout" button (stub for now, wired to Shopify in Phase 3).
6. **FAQ / shipping band** — sizing, returns, international shipping, who fulfills.
7. **ChoosePathCTA** footer pattern.

### Hide the page until launch
- Route exists but is not linked from anywhere (Shop page Merch card keeps "Coming Soon", stays non-clickable).
- `noindex` on `/shop/merch` and detail pages.
- `robots.txt` adds `Disallow: /shop/merch`.

### Image specs you can hand to ChatGPT later
Once the page exists I will give you exact sizes (likely 1200x1200 square product, 1600x900 hero, 800x800 cart thumb) so your real mockups drop straight in.

## Phase 1 (after you see the page) — Accounts

### Shopify (I trigger)
Lovable Shopify enable flow creates a **new development store**. Free while building, 30-day Shopify trial when you claim it, paid plan required to sell live.

### Gelato (you do, I guide)
1. Free account at gelato.com.
2. Connect Shopify (Stores → Connect → Shopify).
3. Pick t-shirt, mug, tote.
4. Upload your final designs (PNG, 300dpi, transparent background).
5. Set retail prices. Profit margin = retail minus Gelato cost.
6. Publish, products flow into Shopify automatically.

## Phase 3 — Wire it up

- Shopify Storefront API (read-only public token) for product listings and cart.
- Cart state in React context + localStorage.
- Checkout = redirect to Shopify-hosted checkout. Shopify handles payment, taxes, emails, order records. Gelato auto-receives and ships.

## Phase 4 — Go-live checklist (when you say "we're good")

1. You claim the Shopify store (starts 30-day trial, pick paid plan to sell).
2. Confirm Gelato test order prints and ships correctly.
3. Remove `noindex`, remove `Disallow`, remove "Coming Soon" badge on `/shop`, link the Merch card to `/shop/merch`.
4. Add `/shop/merch` and product pages to sitemap.
5. Announce.

## Technical notes

- New pages: `src/pages/ShopMerch.tsx`, `src/pages/ShopMerchProduct.tsx`. Routes in `src/App.tsx`.
- New components in `src/components/merch/`: `MerchHero`, `MerchMissionStrip`, `MerchProductGrid`, `MerchProductCard`, `MerchProductDetail`, `MerchCartDrawer`, `MerchFaq`.
- New hook `src/hooks/useShopify.ts` (added in Phase 3) wrapping Storefront API.
- Cart context `src/contexts/CartContext.tsx`, mounted in `App.tsx`.
- Placeholder product data in `src/data/merchPlaceholders.ts` until Shopify is wired.
- DM Sans + purple palette tokens, no hardcoded hex, rounded-xl cards, scroll fade-ins via `useScrollFadeIn`, WebP imagery, no em dashes anywhere.
- Sitemap untouched until launch.

## What I will do as soon as you approve

1. Generate 3 on-brand placeholder product mockups (t-shirt, mug, tote in purple palette).
2. Build the hidden `/shop/merch` + product detail pages.
3. Hand you a private preview URL pattern so only you can see it.
4. Give you the exact image dimensions to use when you create real mockups in ChatGPT.