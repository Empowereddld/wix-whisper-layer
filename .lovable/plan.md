

## Vertically Center Hero Content on StoryBuilders Page

The hero text and form currently use top padding (`py-20 md:py-28 lg:py-32`) to push content down, but since the section is full viewport height, this leaves an awkward empty gap below the form fields. The fix is to vertically center the content within the hero.

### Changes (single file: `src/pages/StoryBuilders.tsx`)

1. **Vertically center the content container** — Change the inner content `div` (line 110) from top-padded layout to a flex centered layout:
   - Remove `py-20 md:py-28 lg:py-32`
   - Add `min-h-[600px] md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] justify-center`
   - Keep horizontal padding and `items-start` for left-aligned text

This ensures the text block + form sit in the vertical middle of the hero image rather than floating near the top.

