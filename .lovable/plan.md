# "What Is DLD?" music page + Awareness Month popup

## What we're building

Per the uploaded spec: a permanent music section (page at `/music`) and a temporary home-page popup promoting the song "What Is DLD?" during DLD Awareness Month (October 3–31, 2026). The visitor sees Empowered DLD branding and streaming options only; LANDR is never mentioned in public-facing copy.

## 1. Music page at `/music` (permanent, multi-song)

Built as the long-term home for Empowered DLD music, structured so more songs can be added later.

- **Cover art**: downloaded from the release artwork found on the smart link page, converted to WebP for web performance, imported as a project asset.
- **Hero section**: heading "What Is DLD?", artist Empowered DLD, short line "A child-friendly song created to help children understand DLD and learn what can help." Main button "Listen to the song" opens the existing streaming smart link (`https://release.landr.com/what-is-dld`, referenced in code as the streaming smart link, no LANDR branding shown).
- **Why we made this song**: uses the supplied draft copy verbatim ("Children with DLD often grow up knowing that some things feel harder...").
- **Use it to start a conversation**: prompt "Listen together, then ask your child: What helps your brain when language feels hard?"
- **Help someone learn about DLD**: "Share What Is DLD? with a teacher, family member, friend, or someone who works with children."
- **Explore more from Empowered DLD**: "Meet Dan & Daria in the books" → `/shop/books`; "Find free DLD resources for families" → `/hub`.
- Space below the featured song reserved for future songs.

## 2. SEO and site structure

- `/music` as a proper lazy-loaded route in `src/App.tsx`, indexable.
- `SEOHead` with exactly: title "What Is DLD? | Music from Empowered DLD", meta description "Listen to What Is DLD?, a child-friendly song from Empowered DLD created to help children and families understand Developmental Language Disorder."
- Added to `scripts/generate-sitemap.ts` so `/music` appears in the sitemap.

## 3. Home-page popup (`src/components/SongPromoPopup.tsx`)

- Home page only; never on checkout, signup, account, or any other page.
- Appears after ~15 seconds; shows the song cover art; easy to dismiss via X, Escape, or clicking outside; mobile-friendly with accessible touch targets.
- Copy as supplied: heading "A song for DLD Awareness Month 💜💛", body "What Is DLD? helps children and families understand DLD in a way they can hear, remember, and share.", button "Listen to the song" → `/music`.
- Frequency: dismissed once = not shown again for 7 days; cooldown stored in the browser (localStorage).
- Campaign window: October 3, 2026 through October 31, 2026, kept as easy-to-update date constants so the pattern is reusable. Outside those dates it renders nothing.

## 4. Untouched

- Gold Story Pros announcement bar and wording; newsletter consent flow; newsletter prompts; EmailOctopus setup, lists and tags; checkout and signup flows; no unrelated redesign.

## Files touched

- `src/components/SongPromoPopup.tsx` (new)
- `src/pages/Music.tsx` (new)
- `src/App.tsx` (route + popup mount on `/`)
- `src/pages/Index.tsx` (mount popup)
- `scripts/generate-sitemap.ts` (add `/music`)
- `src/assets/` (cover art WebP)

## Verification

- Playwright: popup not immediate, appears after delay, X/Escape/outside dismiss works, dismissal holds for 7 days on reload, home page only, Listen button routes to `/music`; music page loads on desktop and mobile with correct title and meta; popup renders nothing after October 31, 2026 (tested by shifting the constant); sitemap includes `/music`; build clean.
