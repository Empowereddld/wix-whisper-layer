Standardize every resource thumbnail to a 16:9 ratio so the grid and detail views both use the same wide look.

### Standard
- **Target ratio:** 16:9
- **Target resolution:** 1920×1080 px (safe for retina); 1280×720 px minimum acceptable
- **Format:** PNG (high-res doc preview per project memory) or WebP export

### Code changes
1. `src/components/hub/ResourceCard.tsx`  
   - Replace the grid thumbnail `h-40` container with `aspect-video` so the card uses 16:9.
   - Keep `object-cover` and `rounded-t-xl`.

2. `src/components/hub/SampleGallery.tsx`  
   - Replace `aspect-[4/3]` with `aspect-video` so the detail page gallery matches the card ratio.
   - Keep `object-contain` for the main image and `object-cover` for the strip.

3. `src/components/hub/ResourceDetailModal.tsx`  
   - Replace the icon-only `h-56` placeholder with the actual thumbnail.
   - Use `aspect-video` for the preview container so the modal is also 16:9.

### Asset updates
- Regenerate/crop all existing thumbnails in the `thumbnails` bucket to 16:9.
- Re-upload to the same public bucket paths so existing `resources.thumbnail_url` values stay valid.

### Validation
- Spot-check grid and detail pages for a paid, free, poster, guide, and bundle resource.
- Confirm no layout shift or empty letterboxing on any resource.

### Notes
- This keeps the "wider look" the user prefers across both the library grid and the detail gallery.
- Future thumbnails should be uploaded at 1920×1080 px.