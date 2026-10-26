# Make the Parent Guidebook hero match the For Parents hero layout

## Why they look different
When the buy button was added, the guidebook hero got its own layout so the wide desk photo would show uncropped:
- The gray text card is narrower (about half the width instead of about 58%).
- The photo keeps its wide shape and floats in the middle, so it's shorter than the card instead of filling the full height.
- The button uses the checkout button's own lettering (tighter spacing) instead of the "Join Our Community" style.
- The whole hero sits a little lower on the page, and the "Join the Library" header button is outlined on this page only (an earlier purchase-focused choice).

## Changes (Parent Guidebook page only)
1. Text card goes back to the same width and bottom spacing as the For Parents hero.
2. Photo fills the full height beside the card, like the mother-and-daughter photo, cropped to keep the tablet and activity sheets in view (the edges of the desk get trimmed).
3. Button keeps its working $9.99 checkout but uses the same letter spacing and size as "Join Our Community".
4. Remove the extra space above the hero so it starts at the same height.
5. Header button stays as is unless you'd like it purple here too.

For Parents page, checkout, and the rest of the guidebook page stay unchanged. Checked on desktop and phone, not published.

## Technical details
- `GuidebookHero.tsx`: drop the `purchaseButton` layout branches (card `lg:w-[58%] lg:pb-24`, image `lg:flex-1 max-h... lg:max-h-none`, img `object-cover object-[75%_center]`); investigate and remove the source of the extra top offset.
- `GuidebookBuyButton` hero variant: match `tracking-[0.12em]`, `h-12 md:h-14`, font sizes of the For Parents anchor. Checkout call and analytics untouched; existing tests rerun.
