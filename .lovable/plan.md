## Goal
Make the DLD Awareness Merch card link to the live `/shop/merch` page and add "Merch" to the Shop dropdown in the header.

## Changes

1. **`src/components/SupportSection.tsx`** (homepage "What We Offer" card)
   - Change CTA from `"COMING SOON"` to `"SHOP MERCH"`.
   - Update `href` from `/shop` to `/shop/merch`.
   - Remove `comingSoon: true` so it renders as an active link.

2. **`src/components/ShopBrowseByCategory.tsx`** (Shop page category grid)
   - Remove `comingSoon: true` on the Merch category so the "Coming Soon" badge is hidden and the card is fully clickable.

3. **`src/components/Header.tsx`** (Shop dropdown)
   - Add `{ label: "Merch", href: "/shop/merch" }` to `shopLinks`, placed after "Bulk Orders" and before "Educational App". Applies to both desktop and mobile menus (same array).

## Out of scope
No other copy changes, no changes to `/shop/merch` itself, no route or business-logic changes.