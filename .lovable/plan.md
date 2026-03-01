

## Make Mobile Hero Match iPad Layout

**Goal**: Apply the same side-by-side layout (image left, text right) on mobile that currently works on iPad.

### Current Behavior
- **Mobile** (`< 768px`): Single column -- image stacked on top, text below
- **iPad/Tablet** (`md`+): Two columns -- image left (44%), text right (56%)

### Proposed Changes

**File: `src/components/HeroSection.tsx`**

Switch to a two-column grid at all screen sizes instead of only at `md`:

1. **Grid**: Change `grid-cols-1 md:grid-cols-[44%_56%]` to always be two columns, using a tighter split on small screens (e.g., `grid-cols-[38%_62%]`) and widening at `md` (`md:grid-cols-[44%_56%]`)
2. **Image container**: Remove the mobile-specific height (`h-[42vh]`) and use `h-[calc(100vh-70px)]` at all sizes so the image fills the section height. Remove `px-4` mobile padding so the image bleeds to the left edge like iPad.
3. **Image scaling**: Add a smaller base scale (e.g., `scale-[0.58]`) for mobile to fit both girls in the narrower column, keeping existing `md`/`lg`/`xl` scales. Set `origin-bottom-left` and a slight negative x-translate at base size.
4. **Text column**: Remove mobile-specific top padding (`pt-8 pb-12`) and use vertical centering (`py-0`) at all sizes since the text will now sit beside the image. Reduce mobile font sizes slightly if needed to fit the narrower column.
5. **Min-height**: Keep `min-h-[calc(100vh-70px)]` so the section fills the viewport on mobile.

This will make mobile look like a scaled-down version of the iPad layout with both girls on the left and the headline/CTA on the right.

