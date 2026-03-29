

## Redesign "What Is StoryBuilders" as a Scroll-Animated Two-Column Section

### What we're building

A new version of the "What Is StoryBuilders" section (S3) that:

1. **Two-column layout** — Text/description on the left, app mockup image on the right
2. **Scroll-driven tilt animation** — The iPad mockup image starts tilted (perspective/rotated) and gradually stands upright as the user scrolls through the section, matching the effect from the screen recording
3. Title: "What Is Story Builders"

### Layout

```text
┌──────────────────────────────────────────────┐
│           What Is Story Builders             │
├──────────────────┬───────────────────────────┤
│                  │                           │
│  Description     │   iPad mockup image       │
│  + check list    │   (tilted → upright       │
│  + closing line  │    on scroll)             │
│                  │                           │
└──────────────────┴───────────────────────────┘
```

On mobile: stacks vertically (text first, then image below).

### Scroll animation approach

- Use a `useRef` + `useEffect` with a scroll event listener (or IntersectionObserver with threshold steps) to calculate how far the section is scrolled into view
- Map scroll progress (0 to 1) to a CSS `transform: perspective(1000px) rotateY(Xdeg) rotateX(Ydeg)` that goes from tilted (~15-20deg) to 0deg (upright)
- Apply via inline style for smooth, frame-by-frame updates
- CSS `will-change: transform` for performance

### Files changed

1. **Copy uploaded mockup image** — `user-uploads://ChatGPT_Image_Mar_28_2026_09_31_53_PM.png` to `src/assets/storybuilders-app-mockup.png`
2. **`src/pages/StoryBuilders.tsx`** — Rewrite the S3 section:
   - Two-column grid (`lg:grid-cols-2`)
   - Left column: title, intro text, checklist, closing paragraph (keep existing copy)
   - Right column: mockup image with scroll-driven tilt-to-upright animation
   - Add scroll progress calculation logic (ref + scroll listener)
3. **Keep** all existing content/copy from the current section

### Technical details

- Scroll progress calculated as: how far the section's top has passed the viewport center, clamped 0-1
- Transform interpolation: `rotateY(${15 * (1 - progress)}deg) rotateX(${8 * (1 - progress)}deg)`
- Smooth transition with `will-change: transform` and no CSS transition (direct scroll-linked)
- The image import uses `@/assets/storybuilders-app-mockup.png`

