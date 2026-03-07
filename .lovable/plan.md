

## Plan: Add Social Proof Section to Work With Us Page

### What
Create a new `WorkWithUsSocialProof` component — a clean, centered section with white background, a headline, a row of muted/grayscale icon logos, and a rating pill. Place it between `WorkWithUsBrowseSection` and `ContactSection`.

### Component: `src/components/WorkWithUsSocialProof.tsx`
- White background, generous vertical padding (`py-28`), centered text
- Headline: "Trusted by families, educators, and therapists worldwide"
- Logo row using existing assets (`icon-parents.png`, `icon-educators.png`, `icon-slps.png`, `icon-organizations.png`) plus the community/Facebook group concept — all rendered with `grayscale opacity-70` filter, spaced with `gap-12`
- Rating pill: inline-flex rounded-full border pill with "4.9/5 ★★★★★ From thousands of parents and professionals"

### Page Update: `src/pages/WorkWithUs.tsx`
- Import and add `<WorkWithUsSocialProof />` after `<WorkWithUsBrowseSection />`

### Notes
- Will reuse the 4 existing icon assets from `src/assets/` rather than referencing nonexistent SVGs
- Minimal styling, lots of whitespace, no stat cards or borders (just the pill border)

