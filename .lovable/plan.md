

## Plan: Interactive Stats Cards with Hover Effects

### What Changes

Update `src/components/ShopGlobalCommunity.tsx` to replace the current plain stat layout with individual white cards that have a premium hover effect — background shifts to light lavender, border highlights, card lifts, and stat numbers change color.

### Implementation Details

**Single file edit: `src/components/ShopGlobalCommunity.tsx`**

- Wrap each stat in a white card with `rounded-2xl`, `border border-[#D7CCE5]`, `bg-white`, subtle shadow, and `p-10`
- Add hover transitions via Tailwind: `hover:bg-[#EFE9F5] hover:border-[#8F79B5] hover:border-2 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(143,121,181,0.15)]`
- Number color transitions on hover using `group` / `group-hover:text-[#8F79B5]` (default: `text-[#1F1A3A]`)
- Labels use `text-[#A7B4C4]` (Stone)
- Section heading uses Midnight (`text-[#1F1A3A]`), subheadline uses Stone
- Add `focus-within` states matching hover for keyboard accessibility
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` with `gap-6`
- Responsive number sizing: 56px mobile → 64px tablet → 72px desktop
- All transitions: `transition-all duration-300 ease-in-out`
- No external libraries needed — pure Tailwind + group hover

### No other files change

The component is already imported on Shop and Resources pages.

