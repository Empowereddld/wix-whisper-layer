

## Plan: Sticky-scroll "Does This Sound Familiar?" section

Transform the section into a two-column layout with a **sticky image on the left** and **three animated text cards on the right** that transition as the user scrolls.

### Layout structure

```text
┌─────────────────────────────────────────────┐
│  ████ Does this sound familiar? ████        │  ← full-bleed black bar (unchanged)
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐   ┌────────────────────────┐  │
│  │          │   │  Card 1 (visible)      │  │
│  │  Photo   │   │  "Your child struggles │  │
│  │ (sticky) │   │   to follow..."        │  │
│  │          │   └────────────────────────┘  │
│  │          │   ┌────────────────────────┐  │
│  │          │   │  Card 2                │  │
│  │          │   │  "You're noticing..."  │  │
│  │          │   └────────────────────────┘  │
│  │          │   ┌────────────────────────┐  │
│  │          │   │  Card 3                │  │
│  │          │   │  "What if your child   │  │
│  │          │   │   has DLD..."          │  │
│  └──────────┘   └────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### How it works

1. **Left column**: Image (e.g. `mother-daughter-reading.png` or `family-reading.png`) wrapped in a `sticky top-[calc(50%-150px)]` container so it stays in view while the user scrolls through the cards.

2. **Right column**: Three card containers with generous vertical spacing (`min-h-[60vh]` each) so there's enough scroll distance to trigger each card's entrance animation.

3. **Card entrance animation**: Each card uses the existing `useScrollFadeIn` hook with staggered delays. As each card scrolls into the viewport, it fades in with the standard 16px vertical translate. Cards that haven't entered yet remain invisible.

4. **Content split across 3 cards**:
   - **Card 1**: "Your child struggles to follow directions..." (intro paragraph)
   - **Card 2**: "You're noticing:" + the bullet list
   - **Card 3**: "You've been told 'give it time'..." + "What if your child has DLD..." + "Understanding DLD changes everything"

5. **Mobile**: On small screens, the image sits above the cards (not sticky), and cards stack vertically with standard scroll-fade animations.

### File changes

**`src/components/DoesSoundFamiliarSection.tsx`** — Full rewrite:
- Import an image asset (likely `family-reading.png`)
- Import `useScrollFadeIn` hook
- Two-column grid (`lg:grid-cols-2`) below the black bar
- Left: sticky image with `lg:sticky lg:top-24` and `self-start`
- Right: three card `div`s, each with `bg-white rounded-lg p-6-8 shadow-sm`, minimum height for scroll room, and `useScrollFadeIn` for entrance animation
- On mobile (`< lg`): single column, image first, cards stacked normally

