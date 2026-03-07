

## Plan: Three adjustments to the Downloadables page

### 1. Slow down the carousel in `InsideDLDResourceHub.tsx`
- Change the autoplay interval from `5000ms` to `8000ms` (line 76) to give readers more time.

### 2. Reduce padding around the Library Intro section in `DownloadablesLibraryIntro.tsx`
- Reduce the section's vertical padding from `py-16 md:py-20 lg:py-24` to `py-10 md:py-14 lg:py-16`.

### 3. Restyle "Ready to Access Everything?" to match the black Resource Library CTA
In `DownloadablesSignupCTA.tsx`, replace the current plain `bg-muted` layout with the same black rounded card style used in `ResourceLibraryCTA.tsx`:
- Wrap content in a `bg-black text-white rounded-2xl` card with `DotBackground`
- Use the same horizontal flex layout (text left, button right on desktop)
- Keep the "Ready to Access Everything?" heading and description, styled in white
- Add the same padding, gap, and button styling as the Resource Library CTA

### Files
- **Edit** `src/components/InsideDLDResourceHub.tsx` -- change `5000` to `8000`
- **Edit** `src/components/DownloadablesLibraryIntro.tsx` -- reduce section padding
- **Edit** `src/components/DownloadablesSignupCTA.tsx` -- rewrite to match `ResourceLibraryCTA` black card style with DotBackground

