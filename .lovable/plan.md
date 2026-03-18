

## Fix: Zoom out hero girls image on desktop

The right girl's shoulder is getting cut off because the image scales large and shifts left, causing the right edge to crop.

### Change in `src/components/HeroSection.tsx` (line 25)

Reduce the scale values slightly and shift the image further left to reveal more of the right side:

- `scale-[0.68]` → `scale-[0.64]` (md)
- `lg:scale-[0.93]` → `lg:scale-[0.88]` 
- `xl:scale-[1.08]` → `xl:scale-[1.02]`
- Adjust translate-x values to shift slightly more left: `-translate-x-[14%]` → `-translate-x-[16%]`, `lg:-translate-x-[12%]`, `xl:-translate-x-[8%]`

This zooms out ~5% at each breakpoint so both girls' shoulders are fully visible.

