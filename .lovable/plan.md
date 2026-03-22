

## Readability Tweaks for StoryBuilders Hero

Two small changes to improve text legibility on mobile:

1. **Increase subheadline opacity** — Change `text-white/80` to `text-white/90` on line 117
2. **Add text shadow** — Add a subtle text shadow to the headline (line 114) and subheadline (line 117) using inline style or a Tailwind utility class like `[text-shadow:0_1px_8px_rgba(0,0,0,0.5)]`

### Files to edit
- `src/pages/StoryBuilders.tsx` — lines 114 and 117

