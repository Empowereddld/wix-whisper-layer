

## Crop SLP Icon — Remove "For SLP's" Text

The therapist/clinician icon (`icon-slps.png`) has "For SLP's" text baked into the image that the other three icons don't have. The fix is to crop it out and match the sizing of the other icons.

### Approach

1. **Use AI image editing** (Gemini flash image model) via a backend function to:
   - Take the current `icon-slps.png` as input
   - Remove/crop out the "For SLP's" text at the bottom
   - Output a clean icon matching the style of the other three (just the illustration, no text)
   - Save as `icon-slps.webp` in `src/assets/`

2. **Update import** in `ChoosePathSection.tsx`:
   - Change `import iconSlps from "@/assets/icon-slps.png"` → `import iconSlps from "@/assets/icon-slps.webp"`

### Alternative (simpler)
Since the icon images are displayed at 108x108px with `object-contain`, we can crop the image using CSS by switching to `object-cover` with `object-top` positioning to cut off the bottom text. However, this is fragile — a proper image crop is cleaner.

### Recommendation
Use the AI image model to regenerate a clean version of the SLP icon without the text, matching the purple line-art style of the other icons. This gives us a proper asset rather than a CSS hack.

