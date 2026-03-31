

## Plan: Split illustration into 3 card images for How It Works

**Goal**: Crop the uploaded illustration into 3 individual images (one per hand/step) and use them inside the existing How It Works cards, creating illustrated cards with soft lavender glows.

### Steps

**1. Prepare 3 cropped images**
- Crop the uploaded illustration into 3 separate images manually (left third, center third, right third):
  - `src/assets/how-it-works-step-1.png` — Hand holding phone with "Join" button
  - `src/assets/how-it-works-step-2.png` — Hand with phone showing people/invite
  - `src/assets/how-it-works-step-3.png` — Hand touching dashboard with heart

> Since we can't programmatically crop in plan mode, we'll copy the full image 3 times and use CSS `object-position` (left/center/right) to show the correct portion of each illustration within each card.

**2. Update the How It Works cards** (`src/pages/StoryBuilders.tsx`, lines 395-408)

Replace the simple numbered-circle cards with illustrated cards:
- Each card gets a tall image area at the top showing the relevant portion of the illustration
- Use the full image with `object-fit: cover` and `object-position: left/center/right` to isolate each hand
- Add a soft lavender radial glow behind each image (`bg-[radial-gradient(...)]`)
- Keep the lavender numbered circle below the image
- Keep the step label text below the number
- Cards remain in a 3-column grid on desktop, stack on mobile

### Card structure (per card)
```
┌─────────────────────┐
│                     │
│   [illustration]    │  ← cropped portion with lavender glow
│                     │
│        (1)          │  ← lavender circle with number
│                     │
│  Join the Launch    │  ← step label
│      Team           │
└─────────────────────┘
```

### Technical details
- Copy `user-uploads://ChatGPT_Image_Mar_31_2026_01_29_54_AM.png` → `src/assets/how-it-works-steps.png`
- Import as ES6 module in StoryBuilders.tsx
- Each card uses the same image source but different `object-position` values (17%/50%/83%) to show the correct third
- Image container: `h-[180px] overflow-hidden` with `bg-[radial-gradient(circle,hsl(266,80%,95%)_0%,transparent_70%)]` behind it
- Card: `bg-background rounded-xl border-none shadow-none p-0 overflow-hidden text-center`
- Section background remains `bg-muted`

