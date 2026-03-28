

## Restyle Hook Section to Match Framer Reference

The Framer reference shows a large, centered statement-style section with generous vertical padding, large serif-like typography, and key phrases highlighted in a contrasting color. You want this same design but with a light purple (lavender) background and darker purple for the highlighted text, using the site's existing DM Sans typography.

### What changes

**File: `src/pages/StoryBuilders.tsx`** — Rewrite the Hook section (lines 148–163):

- **Background**: Light purple using the existing `bg-[hsl(266,100%,97%)]` (Lavender from the site palette)
- **Typography**: Large centered text, scaled up significantly (~28px mobile / ~38px desktop), with generous line-height — matching the Framer reference's "statement" feel, but keeping DM Sans
- **Highlighted phrases**: "Words get stuck", "Details get lost", and "confidence starts to fade" rendered in the site's primary purple `text-primary` (hsl 258, 50%, 50%)
- **Final line**: "StoryBuilders was created to change that." in darker purple, bold
- **Spacing**: Generous vertical padding (~160–200px) to create the spacious, centered feel from the reference
- **Layout**: Single centered block, max-width ~900px for the larger text to breathe properly

No new files or components needed. One section rewrite in StoryBuilders.tsx.

