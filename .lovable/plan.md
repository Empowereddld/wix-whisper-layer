

## Plan: Redesign "Why Join the Launch Team" section

**Scope**: Replace the existing 3-icon-card grid (lines 405-429) with a photo-card bento layout matching the Framer consulting reference.

### Files changed

**1. Copy 3 uploaded images to `src/assets/`**
- `user-uploads://Gemini_Generated_Image_cpfh9lcpfh9lcpfh.png` → `src/assets/storybuilders-movement.png` (group of adults)
- `user-uploads://ChatGPT_Image_Mar_30_2026_11_11_46_PM.png` → `src/assets/storybuilders-awareness.png` (three women)
- `user-uploads://Gemini_Generated_Image_qgxn8rqgxn8rqgxn.png` → `src/assets/storybuilders-understood.png` (girl with tablet)

**2. `src/pages/StoryBuilders.tsx` (lines 405-429)**

Replace the entire section with:

- **Header row**: Two-column flex layout
  - Left: `WHY JOIN` small-caps label + `Every child deserves to tell their story.` headline (font-black, ~46px, max-w-[500px])
  - Right: Supporting text right-aligned, muted, max-w-[400px]

- **Card grid**: `grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4` with `min-h-[560px]`
  - Left column: One tall card (full height)
  - Right column: Two stacked cards (`grid grid-rows-2 gap-4`)

- **Each card**: `relative overflow-hidden rounded-xl group cursor-pointer`
  - Full-bleed `object-cover` image
  - Bottom gradient overlay (`bg-gradient-to-t from-black/70 via-black/20 to-transparent`)
  - On hover: overlay darkens (`group-hover:from-black/80`), hover text fades in (`opacity-0 group-hover:opacity-100 transition-opacity duration-300`)
  - Label: white, font-semibold, bottom-left
  - Hover text: white/80, text-sm, max-w-[280px], appears below label

- Section styling: `py-16 md:py-[120px]`, white background, container `max-w-[1100px] mx-auto px-6 md:px-8`

- Remove Megaphone/Wrench/Heart icon imports if no longer used elsewhere.

### Card data

| Card | Position | Label | Hover text |
|------|----------|-------|------------|
| 1 | Left (tall) | Be a part of the movement | Some people talk about change. You just helped create it. |
| 2 | Top right | Spread awareness of DLD | Most people have never heard of DLD. Every person you invite is one more who will. |
| 3 | Bottom right | Help more children feel understood | When more families find StoryBuilders, more children get a tool built specifically for how they think and communicate. |

