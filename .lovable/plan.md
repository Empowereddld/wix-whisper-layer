
Root cause:
- The faint look is coming from the new `ScrollProgress` locked-state styling in `src/pages/StoryBuilders.tsx` (not a rendering bug).
- Locked items are still intentionally dimmed via:
  - lighter text colors (`locked ? ...` on task/impact/reward text)
  - lower-opacity reward gradients (`0.04/0.06`)
  - softer locked shadows
  - marker opacity fallback (`opacity: 0.4`) for unreached points

Plan to fix:
1. Remove locked dimming from text
- In `ScrollProgress`, replace all `locked ? ... : ...` color branches for:
  - task text
  - impact text
  - reward title
  - reward description
- Use one consistent readable color set so cards/text stay fully visible.

2. Make reward card surface equally strong for all steps
- Use a single base gradient + base elevation for locked/completed/current so cards are never washed out.
- Keep “current” differentiation via glow/ring/scale only (not opacity reduction).

3. Keep progression cues without fading content
- Keep timeline progression behavior and pulse-on-reach.
- If needed, keep unreached marker distinction using size/ring/border instead of low opacity.

4. Verify visually across the whole section
- Scroll top-to-bottom and confirm steps 3–5 are no longer faint.
- Confirm line/markers/cards maintain consistent visual strength at every scroll position.

File to update:
- `src/pages/StoryBuilders.tsx` (ScrollProgress component only).
