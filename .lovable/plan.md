

## Plan: Replace portrait image with landscape GIF in Library Intro section

### Changes to `src/components/DownloadablesLibraryIntro.tsx`

1. **Copy the GIF** to `src/assets/resource-library-preview.gif` and import it instead of `family-reading.png`
2. **Widen the container** from `max-w-6xl` (1152px) to `max-w-7xl` (1280px) to give the section more breathing room
3. **Switch from portrait to landscape aspect ratio** on the image: change `aspect-[4/5]` to `aspect-[4/3]` since the GIF is landscape-oriented
4. **Rebalance the grid** from 2/5 + 3/5 to an even 1/2 + 1/2 split (`md:grid-cols-2`) so the wider landscape image gets proper space

### Files
- **Copy** `user-uploads://Beige_and_Brown_Minimal_Elegant_Business_Ebook.gif` → `src/assets/resource-library-preview.gif`
- **Edit** `src/components/DownloadablesLibraryIntro.tsx` — update import, container width, grid split, and aspect ratio

