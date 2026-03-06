

## Plan: Move image to the right of bullets at medium breakpoints

The "Why Schools Choose" section already has a two-column grid (`lg:grid-cols-[1fr_0.8fr]`), but it only activates at the `lg` (1024px) breakpoint. Since your preview panel is narrower than that, everything stacks vertically.

### Change
In `src/components/WhySchoolsChooseSection.tsx`, switch the grid breakpoint from `lg` to `md` so the side-by-side layout activates sooner (~768px):

- `grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16` → `grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-8 md:gap-16`
- Update the image max-height constraints to work well at the `md` breakpoint

This matches the portrait orientation of the photo and keeps the text + image side-by-side on most screens.

