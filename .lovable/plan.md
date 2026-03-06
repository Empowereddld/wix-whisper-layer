

## Fix: Make "How We Support Parents" cards uniform height

The issue is that "Books and Resources" has a longer description, causing its card to be taller than the others. The cards already use `flex flex-col` and `min-h`, but the titles wrap to two lines for "Books and Resources" while others fit on one line.

### Changes to `src/components/HowWeSupportParentsSection.tsx`:

1. **Set a fixed minimum height on the title area** — Add `min-h-[60px] md:min-h-[72px]` to the `<h3>` element so all titles occupy the same vertical space regardless of wrapping
2. **Ensure the link is pushed to the bottom** — Add `mt-auto` to the link element so CTAs align at the bottom of each card, and remove the fixed `mt-6`

This keeps all cards visually aligned: titles at the same height, descriptions flowing naturally, and CTAs pinned to the bottom.

