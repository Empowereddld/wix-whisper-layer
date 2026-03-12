

## Replace 3-kids-reading.png with WebP version

**What**: Save the uploaded `3_kids_reading.webp` as `src/assets/3-kids-reading.webp` and update the import in `BookShowcase.tsx` to use the WebP file instead of the PNG.

**Changes**:
1. Copy `user-uploads://3_kids_reading.webp` to `src/assets/3-kids-reading.webp`
2. Update `src/components/BookShowcase.tsx` import from `3-kids-reading.png` to `3-kids-reading.webp`

This removes one of the two remaining convertible PNGs on the homepage.

