

## New CTA Section: Masonry Images + Text (Aceternity-inspired)

This will be a new component added to the ForParents page, placed before the Footer. The layout replicates the Aceternity "cta-with-masonry-images" pattern: left side has text + CTA button, right side has a masonry grid of portrait resource images.

### Layout

```text
┌──────────────────────────────────────────────────┐
│  bg-black, full-width                            │
│                                                  │
│  ┌─────────────────┐  ┌──────────────────────┐   │
│  │ Access the       │  │  col1    col2   col3 │   │
│  │ Empowered DLD    │  │  ┌──┐   ┌──┐   ┌──┐ │   │
│  │ Resource Library  │  │  │24│   │26│   │28│ │   │
│  │                  │  │  └──┘   └──┘   └──┘ │   │
│  │ body text...     │  │  ┌──┐   ┌──┐        │   │
│  │                  │  │  │25│   │27│        │   │
│  │ [Get Free Access]│  │  └──┘   └──┘        │   │
│  └─────────────────┘  └──────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### New Component: `src/components/ResourceLibraryCTA.tsx`

- **Background**: `bg-black text-white` full-bleed section
- **Left column (~40%)**: Heading, description, sub-line, and purple CTA button linking to `/hub/preview`
- **Right column (~60%)**: 3-column masonry grid with the 7 uploaded portrait images, rounded corners, varying heights for visual interest, with a subtle top/bottom gradient fade like Aceternity
- **Mobile**: Stacks vertically — text first, then a 2-column masonry grid
- **Copy**: Exact text the user provided

### Images
Copy all 7 uploaded images (24.png through 30.png) to `src/assets/` as resource preview thumbnails. Import them as ES6 modules.

### Page Integration
Add the new `ResourceLibraryCTA` component to `ForParents.tsx` between `RightPlaceSection` and `Footer`.

### Files to create/modify:
1. **Create** `src/components/ResourceLibraryCTA.tsx` — new CTA component
2. **Modify** `src/pages/ForParents.tsx` — import and add the component
3. **Copy** 7 images to `src/assets/`

