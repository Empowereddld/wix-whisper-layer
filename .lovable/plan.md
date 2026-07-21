## What happened

Earlier this session you asked to swap the home page hero image to the biracial mom-and-son tote photo. That change is still live in `src/components/HeroSection.tsx`, which is why the tote is showing on the home page even though merch hasn't publicly launched.

Nothing else on the home page changed. The original `hero-girls.webp` / `hero-girls.png` asset is still in the repo and unused.

## Fix

In `src/components/HeroSection.tsx`:
- Replace the `hero-tote-mom.png.asset.json` import with the original `hero-girls.webp` import.
- Update both `<img>` tags (desktop + mobile) to use it, and restore the original alt text ("Two girls smiling" or equivalent to what was there before the swap).
- Leave everything else on the page untouched (headline, CTA, hallway background, layout).

No other files need to change. The tote asset pointer (`src/assets/hero-tote-mom.png.asset.json`) can stay in the repo, unused, in case you want it back later for a merch-focused hero.
