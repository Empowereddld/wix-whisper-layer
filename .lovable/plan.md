## Rebuild `/preview/dan-and-the-paper-airplane`

Replace `src/pages/preview/DanAndThePaperAirplane.tsx` with a faithful React port of the uploaded `dan-and-the-paper-airplane-FINAL-3.html`. All copy, structure, classnames, and styles will be transcribed verbatim (no rewrites, no em-dashes, British English preserved).

### Image assets (copy uploads → `src/assets/preview/dan-airplane/`)

- `book-cover-2.jpg` → `book-cover.jpg`
- existing `lifestyle-boy-reading.webp` and `lifestyle-classroom.webp` will be reused (already in repo)
- `scene1-instructions-left-2.jpg` → `scene1-instructions-left.jpg`
- `scene1-instructions-right-2.jpg` → `scene1-instructions-right.jpg`
- `scene2-dld-explained-left-2.jpg` → `scene2-dld-explained-left.jpg`
- `scene2-dld-explained-right-2.jpg` → `scene2-dld-explained-right.jpg`
- `scene3-one-step-left-2.jpg` → `scene3-one-step-left.jpg`
- `scene3-one-step-right-2.jpg` → `scene3-one-step-right.jpg`
- `scene4-glossary-left.jpg` → `scene4-glossary-left.jpg`
- `scene4-glossary-right.jpg` → `scene4-glossary-right.jpg`

(I'll ask the user to upload `lifestyle-boy-reading.jpg` and `lifestyle-classroom.jpg` replacements only if they want them swapped; otherwise the existing webp assets are kept.)

### Page sections (verbatim from HTML)

1. Hero — eyebrow "A Sample From Empowered DLD", h1 "A first look at *Dan and the Paper Airplane*", subtitle about *Living Life with DLD* series, with `book-cover.jpg` on right.
2. "What this story gives a child" — image left, 3 paragraphs right.
3. Lifestyle band — full-width classroom image with overlay "In homes. In clinics. In classrooms."
4. "Why we think it belongs in your work" — deep-purple section, two cards: "For your sessions" / "For the families you work with" (verbatim bullets).
5. "A note on the glossary" — eyebrow "Inside The Book", paired with `scene4-glossary-left.jpg` + caption "The glossary table at the back of the book."
6. "Four scenes from the book" — intro "The story moves through these moments in order. The full book is 28 pages." Then four scene cards:
   - Scene One: "Dan tries to follow Mr. Mac's multi-step instructions." — 2-image spread
   - Scene Two: "Ms. Lopez explains DLD to Dan in plain language." — 2-image spread
   - Scene Three: "Dan asks his friend for one step at a time." — 2-image spread
   - Scene Four: "A look at the back-of-book glossary spread." — 2-image spread (glossary-left + glossary-right)
7. CTA "When you're ready" — Amazon UK button + wholesale email button (preserving existing UTM-passthrough logic on Amazon link).
8. Sign-off "A note from us" — full paragraph + "With care," + signature grid (Camesha Russell / Jinean Cheng with credentials) + "Co-founders, Empowered DLD".

### Technical implementation

- Single TSX file with inline `<style>` block transcribed from the HTML (CSS variables, all selectors, responsive breakpoints at 900px/540px).
- Use ES module imports for all images from `src/assets/preview/dan-airplane/`.
- Keep `useEffect` for `<title>`, meta description, robots noindex, and Google Fonts (Poppins + Inter) preconnect/stylesheet.
- Preserve the UTM-passthrough behaviour for the Amazon CTA (existing code).
- Mailto: `mailto:hello@empowereddld.com?subject=Wholesale%20enquiry%20%E2%80%94%20Dan%20and%20the%20Paper%20Airplane` (note: source HTML uses `%E2%80%94` em-dash in URL only — this is in the original HTML so kept verbatim per "strict source of truth").
- No header/footer chrome (matches original standalone HTML).

### Confirmed scene captions (verbatim)

1. Dan tries to follow Mr. Mac's multi-step instructions.
2. Ms. Lopez explains DLD to Dan in plain language.
3. Dan asks his friend for one step at a time.
4. A look at the back-of-book glossary spread.
