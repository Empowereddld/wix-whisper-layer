

# Plan: Add IEP Goal Builder Bundle to Resource Hub

## Overview

Add a two-part paid product ($14.99 USD) to the existing Resource Hub: a downloadable PDF and an interactive Goal Builder page. Uses all existing infrastructure (tables, edge functions, storage buckets).

## Steps

### Step 1 — Upload PDF and insert database rows
- Upload `Empowered_DLD_IEP_Goal_Bank_2.pdf` to the `resources-private` storage bucket
- Insert a row into the `resources` table: type `bundle`, title "IEP Goal Builder + Printable Goal Bank", roles `['slp', 'educator']`, `file_url` pointing to the private bucket path, appropriate descriptions, `page_count`, `great_for` list
- Insert a row into the `products` table: `price: 1499`, `currency: 'USD'`, linked to the new resource ID

### Step 2 — Update price display (drop currency prefix)
Change `formatPrice` in these 3 files to show `$X.XX` instead of `CA$X.XX`:
- `src/components/hub/ResourceCard.tsx`
- `src/pages/hub/ResourceDetail.tsx`
- `src/components/hub/PurchaseModal.tsx`

Admin pages (`AdminPurchases`, `AdminProducts`) keep their current format since admins need to see the currency.

### Step 3 — Build the Interactive Goal Builder page
Create `src/pages/hub/IEPGoalBuilder.tsx`:
- Convert the uploaded 626-line JSX widget to TypeScript + Tailwind, wrapped in `HubLayout`
- Purchase gate using `usePurchases` hook:
  - **Not purchased**: show 3-4 sample goals unlocked, rest blurred/locked with an "Unlock" CTA button that links to the resource detail page
  - **Purchased**: all 50 goals across 6 domains with fillable fields + "Copy goal" per card
- Search bar + domain filter dropdown (from the widget)
- Category headings and sub-headings for Executive Function subcategories
- Add route `/iep-goal-builder` to `App.tsx` behind `ProtectedRoute`

### Step 4 — Add "Open Goal Builder" button on resource detail page
In `ResourceDetail.tsx`, when this resource is purchased and its type is `bundle`, show a secondary "Open Interactive Goal Builder" button alongside the Download button. Links to `/iep-goal-builder`.

### Step 5 — Set descriptions
- Short description for the card: concise summary of what the bundle includes
- Long description for the detail page: explains both the PDF and interactive tool, how to use them, and which domains are covered

## Technical notes
- No new tables, edge functions, or storage buckets needed
- Existing `create-checkout`, `verify-payment`, `generate-download-url` handle checkout and downloads
- The widget's inline styles will be converted to Tailwind classes using your existing design tokens (deep-purple, thistle, midnight, etc.)
- All 50 goals and their field definitions will be embedded in the page component as static data

