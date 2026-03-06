

## Plan: Replace "Does This Sound Familiar?" with Premium Split-Screen Scroll Section

Replace the current `DoesSoundFamiliarSection` component with a new editorial split-screen scroll experience on the For Parents page.

### Architecture

**New component:** `src/components/SplitScreenScroll.tsx`

- **Desktop (lg+):** Two-column layout (42% / 58%). Left column uses CSS `position: sticky` with `top: 50%` transform centering. Right column contains 3 vertically stacked image panels (~80vh each). Intersection Observer detects which panel crosses the viewport center, updating the active index. Left panel content cross-fades using opacity + translateY transitions (400ms).

- **Mobile/Tablet (<lg):** Sticky disabled. Each panel renders as text block directly above its image, stacked vertically.

### Content (3 panels, placeholder)

Split the existing "Does this sound familiar?" content across 3 panels:

1. **"The Signs"** — The "You're noticing" bullet list with existing project image (`mother-daughter-reading.png`)
2. **"The Dismissals"** — "Give it time" / "they're shy" paragraph with image (`boy-thinking.png`)
3. **"The Answer"** — DLD explanation + "Understanding changes everything" with image (`family-reading.png`)

Each left-side panel shows: step label ("1 / 3"), serif heading, paragraph text, and a rounded CTA button.

### Transition mechanics

- Active index state driven by Intersection Observer (`threshold: 0.5`, `rootMargin` centered)
- Left content uses absolute positioning with CSS transitions: `opacity 0.4s ease, transform 0.4s ease`
- Inactive: `opacity-0 translate-y-4`; Active: `opacity-100 translate-y-0`

### Section styling

- Background: soft warm off-white (`bg-[#FAF9F7]`)
- Section has no container max-width constraint (full bleed columns)
- Images use `object-cover` with `rounded-xl` corners

### Integration

- Replace `<DoesSoundFamiliarSection />` with `<SplitScreenScroll />` in `ForParents.tsx`
- Keep the old component file intact (not deleted) in case other pages reference it

### Files changed

1. **Create** `src/components/SplitScreenScroll.tsx` — Full component
2. **Edit** `src/pages/ForParents.tsx` — Swap import and usage

