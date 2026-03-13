

## Change Hub Preview Hero to Match Homepage Style

Replace the solid `bg-deep-purple` hero with the homepage's 3-layer approach: blurred school hallway background image + white-lavender gradient overlay + content on top.

### Changes to `src/pages/hub/HubPreview.tsx`

**1. Add hallway background import:**
```typescript
import hallwayBg from "@/assets/school-hallway-bg.webp";
```

**2. Replace the hero section (lines 132-155)** with the homepage-style layered approach:
- Layer 1: Blurred hallway background (`blur-[2px] scale-105`)
- Layer 2: White-lavender gradient overlay (same `from-[hsl(270_55%_98%/0.78)] via-[hsl(264_48%_96%/0.72)] to-[hsl(258_42%_94%/0.66)]`)
- Layer 3: Content centered (same text but with dark foreground colors instead of white, matching the homepage aesthetic)

**3. Update text colors** for the light background:
- Eyebrow: `text-primary/85` (purple tint)
- Headline: `text-foreground` (dark)
- Subheadline: `text-foreground/55`
- Trust line: `text-foreground/40`
- Button: `bg-deep-purple text-white` (inverted from current)
- Small text: `text-foreground/35`

### File changed
- `src/pages/hub/HubPreview.tsx`

