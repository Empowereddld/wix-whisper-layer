

## Improve StatBand Layout

The section currently feels sparse — the heading sits far left and the bullets float far right with a big gap in between, making the whole band feel disconnected and overly tall.

### Proposed changes (all in `src/components/StatBand.tsx`)

1. **Constrain the inner width** — Wrap content in a narrower max-width container (~`max-w-5xl`) so the two columns sit closer together instead of spanning the full container width
2. **Add a subtle left accent border** on the right-side content block — a thin `border-l-2 border-background/20 pl-8` creates a visual divider connecting the two halves
3. **Reduce the right column gap** between the two bullet groups from `gap-5` to `gap-4`
4. **Add more vertical padding on mobile** — bump mobile from `py-10` to `py-12` so it doesn't feel cramped on small screens while keeping desktop at `py-12`
5. **Close the closing line** — Make "And still wondering where to start." italic and slightly larger (`text-[15px] md:text-[19px] italic`) to act as a soft emotional closer

### Visual result
```text
┌──────────────────────────────────────────────────┐
│  You can see your    │  They may have trouble:   │
│  child struggling    │  · following stories      │
│  with language...    │  · answering questions    │
│                      │  · explaining school      │
│                      │                           │
│                      │  You might be:            │
│                      │  · waiting for therapy    │
│                      │  · supporting sessions    │
│                      │                           │
│                      │  And still wondering...   │
└──────────────────────────────────────────────────┘
```

The accent border and tighter max-width will make the layout feel intentional and connected rather than two disconnected pieces floating apart.

### Files to edit
- `src/components/StatBand.tsx`

