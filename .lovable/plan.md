

## iPad Fix — Image Sizing + Gap Removal

Two issues visible in the screenshots:

1. **Hero image is too tall** — When stacked on iPad, the image has `aspect-[4/3]` at mobile but `md:aspect-auto` kicks in at 768px, making it expand to its natural (very tall) height. Need to keep a constrained aspect ratio on tablet.

2. **Large gap between "Does this sound familiar?" sections** — The black card and text column are in a grid with `items-stretch`. When stacked on iPad (single column), the black card has no intrinsic height constraint, so it just shows the heading with minimal content. The `py-6 md:py-10` on the text column adds extra vertical padding. The `md:py-[120px]` section padding also contributes to the gap feeling.

### Changes

**1. `ForParentsHero.tsx`**
- Change image aspect from `aspect-[4/3] md:aspect-auto` to `aspect-[4/3] lg:aspect-auto` so it stays constrained at 4:3 on iPad
- Add `max-h-[400px] lg:max-h-none` to the image container to cap its height on tablet

**2. `DoesSoundFamiliarSection.tsx`**
- The black card on mobile/tablet (single column) needs a minimum height so it looks intentional: add `min-h-[200px]` (only matters when single-column)
- Change text column padding from `py-6 md:py-10` to `py-2 lg:py-10` to reduce gap on tablet
- The `md:py-[120px]` section spacing is fine — the gap is from the internal padding

| File | Change |
|---|---|
| `ForParentsHero.tsx` | Constrain image aspect ratio and max-height on tablet |
| `DoesSoundFamiliarSection.tsx` | Reduce text column padding on tablet, add min-height to black card |

