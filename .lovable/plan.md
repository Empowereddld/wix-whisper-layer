

## Problem

The carousel images are portrait-oriented resource previews (tall PDFs/posters), but the image container is set to `h-80` (320px) with `object-cover`, which crops them badly. The layout also creates excessive empty space below the text content because `justify-between` spreads the short text and arrows across the full column height.

## Fix in `src/components/InsideDLDResourceHub.tsx`

1. **Increase image container height** from `h-80` to `h-[28rem]` (448px) to better fit portrait resource images
2. **Change `object-cover` to `object-contain`** on the `<img>` so images display fully without cropping
3. **Change text column** from `justify-between` to `justify-center gap-6` so the text and arrows cluster together instead of spreading apart
4. **Reduce bottom padding** on the outer wrapper from `py-12 md:py-16 lg:py-20` to `py-10 md:py-12 lg:py-16`

### Files
- **Edit** `src/components/InsideDLDResourceHub.tsx`

