

## Restyle "What Is Story Builders" Section

### Changes to `src/pages/StoryBuilders.tsx` (lines 64–113)

**1. Swap columns** — Move the iPad mockup to the left, text to the right (reverse grid order with `lg:order` classes).

**2. Smaller title** — Reduce from `text-[32px] md:text-[42px] lg:text-[46px]` to `text-[24px] md:text-[30px] lg:text-[34px]`.

**3. White background** — Change `bg-muted` to `bg-white`.

**4. Premium styling suggestions** (to eliminate the "bla" feel):
- Add a **subtle lavender accent line** above the title (a short 40px horizontal bar in primary purple)
- Give the mockup image a **soft lavender glow/shadow** instead of a plain shadow (`shadow-[0_8px_60px_-12px_hsl(258,50%,50%,0.25)]`)
- Add a **light lavender dot pattern** behind the mockup using the existing `DotBackground` component (scoped to the image column) for visual texture
- Make the checklist checkmarks slightly larger and use a subtle purple background circle behind each one
- Add a thin **top border** (`border-t border-border`) to separate from the hook section above

### Result
The section will feel more polished and layered — the dot texture + glow shadow + accent bar add depth without clutter, and swapping columns puts the visual (mockup) first for stronger impact.

