

## About DLD — "What is DLD?" Section

**Layout** (inspired by the reference screenshot):
- Large, bold italic headline in a warm coral/orange color, left-aligned, spanning roughly 60% width
- Below: two-column body text layout (stacking on mobile)
- White background, generous vertical padding

**Content mapping:**
- **Headline (italic, coral):** A pull-quote style statement like *"DLD affects how the brain processes language — not intelligence, not effort, not potential."*
- **Left column:** First paragraph about what DLD is and what children experience
- **Right column:** The two shorter paragraphs about what DLD is NOT caused by, and that it continues into adulthood

**Styling:**
- Headline: `font-serif italic` in a coral/warm-red color (~`text-[#E8573A]` or similar), large sizing (`text-[36px] md:text-[48px]`)
- Body: standard `text-[14px] md:text-[15px]` in muted foreground, two-column grid `lg:grid-cols-2`
- Section padding: `py-16 md:py-[120px]` per spacing rhythm
- Container: standard 1100px max-width

**File:** New component `src/components/WhatIsDLDSection.tsx`, added to `src/pages/AboutDLD.tsx`

