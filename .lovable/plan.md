

## iPad Optimization Plan — For Parents Page

The issue is that several sections use `md` (768px) as their two-column breakpoint, which activates on iPad (768-820px) and creates cramped layouts. The fix is to push two-column layouts to `lg` (1024px) consistently, and adjust the card grid and hero for better tablet behavior.

### Changes

**1. Hero (`ForParentsHero.tsx`)**
- Change the gray card width and image overlay from `md:` to `lg:` prefixes so on iPad the hero stacks vertically (text card full-width, image below)
- This means: `md:w-[58%]` → `lg:w-[58%]`, `md:absolute` → `lg:absolute`, `md:right-0` → `lg:right-0`, etc.

**2. Does This Sound Familiar (`DoesSoundFamiliarSection.tsx`)**
- Change grid from `md:grid-cols-2` → `lg:grid-cols-2` and related `md:gap-12` → `lg:gap-12`
- Change black card padding from `md:p-12` → `lg:p-12`

**3. Why Parents Trust (`WhyParentsTrustSection.tsx`)**
- Change grid from `md:grid-cols-[1fr_0.8fr]` → `lg:grid-cols-[1fr_0.8fr]` and `md:gap-16` → `lg:gap-16`

**4. How We Support Parents (`HowWeSupportParentsSection.tsx`)**
- Keep `sm:grid-cols-2` for the card grid (2 columns works fine on iPad)
- Keep `lg:grid-cols-3` for desktop — no change needed here

### Summary

| File | Change |
|---|---|
| `ForParentsHero.tsx` | All `md:` layout prefixes → `lg:` for the overlay layout |
| `DoesSoundFamiliarSection.tsx` | Grid breakpoint `md` → `lg` |
| `WhyParentsTrustSection.tsx` | Grid breakpoint `md` → `lg` |
| `RightPlaceSection.tsx` | Already fixed in last edit |
| `HowWeSupportParentsSection.tsx` | No change needed (2-col on tablet is fine for cards) |

On iPad, all two-column text+image sections will stack vertically for a clean, spacious layout. The card grid stays at 2 columns which works well at tablet width.

