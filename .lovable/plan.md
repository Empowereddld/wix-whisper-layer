

## Larger, Bolder Heading + Tighter Layout for StatBand

Refine the StatBand on the StoryBuilders page to feel more impactful and visually balanced.

### Changes (all in `src/components/StatBand.tsx`)

1. **Bigger heading** — Increase desktop size from `42px` to `52px` and widen `max-w` from `320px` to `480px` so the text breathes better
2. **Vertically center** both columns using `md:items-center` instead of `md:items-start`
3. **Bump body text** — Increase desktop paragraph size from `16px` to `17px` and opacity from `background/80` to `background/85`
4. **Tighten vertical padding** — Reduce desktop padding from `py-16` to `py-12` so the section feels more compact and punchy
5. **Reduce gap** — Shrink the column gap from `gap-6` to `gap-4` on mobile

These are purely CSS/class changes — no structural or prop changes needed. The homepage StatBand will also benefit from the same refinements.

