

## Plan: Constrain image size across breakpoints

The issue: with `items-stretch` and `h-full object-cover`, the image grows unconstrained — too tall on desktop (laptop) and too large on mobile where it stacks.

### Changes in `src/components/WhySchoolsChooseSection.tsx`

1. **Grid**: Change `items-stretch` to `items-start` so the image doesn't stretch to fill the full bullet-list height
2. **Image wrapper**: Add `max-h-[300px] md:max-h-[400px] lg:max-h-[500px]` to cap image height at each breakpoint
3. **Mobile**: On mobile (stacked), limit the image width with `max-w-sm mx-auto` so it doesn't fill the full screen width
4. **Keep** `rounded-lg overflow-hidden min-w-0` and `object-cover` for proper cropping and rounded corners

This gives a well-proportioned image at every screen size: compact on mobile, medium on tablet, reasonably sized on desktop.

