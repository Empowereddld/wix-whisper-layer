

## Plan: Remove Coming Soon Page & Redirect CTAs to Hub Preview

### What changes

1. **Delete** `src/pages/hub/HubComingSoon.tsx`

2. **Remove route** for `/hub/coming-soon` from `src/App.tsx`

3. **Replace all `/hub/coming-soon` references** with `/hub/preview` across 7 files:
   - `src/components/Header.tsx` (2 occurrences — desktop + mobile LOGIN buttons)
   - `src/components/ForTherapistsHero.tsx`
   - `src/components/DownloadablesHero.tsx`
   - `src/components/ResourceLibraryCTA.tsx`
   - `src/components/TherapistsRightPlaceSection.tsx`
   - `src/components/DownloadablesSignupCTA.tsx`
   - `src/components/DownloadablesLibraryIntro.tsx`

All "Get Free Access", "LOGIN", "Browse Resources", and "Create Free Account" buttons will now route to `/hub/preview`.

