## Goal

Clean up `/shop/merch/:handle` so it (1) shows a real multi-image gallery and (2) shows a short, focused description with size chart and care instructions tucked into collapsible sections.

## 1. Multi-image gallery

Update `src/components/merch/MerchProductDetail.tsx` to render all images from `product.images.edges` instead of just `getFirstImage`.

- Reuse the existing pattern from `src/components/hub/SampleGallery.tsx`: large main image on top, thumbnail strip underneath, click a thumbnail to swap the main image. Keep it visually consistent with the hub's gallery (rounded-2xl, `aspect-square` for merch since product mockups are square).
- Add local state `activeImageIndex`; default to 0.
- If only one image exists, hide the thumbnail strip.
- Bump the Storefront query `images(first: 5)` to `images(first: 20)` in both `STOREFRONT_PRODUCTS_QUERY` and `STOREFRONT_PRODUCT_BY_HANDLE_QUERY` in `src/lib/shopify.ts` so Gelato's full mockup set comes through.

Note: Shopify's Storefront API `images` field returns product images (all media of type IMAGE). Gelato syncs mockups as product images, so this covers the "all product media" ask without needing the separate `media` field.

## 2. Split description into intro + Size Guide + Care Instructions

The Shopify description for this product concatenates: intro copy → size chart → care instructions. We will not mutate the Shopify record. Instead, parse `product.description` on the client and split it into three sections.

Approach in `MerchProductDetail.tsx`:

- Add a small helper `splitProductDescription(raw: string)` that returns `{ intro, sizeGuide, careInstructions }`.
- Split by common heading markers, case-insensitive: `Size Chart`, `Size Guide`, `Sizing`, `Care Instructions`, `Care Guide`, `Care`. Everything before the first matched heading is `intro`; content under `Size *` becomes `sizeGuide`; content under `Care *` becomes `careInstructions`.
- Render:
  - `intro` in the current description slot (whitespace preserved with `whitespace-pre-line`).
  - Below the Add-to-Cart trust strip, add two shadcn `Accordion` (single, collapsible) items: **Size Guide** and **Care Instructions**, only rendered when their section is non-empty.
- For this specific product, the user provided the canonical intro copy. The parser will already extract it correctly from the current Shopify description, so no hardcoded override is needed. If the parser ever fails to find a heading, we fall back to showing the full description as intro (current behavior), so nothing regresses.

## 3. What is NOT changing

- No Shopify data edits (per "do not publish yet" / keep as-is).
- No changes to grid card, cart, or checkout flow.
- No changes to routing or SEO.

## Files touched

- `src/lib/shopify.ts` — bump `images(first: 5)` → `images(first: 20)` in the two product queries.
- `src/components/merch/MerchProductDetail.tsx` — gallery state + thumbnail strip; description parser; Size Guide / Care Instructions accordions.

## Verification

- Load `/shop/merch/pause-please-i-m-thinking-kids-t-shirt`, confirm: thumbnails render, clicking swaps the hero image, intro paragraph matches the copy you provided, Size Guide and Care Instructions appear as collapsed accordions with the remaining content inside.
- Screenshot via Playwright at 1054px width to match your viewport.
