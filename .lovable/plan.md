# "What Is DLD?" song: music page + delayed popup (DLD Awareness campaign)

## What we're building

The new release "What Is DLD?" (3:54, distributed via LANDR, listed on Spotify, Apple Music, YouTube Music, Amazon Music and TIDAL) currently has no home on the website. We add a permanent music page and a gentle, time-limited popup on the home page to promote it around DLD Awareness Day.

Two pieces:

1. **A music page** at `/music` — permanent home for the song.
2. **A delayed popup** on the home page only — awareness campaign, shown at most once per visitor.

Note: it is a single, not an album, so wording on the site will say "song" / "new single".

## 1. Music page (`/music`)

- Cover art: downloaded from the release artwork (`imagestore.ffm.to` PNG found on the LANDR page), converted to WebP for performance, imported as a project asset.
- Content:
  - Page hero: song title "What Is DLD?", artist Empowered DLD.
  - Short story section: why the song exists, what it stands for (drafted in the Empowered DLD voice; user can adjust copy after seeing it).
  - **Listen button → `https://release.landr.com/what-is-dld`** (this link never breaks and routes to all streaming services).
  - Secondary links: back to `/shop/books` (book series) and `/hub` (resource library), so music visitors discover the site.
  - Optional placeholder slots for direct Spotify/Apple Music links, filled with the LANDR link until the user pastes the direct URLs.
- Route added in `src/App.tsx`, lazy-loaded, with `SEOHead` (indexable: title "What Is DLD? | The Song – Empowered DLD" + description), added to `scripts/generate-sitemap.ts` so it lands in the sitemap.

## 2. Delayed popup (home page only)

New component `src/components/SongPromoPopup.tsx`:

- Appears **after ~15 seconds on the home page** (not on landing), using the existing shadcn `Dialog` (same pattern as `NewsletterPrompt`).
- Shows the cover art thumbnail, one line about the song, a **"Listen to the song"** button → `/music`, and a clear dismiss (X / Escape / click outside).
- **At most once per visitor**: on dismiss, writes `localStorage` key `song_promo_dismissed` and never shows again while the campaign runs.
- **Campaign window only**: constants `CAMPAIGN_START` and `CAMPAIGN_END` in the component, set to **Oct 3 – Oct 31, 2026** (covers DLD Awareness Day). Outside the window the popup renders nothing, so it can be easily reused next year by changing two dates.
- Never appears on other pages, never blocks checkout or signup flows, 44px touch targets, mobile-friendly.

## 3. What stays untouched

- The gold Story Pros announcement bar and its locked wording.
- The newsletter consent flow and newsletter prompts.
- No changes to EmailOctopus, lists or tags.

## Files touched

- `src/components/SongPromoPopup.tsx` (new)
- `src/pages/Music.tsx` (new)
- `src/App.tsx` (route + popup mount on `/`)
- `src/pages/Index.tsx` (mount popup)
- `scripts/generate-sitemap.ts` (add `/music`)
- `src/assets/` (cover art WebP)

## Verification

- Playwright check: popup does not appear immediately, appears after the delay, dismiss sticks on reload, dismiss (X) works, and the Listen button routes to `/music`.
- Music page loads with correct title/meta and sitemap entry.
- Build log clean; popup renders nothing after the campaign end date (test by temporarily shifting the constant).
