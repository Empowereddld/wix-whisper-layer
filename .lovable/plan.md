

## Problem

The left girl's arm is being clipped on the left side of the hero image, especially at larger viewports. This happens because:
- The image uses `overflow-hidden` on its container
- At xl (1920px), the image is scaled to 1.02x and shifted left by 8%, pushing the left edge outside the visible container
- At lg (1366px), similar clipping occurs with 0.88x scale and 12% shift

## Solution

Reduce the scale and negative translate values so the full image (both girls' arms included) stays within the container bounds:

**File: `src/components/HeroSection.tsx` (line 25)**

Adjust the image scaling and positioning:
- **md**: Reduce scale from `0.64` to ~`0.60`, reduce translate from `16%` to ~`10%`
- **lg**: Reduce scale from `0.88` to ~`0.82`, reduce translate from `12%` to ~`6%`
- **xl**: Reduce scale from `1.02` to ~`0.94`, reduce translate from `8%` to ~`2%`

This keeps the "zoomed out" framing that shows both girls fully — matching the Wix reference — while preventing the left arm from being clipped by the overflow boundary.

