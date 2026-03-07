

## Issues and Fix Plan

### Core Problem
The three resource images (`resource-podcast.png`, `resource-course.jpg`, `resource-downloadables.png`) were not designed for edge-to-edge card layouts. They have transparent backgrounds, inconsistent compositions, and baked-in text overlays -- unlike the Shop page images which are clean product shots.

### Issues Identified
1. **Podcast image** floats in whitespace -- transparent/white background doesn't blend with the grey card
2. **Downloadables image** has redundant text baked into it ("DOWNLOADABLE RESOURCES" header appears both in the image and in the card text)
3. **Inconsistent image compositions** across the three cards
4. **White gaps** visible where images don't fill the container

### Proposed Fix
Since we can't change the source images, we can improve the card layout to work better with imperfect images:

1. **Add a background color to the image container** -- Use `bg-white` or `bg-muted` on the `aspect-[4/3]` wrapper so transparent image areas have a clean backdrop instead of showing through to the card
2. **Add subtle inner padding to the image area** -- Give images like the podcast screenshot some breathing room with `p-4` so they look intentionally framed rather than awkwardly floating
3. **Optionally adjust aspect ratio** -- Use `aspect-[16/10]` or similar to crop the images tighter and reduce empty space

Changes would be in `src/components/BrowseByTypeSection.tsx` only -- updating the image container div styling.

