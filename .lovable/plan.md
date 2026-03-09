

## Plan: Create a "Coming Soon" Page for the Resource Hub

### What we'll build
A clean, branded "Coming Soon" page at `/hub/coming-soon` and redirect all public-facing hub/library links there. Internal hub routes (dashboard, settings, etc.) remain untouched for your admin/testing use.

### New file
**`src/pages/hub/HubComingSoon.tsx`** — A minimal, on-brand page with:
- Empowered DLD logo (links back to home)
- "Coming Soon" heading
- Brief message: "The Empowered DLD Resource Library is launching soon. Free guides, posters, and tools for parents, therapists, and educators — all in one place."
- A "Back to Home" button
- Matches the site's existing visual style (gradient background, rounded card, midnight colors)

### Route change
**`src/App.tsx`** — Add `/hub/coming-soon` route pointing to the new page.

### Links to redirect (6 files)
All public-facing CTAs that currently point to `/hub/preview`, `/hub/signup`, or `/hub/login` will be changed to `/hub/coming-soon`:

| File | Current destination |
|------|-------------------|
| `ResourceLibraryCTA.tsx` | `/hub/preview` → `/hub/coming-soon` |
| `DownloadablesSignupCTA.tsx` | `/hub/preview` → `/hub/coming-soon` |
| `DownloadablesLibraryIntro.tsx` | `/hub/preview` → `/hub/coming-soon` |
| `DownloadablesHero.tsx` | `/hub/preview` → `/hub/coming-soon` |
| `ForTherapistsHero.tsx` | `/hub/preview` → `/hub/coming-soon` |
| `Header.tsx` | Any "Get Free Access" or hub login links → `/hub/coming-soon` |

### What stays unchanged
- All `/hub/*` routes (dashboard, signup, login, settings, etc.) remain functional for your use
- Admin routes unaffected
- Auth system unaffected
- When you're ready to launch, we just swap the links back

