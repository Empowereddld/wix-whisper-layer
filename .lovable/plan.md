

## Tighten the "What's Inside" Featured Resources section

**File:** `src/components/InsideDLDResourceHub.tsx`

### Changes

1. **Reduce image container height** -- from `h-[28rem]` (448px) to `h-72` (288px) on mobile, keeping taller on desktop via `md:h-[24rem]`
2. **Reduce inner card padding** -- from `py-8 md:py-10 lg:py-12` to `py-6 md:py-8`
3. **Remove carousel wrapper vertical padding** -- from `py-4` to `py-0`
4. **Reduce grid gap** -- from `gap-8 md:gap-14` to `gap-4 md:gap-10`
5. **Reduce heading bottom margin label spacing** -- from `mb-3` to `mb-2` on the "FEATURED RESOURCES" label
6. **Reduce text content gap** -- from `gap-6` to `gap-4` in the text column
7. **Reduce description top margin** -- from `mt-6` to `mt-3`
8. **Reduce section bottom padding** -- from `pb-16 md:pb-20 lg:pb-24` to `pb-10 md:pb-14 lg:pb-16`

These changes collectively cut ~100-150px of vertical space across both mobile and desktop views.

