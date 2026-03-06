

## Add Dot Background to Resource Library CTA

The pasted component is an Aceternity-style dot background pattern. The project already has the correct setup (shadcn/ui, Tailwind CSS, TypeScript, components in `/components/ui`). Note: the project uses Tailwind v3, not v4 — but the component is simple CSS and works fine with v3.

The component as pasted has empty className strings (the JSX was stripped). I'll reconstruct it from the standard Aceternity dot-background pattern and apply it to the CTA card.

### Plan

**1. Create `src/components/ui/dot-background.tsx`** — a reusable dot background wrapper using the standard Aceternity pattern:
- Dark background with a repeating dot pattern via `bg-[radial-gradient]`
- Radial fade mask so dots fade toward the edges

**2. Update `src/components/ResourceLibraryCTA.tsx`** — add the dot pattern as a decorative layer behind the CTA card content:
- Add `relative overflow-hidden` to the black card
- Place the dot pattern as an absolute-positioned layer inside the card
- Keep all existing text and button content unchanged on top via `relative z-10`

This gives the CTA a subtle textured background while keeping the clean, high-end feel.

