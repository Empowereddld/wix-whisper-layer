# Fix the hidden kids t-shirt photo

I hid the wrong one of the two near-identical "girl with bangs at the desk" photos.

Checked both files directly: the one currently still showing is the **ash grey / heather** tee (shirt pixels average RGB 223,225,228), and the one I hid is the **white** tee (240,241,245).

## Change

In the merch image filter for the kids t-shirt:

- Stop hiding the white-shirt photo (`94c2d6fe...`) so it comes back into the gallery.
- Hide the ash grey shirt photo (`55c3df09...`) instead.

No other product images change: the water bottle plain white render and the flat tote mockup stay hidden as requested.

## Technical detail

Single edit to `IMAGE_EXCLUDES["pause-please-i-m-thinking-kids-t-shirt"]` in `src/lib/shopify.ts`: swap the excluded UUID from `94c2d6fe-eb86-4b45-8baa-89a92a13ca82` to `55c3df09-ccb1-42d3-bdf2-12e32d98382e`.
