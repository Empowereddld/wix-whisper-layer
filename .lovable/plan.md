
## Move Title Above Image in Left Column & Shorten Image

### Changes to `src/components/OrganizationsAwarenessSection.tsx`:

1. **Move the `h2` title from the right column into the left column**, placed above the image (visible on tablet/desktop). The left column becomes: title → image.

2. **Shorten the image on tablet** — remove `md:items-stretch` / `md:h-full` so the image no longer stretches to match the full text column height. Instead, give it a constrained height (e.g., `md:max-h-[400px]`) with `object-cover` and `object-bottom` to show the bottom portion cropped naturally.

3. **Left column structure on tablet**: Switch from `md:flex` to a simple block layout — title on top, image below, both left-aligned. The image container gets a fixed max-height so it's visibly shorter than the text column.

4. **Desktop (lg)**: Title stays above the layered image composition. The layered cards remain unchanged.
