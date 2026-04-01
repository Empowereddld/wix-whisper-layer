

## Plan: Replace lamp effect with a simple clean section

The purple lamp glow isn't working. Replace the entire `NotWholeStoryLamp` component with a simple, clean section that matches the rest of the page.

### Changes

**File: `src/components/NotWholeStoryLamp.tsx`**
- Remove the `LampContainer` import and usage
- Replace with a simple white-background section using standard `motion` fade-in animations
- Keep the heading "But this is not the whole story." and the three bullet points
- Style consistently with the rest of the About DLD page (clean, minimal)

No other files need to change — `AboutDLD.tsx` already imports this component.

