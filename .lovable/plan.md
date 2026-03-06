

## Replace ResourceLibraryCTA with Clean Card-Style CTA

Replace the current masonry-image CTA with a minimal, high-end card CTA matching the reference screenshot, adapted to the Empowered DLD brand.

### Design

```text
┌─────────────────────────────────────────────────────────┐
│  bg-muted section (light gray page background)          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  bg-black rounded-2xl card                        │  │
│  │                                                   │  │
│  │  RESOURCE LIBRARY          (small uppercase label) │  │
│  │                                                   │  │
│  │  Access the Empowered DLD    [Get Free Access]    │  │
│  │  Resource Library             (purple filled btn) │  │
│  │                                                   │  │
│  │  Guides, posters, and tools...                    │  │
│  │  All free. All in one place.                      │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Changes — single file: `src/components/ResourceLibraryCTA.tsx`

- Remove all image imports and masonry grid
- Render a `bg-muted` section with a centered `bg-black rounded-2xl` card inside the container
- Left side: uppercase label, heading (DM Sans font-black, matching site style), description, sub-line
- Right side or inline: purple "Get Free Access" button (primary color, rounded-full)
- Layout: flex-row on desktop (text left, button right-center), stacked on mobile
- Keep the existing copy and link to `/hub/preview`
- Use the same font styles as the rest of the page (DM Sans, font-black headings, text sizes consistent with other sections)

