

## Plan: Stack Founders Photo Above Boy Reading in Same Column

**Goal:** Move the founders photo into the same column as the boy reading image (column 3), stacking founders on top. This frees columns 1–2 for the text to span wider.

### Changes to `src/components/TrustSection.tsx`

**Desktop (lg) layout:** `lg:grid-cols-[2fr_1fr]`
- **Column 1 (wide):** All text content — heading, paragraphs, indented blocks, final paragraph, CTA button
- **Column 2:** Founders photo on top, boy reading below, in a single `flex flex-col gap-4` container

```text
┌──────────────────────────────────────────┐  ┌──────────────┐
│  WHY EMPOWERED DLD?                      │  │ Founders     │
│  Changing how the world understands DLD  │  │ photo        │
│                                          │  ├──────────────┤
│  All paragraphs spanning wide            │  │ Boy reading  │
│  "Children need..." block                │  │ photo        │
│  "Adults need..." block                  │  │              │
│  Final paragraph                         │  │              │
│  [FIND WHAT WORKS FOR YOU]               │  │              │
└──────────────────────────────────────────┘  └──────────────┘
```

**Specific edits:**
1. Change grid from `lg:grid-cols-[1fr_1fr_1fr]` to `lg:grid-cols-[2fr_1fr]`
2. Remove `max-w-[420px]` from heading and paragraphs so text uses the wider column
3. Remove the standalone founders photo column (the one with `md:hidden lg:flex`)
4. Combine founders photo and boy reading into one column: founders on top (rounded, ~200px), boy reading below (fills remaining height)
5. Update tablet (md) layout to stack both images in the sidebar column
6. Mobile stays single-column stacked

