

## Add "How It Works" Section After StatBand

Create a new dedicated `StoryBuildersHowItWorks` component that sits between the StatBand and the emotional hook section. The style should match the premium editorial aesthetic — clean, minimal, no images (since you only have 3 steps), using numbered cards on a light background.

### Recommended Layout

```text
┌─────────────────────────────────────────────────┐
│  Here's How StoryBuilders Works                 │
│  Simple enough for home. Powerful enough to     │
│  make a difference.                             │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │   01    │  │   02    │  │   03    │         │
│  │ Pick a  │  │  Read   │  │ Watch   │         │
│  │  Story  │  │Together │  │  Them   │         │
│  │         │  │         │  │  Grow   │         │
│  │ desc... │  │ desc... │  │ desc... │         │
│  └─────────┘  └─────────┘  └─────────┘         │
└─────────────────────────────────────────────────┘
```

### Style Details

- **Background**: `bg-muted` (light grey) to contrast against the dark StatBand above and white emotional hook below
- **Heading**: "Here's How StoryBuilders Works" — `text-[32px] md:text-[42px] lg:text-[46px] font-bold` centered
- **Subheading**: "Simple enough for home. Powerful enough to make a difference." — muted-foreground, centered, `max-w-[500px]`
- **3 cards in a row** (stacked on mobile): white background, rounded-xl, border, subtle shadow — each with:
  - Large step number in primary color (`text-[40px] font-black text-primary/20`)
  - Bold title
  - Description text in muted-foreground
- Uses the existing `FadeSection` wrapper for scroll animation
- Max-width `900px` centered, matching existing grid sections

### Files

1. **Create** `src/components/StoryBuildersHowItWorks.tsx` — New component with the layout above
2. **Edit** `src/pages/StoryBuilders.tsx` — Import and place it between `<StatBand />` and the emotional hook section (after line 166)

