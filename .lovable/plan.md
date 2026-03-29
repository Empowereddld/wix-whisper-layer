

## Add Premium Promo Section Above "What Is Story Builders"

### What we're building

A new section placed between the Hook (S2) and the "What Is Story Builders" (S3) section. It replicates the Framer reference exactly:

```text
┌──────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────┐    │
│  │  (soft lavender rounded container, ~24px radius) │    │
│  │                                                  │    │
│  │  [pill badge]                                    │    │
│  │                                                  │    │
│  │  Large bold heading         │  Floating iPad     │    │
│  │  Lighter subtitle text      │  mockup with       │    │
│  │                             │  subtle shadow,    │    │
│  │  [Dark CTA Button]         │  slightly rotated  │    │
│  │                             │  or offset         │    │
│  │  ✓ trust point  ✓ trust    │                    │    │
│  │                             │                    │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Key design elements (matching the Framer reference exactly)

1. **Outer container** — White/transparent page background. Inner container has a soft lavender/purple background (`hsl(266, 100%, 97%)` or similar), generous `rounded-3xl` corners, large padding (`p-10 md:p-14 lg:p-16`)

2. **Left column:**
   - Small pill/badge at the top — rounded-full, small text, subtle border or light background (e.g. white/purple outline pill)
   - Large bold heading — site's standard bold/black weight, ~32-40px
   - Lighter subtitle paragraph — muted text color, smaller size
   - Dark CTA button — deep purple background, white text, rounded, generous padding
   - Row of small checkmark trust points below the button — inline, with check icons

3. **Right column:**
   - The iPad/app mockup image floating with a subtle drop shadow
   - Slightly overlapping the container edge or positioned to feel "elevated"
   - No background clutter — clean float

4. **Layout** — Two-column grid on desktop (`lg:grid-cols-2`), stacked on mobile (text first, image below)

### Content

- **Pill:** "Story Builders"
- **Heading:** "The first storytelling app designed for children with DLD."
- **Subtitle:** "20-minute guided sessions that build vocabulary, comprehension, and confidence — at home, in school, or during therapy."
- **CTA:** "Join the Launch Team" (scrolls to the signup form)
- **Trust points:** "Evidence-informed", "Built by SLPs", "Made for families"

### File changes

**`src/pages/StoryBuilders.tsx`** — Insert a new section between the Hook (line 252) and the `WhatIsStoryBuildersSection` (line 255). Uses the existing `storybuildersAppMockup` image import and `FadeSection` wrapper. No new files needed.

