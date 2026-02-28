

## Lower Hero Background Overlay Transparency

**What changes:** Reduce the white-lavender overlay opacity in the Hero Section from 0.88 to approximately 0.82, allowing more of the school hallway background image to show through while still keeping text readable.

### Technical Details

**File:** `src/components/HeroSection.tsx` (line 14)

- Change `bg-[hsl(270_60%_98%/0.88)]` to `bg-[hsl(270_60%_98%/0.82)]`

This is a single-line change that subtly reveals more of the background image.

