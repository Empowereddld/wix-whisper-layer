

## Plan: Make Quick Links and Useful Links side-by-side on mobile

The footer currently uses `grid-cols-1 sm:grid-cols-2` which already puts items in 2 columns at `sm` (640px), but on narrow mobile screens (<640px) everything stacks vertically, making the footer very long.

### Change

In `src/components/Footer.tsx`, change the grid from `grid-cols-1 sm:grid-cols-2` to `grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]` so that Quick Links and Useful Links sit side-by-side even on the smallest screens. The Brand section and Contact section will each span 2 columns on mobile (`col-span-2`) to remain full-width, while the two link columns naturally fill the 2-column grid.

### Details

- **Brand div**: Add `col-span-2 lg:col-span-1` so it spans full width on mobile
- **Contact div**: Add `col-span-2 lg:col-span-1` so it spans full width on mobile
- **Quick Links & Useful Links**: No changes needed — they'll each take one column naturally

This keeps the 4-column desktop layout intact while significantly shortening the mobile footer.

