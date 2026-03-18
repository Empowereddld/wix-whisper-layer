

## Plan: Zoom out the image in "Is This Right" section

The image currently uses `object-cover` which crops tightly into the center of the photo, cutting off the reading activity. To "zoom out" while keeping the same frame size, we can use CSS `object-fit: contain` instead — but that would leave empty space.

A better approach: keep `object-cover` but use `object-position` to show more of the image, combined with scaling. Specifically:

### Change in `src/components/IsThisRightSection.tsx` (line 16)

On the `<img>` element, add a CSS `scale` transform to shrink the image within its container, effectively zooming out while the container stays the same size. We'll use Tailwind's `scale-[0.85]` (or similar) combined with `object-contain` to ensure the full image is visible:

- Change `object-cover` → `object-contain` so the entire image is visible without cropping
- Add `object-center` to keep it centered
- The container with `rounded-xl overflow-hidden` maintains the same frame size and shape

This shows the full scene (people reading) within the exact same container dimensions.

