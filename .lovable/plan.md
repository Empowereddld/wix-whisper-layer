

## Redesign: "You're in the right place if..." section

Great instinct — the current layout feels a bit generic with a standard 50/50 grid. Here's my recommendation:

**Pull the title out above both columns so it spans the full width.** This is the stronger creative choice because:
- The headline becomes a bold, full-width statement that commands attention
- The two columns below (image + bullet list) feel like supporting content under a clear declaration
- It creates a visual hierarchy similar to premium editorial layouts
- The image can then stretch taller to match the bullet list without competing with the title

### Layout change (single file: `src/components/RightPlaceSection.tsx`)

**Before:**
```text
┌──────────────────────────────────────────┐
│  [IMAGE]        │  You're in the right   │
│                 │  place if...           │
│                 │  • bullet              │
│                 │  • bullet              │
│                 │  [BUTTON]              │
└──────────────────────────────────────────┘
```

**After:**
```text
┌──────────────────────────────────────────┐
│  You're in the right place if...         │
│                                          │
│  [IMAGE]        │  you're a parent who:  │
│  (fills height) │  • bullet              │
│                 │  • bullet              │
│                 │  [BUTTON]              │
└──────────────────────────────────────────┘
```

### Specific changes:
1. **Move the `<h2>` title outside the grid**, placing it above as a full-width element with `mb-8 md:mb-10`
2. **Remove `max-w-[650px]`** from the text column since the grid already constrains it
3. **Add `items-stretch`** to the grid so the image fills the full height of the text column
4. **Set `lg:h-full`** on the image so it stretches to match on desktop
5. Keep mobile layout unchanged — title still stacks above content naturally

This is a clean, high-impact change that makes the section feel more intentional and editorial.

