

## Plan: DLD Community Video Carousel

Add a vertical video carousel section below the "But this is not the whole story" section on the About DLD page. It will display YouTube Shorts from the playlist as vertical thumbnail cards in a horizontal scrollable carousel, with a lightbox for playback.

### Design

- **Width**: Same as the NotWholeStoryLamp card (`max-w-[720px]`)
- **Background**: White (`bg-background`), same section padding as other sections
- **Title**: "One thing I want the world to know about DLD..." in the standard section heading style (font-black, ~36-46px)
- **Subheading**: "Hear from our community" in muted text below
- **Cards**: Vertical (9:16 aspect ratio) rounded containers showing YouTube thumbnails with a centered play icon overlay
- **Carousel**: Horizontal scroll showing ~3 cards on desktop, ~1.5 on mobile, with left/right arrow buttons
- **Lightbox**: Clicking a card opens a dark overlay modal with the YouTube video embedded via iframe. Close on X button or clicking outside.

### Video IDs

Since the playlist page couldn't be fully scraped, I'll hardcode the 2 video IDs found (`h6GTa--EOgM`, `SjE9lRZIgQI`) and use the YouTube playlist embed for the remaining videos. **Alternatively**, I'll embed each video using the playlist parameter so that clicking any thumbnail opens that video within the full playlist context. I'll structure the data array so you can easily add more video IDs later.

### Files to create/modify

1. **New file: `src/components/DLDCommunityVideoCarousel.tsx`**
   - Array of video objects with YouTube IDs and optional titles
   - Horizontal carousel of vertical thumbnail cards (using YouTube thumbnail URLs)
   - Play icon overlay on each card (Lucide `Play` icon in a semi-transparent circle)
   - Lightbox modal (Dialog component) with YouTube iframe embed
   - Left/right navigation arrows

2. **Edit: `src/pages/AboutDLD.tsx`**
   - Import and add `DLDCommunityVideoCarousel` after `NotWholeStoryLamp`

### Technical details
- Thumbnails via `https://img.youtube.com/vi/{id}/0.jpg`
- Lightbox uses the existing shadcn Dialog component
- Carousel built with CSS scroll-snap or the existing Embla carousel
- Video IDs stored as a simple array — easy to update when more are available

