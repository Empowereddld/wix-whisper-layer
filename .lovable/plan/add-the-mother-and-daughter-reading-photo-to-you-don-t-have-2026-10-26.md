# Add the mother-and-daughter reading photo to "You don't have to explain everything"

On the Parent Guidebook page only, the section under the black bar gets a photo beside the text.

## Changes
1. Desktop: paragraphs stay on the left (same wording, size and colours); the mother-and-daughter reading photo sits on the right, filling the empty gray space, with rounded corners.
2. Phone and tablet: the photo appears under the paragraphs at full width, not cramped.
3. The black bar heading, gray background and spacing stay as they are now.

The For Parents page, its hero, checkout and every other guidebook section stay unchanged. Checked on desktop and phone, not published.

## Technical details
- In `src/pages/ParentGuidebook.tsx`, wrap the existing `max-w-[650px]` text block and a new image in `flex flex-col lg:flex-row gap-10 lg:gap-16 items-center`.
- Import the existing `@/assets/mother-daughter-reading.webp`; `img` with `w-full lg:w-[40%] rounded-xl object-cover max-h-[500px]`, `loading="lazy"`, descriptive alt text.
- No new files or assets.
