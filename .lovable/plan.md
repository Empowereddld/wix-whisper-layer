

## Replace "How It Works" Cards with Looping App Preview

Replace the current 3-card grid in `StoryBuildersHowItWorks` with a two-column layout featuring a headline on the left and an animated mock tablet screen on the right that loops through 3 steps.

### Layout

```text
┌──────────────────────────────────────────────────────┐
│  bg-muted                                            │
│                                                      │
│  ┌─────────────┐    ┌──────────────────────┐         │
│  │ How Story   │    │  ┌──────────────────┐ │        │
│  │ Builders    │    │  │  Mock App Screen  │ │        │
│  │ Works       │    │  │  (3-step loop)    │ │        │
│  │             │    │  │                   │ │        │
│  │ Simple,     │    │  │  Step 1: Stories  │ │        │
│  │ structured  │    │  │  Step 2: Reading  │ │        │
│  │ ...         │    │  │  Step 3: Progress │ │        │
│  └─────────────┘    │  └──────────────────┘ │        │
│                     └──────────────────────┘         │
│                      (tablet frame)                  │
└──────────────────────────────────────────────────────┘
```

On mobile: stacks vertically (headline on top, app preview below).

### Animated App Preview (3-step loop)

Uses React state + `setInterval` (2.5s per step) with CSS fade/slide transitions between steps:

**Step 1 — "Pick a Story"**: 2–3 story cards in a list, one highlighted with a purple border/ring. Simple thumbnails with titles like "Dan's Big Day", "The Park Adventure", "Daria's New Friend".

**Step 2 — "Read Together"**: Mock reading screen with a short paragraph of story text and a prompt bubble at the bottom ("What happened first?") styled as a soft purple pill.

**Step 3 — "Great Job!"**: Checkmark animation or progress circle, encouraging message "Great job! You completed today's story.", a simple progress bar showing "3 of 5 stories completed".

### Design Details

- **Tablet frame**: Rounded-2xl border with subtle shadow, bg-white interior, small top bar with status dots (like a real tablet). Aspect ratio ~3:4.
- **Transitions**: `transition-opacity duration-700 ease-in-out` for calm, smooth fades between steps.
- **Colors**: Brand purple for highlights and accents, warm coral for the prompt bubble, muted backgrounds.
- **Step indicator**: Small dots at the bottom of the frame showing which step is active.
- **Feel**: Clean, calm, supportive — like watching a real product demo.

### Files

1. **Rewrite** `src/components/StoryBuildersHowItWorks.tsx` — Replace card grid with two-column layout + animated mock app component. All self-contained in one file.

