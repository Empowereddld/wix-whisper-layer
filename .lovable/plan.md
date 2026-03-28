

## Restyle Hook Section to Match Framer Reference

### What changes

**File: `src/pages/StoryBuilders.tsx`** — Rewrite the Hook section (lines 148–163):

1. **One flowing paragraph** — Merge all three `<p>` tags into a single paragraph so the text reads as one continuous statement with inline highlighted phrases, not stacked separate lines.

2. **Background** — Replace solid `bg-lavender` with a white/near-white top fading to lavender at the bottom using a CSS gradient: `bg-gradient-to-b from-white to-lavender`.

3. **Inline highlights** — "Words get stuck.", "Details get lost.", and "confidence starts to fade." stay `text-primary font-medium` but flow inline within the sentence (no `<br />` tags).

4. **Final sentence** — "Story Builders was created to change that." remains bold/dark purple but is part of the same text block (separated by spacing, not a new section).

5. **Keep** existing typography sizes, padding, and `FadeSection` wrapper.

