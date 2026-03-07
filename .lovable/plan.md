

## Plan: Reimagine "Inside the DLD Resource Hub" into 3 stacked sections

Replace the current single `InsideDLDResourceHub` component with three distinct sections on the Downloadables page.

### Section 1: Resource Library Intro (new component `DownloadablesLibraryIntro.tsx`)
- Asymmetric left/right layout (40/60 split on desktop, stacked on mobile)
- **Left**: Static branded image (reuse an existing asset like `resource-preview-1.png` or `family-reading.png` as a placeholder mockup)
- **Right**:
  - Headline: "Your Complete DLD Resource Library"
  - Body: "Practical tools for parents, therapists, and educators. From starter guides to classroom posters -- everything you need is here."
  - CTA link: "Sign Up for Free Access" (arrow icon, links to `/hub/preview`)
  - Trust line: "Trusted by 4,000+ families and professionals in 15+ countries"
- Follows the existing editorial grid pattern with `items-start` alignment

### Section 2: Resource Carousel (refactor existing `InsideDLDResourceHub.tsx`)
- Remove the current header/description ("Inside the DLD Resource Hub" text block)
- Replace with centered label + headline above the carousel:
  - Small uppercase label: "FEATURED RESOURCES"
  - Headline: "What's Inside"
- Keep the existing `AnimatedResources` carousel with all 5 resources and animations intact

### Section 3: Sign-up CTA band (new component `DownloadablesSignupCTA.tsx`)
- Full-width light grey background (`bg-muted`)
- Centered content: headline "Ready to Access Everything?" + a prominent CTA button "Create Free Account" linking to `/hub/preview`
- Simple, clean, minimal -- acts as the final conversion point

### Changes to `Downloadables.tsx`
- Replace `<InsideDLDResourceHub />` with the three new sections in order:
  1. `<DownloadablesLibraryIntro />`
  2. `<DownloadablesCarousel />` (renamed from InsideDLDResourceHub)
  3. `<DownloadablesSignupCTA />`

### Files to create/edit
1. **Create** `src/components/DownloadablesLibraryIntro.tsx` -- Section 1
2. **Edit** `src/components/InsideDLDResourceHub.tsx` -- Strip header text, add "FEATURED RESOURCES" / "What's Inside" labels, keep carousel
3. **Create** `src/components/DownloadablesSignupCTA.tsx` -- Section 3
4. **Edit** `src/pages/Downloadables.tsx` -- Import and compose the three sections

