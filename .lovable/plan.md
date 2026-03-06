

## Plan: Move title above the two-column grid

Currently the title "Why Schools Choose Empowered DLD" is inside the left column alongside the bullets. Move it out so it spans the full width above the grid, leaving only the bullets and image side-by-side.

### Change in `src/components/WhySchoolsChooseSection.tsx`

- Move the `<h2>` element out of the left grid column and place it before the `<div className="grid ...">` wrapper
- The grid then contains only: left = bullet list, right = image

