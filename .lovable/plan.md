

## Plan: Align StoryBuilders Hero with Standard Sub-page Pattern

### What changes

Replace the current warm off-white two-column hero (lines 23-87) with the standard deep-purple centered hero pattern used across Shop, Resources, About DLD, etc.

**New hero structure** (matching `ShopHero`, `ResourcesHero`, etc.):
- `bg-deep-purple py-20 md:py-28 lg:py-32`
- Centered layout with `container px-6 md:px-8 flex flex-col items-center text-center gap-6`
- Small-caps label: `COMING SOON` in `text-white/60`, `tracking-[0.22em]`
- Headline: "The Storytelling App Created to Support Children With DLD" — `font-black text-white max-w-[800px]`
- Subheadline: the existing description — `text-white/80 max-w-[620px]`
- Two CTA buttons centered: "Join the Launch Team" (white bg, deep-purple text) and "See How It Works" (outline white)
- Microcopy: `text-white/50`

### What stays the same
- "Why storytelling matters" section — unchanged
- "Be the first to try StoryBuilders" final CTA section — unchanged
- Header, Footer, SEOHead — unchanged
- The hero image import can be removed (no longer used in hero; could be reused in a later section)

### File modified
- `src/pages/StoryBuilders.tsx` — replace hero section only (lines 23-87)

