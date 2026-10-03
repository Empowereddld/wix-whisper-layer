# Remove the "Empowered DLD" badge from the song cover artwork

## Problem
The "Empowered DLD" pill in the top-left corner of the *What Is DLD?* cover artwork is baked into the image itself (no component renders it). In the home-page popup, the artwork sits beside the text and is cropped, so the badge gets cut off and reads "powered DLD".

## Fix
1. Download the current cover artwork asset (the source behind `src/assets/what-is-dld-cover.webp.asset.json`).
2. Use image editing (inpaint-style edit) to remove only the "Empowered DLD" badge from the top-left corner, leaving the rest of the artwork untouched.
3. Re-optimize to WebP and create a fresh lovable-assets pointer, replacing `src/assets/what-is-dld-cover.webp.asset.json` so both the popup and the `/music` page pick up the new image automatically (they share this one asset).

## Scope
- Only the artwork file changes. No layout, copy, campaign window, or cooldown changes.
- Note: since popup and music page share the asset, the badge disappears from both. If you'd rather keep the badge on the full `/music` page artwork, say so and I'll instead keep the original there and use the cleaned version only in the popup.

## Verification
- Playwright check of the popup (after the 15s delay) confirming the badge is gone and nothing is cut off, desktop and mobile widths.
- Visual check of `/music` hero artwork.
- Build clean.
