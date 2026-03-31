

## Plan: Fill the image area with the photo

**Change**: In `src/pages/StoryBuilders.tsx`, update the image panel so the photo fills the entire grey area as a background/cover image instead of floating with padding and drop-shadow.

**File**: `src/pages/StoryBuilders.tsx` (lines 388-392)

1. Remove `p-6` padding from the image container div
2. Change the image to use `object-cover w-full h-full absolute inset-0` so it fills the entire grey area
3. Make the container `relative overflow-hidden` 
4. Remove the `drop-shadow` wrapper div since the image will fill edge-to-edge

