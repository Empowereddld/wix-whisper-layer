

## Plan: Add "Lamp" transition section after Reality of DLD

**Goal**: Add a visually striking lamp-glow section between `RealityOfDLDSection` and `DLDFaqSection` on the About DLD page, displaying the text **"But this is not the whole story."**

### 1. Create `src/components/ui/lamp.tsx`
- Build the `LampContainer` component using `motion` (already installed as `motion` v12)
- Animated gradient glow effect with conic gradients and expanding width
- Dark background (`bg-foreground` / near-black to match site theme) with purple/brand-colored lamp glow

### 2. Create `src/components/NotWholeStoryLamp.tsx`
- Uses `LampContainer` to wrap the heading text
- Text: **"But this is not the whole story."**
- Animated text fade-up using `motion`
- Styled to match site typography (bold, large heading)

### 3. Update `src/pages/AboutDLD.tsx`
- Import `NotWholeStoryLamp`
- Place it between `<RealityOfDLDSection />` and `<DLDFaqSection />`

### Files changed
| File | Action |
|------|--------|
| `src/components/ui/lamp.tsx` | Create — LampContainer animation component |
| `src/components/NotWholeStoryLamp.tsx` | Create — section with lamp + text |
| `src/pages/AboutDLD.tsx` | Edit — add new section between Reality and FAQ |

### Technical notes
- Uses `motion` package (already in dependencies) via `import { motion } from "motion/react"`
- The lamp glow will use the site's purple accent color (`#7c3aed` / brand purple) for the conic gradient
- No new dependencies needed

