

## Plan: Fix scroll progress line not reaching the end

**Problem**: The progress line stops short of the last step because the line percentage calculation caps based on a `trackEnd` value of `containerH - 24`, but the last step's circle center is higher than that. So `linePct` never reaches 100%.

**File**: `src/pages/StoryBuilders.tsx` (lines 76–88)

### Fix

Change the line percentage calculation so that when the last step is reached, the line extends fully to that step's position. The issue is that `trackEnd` is hardcoded to `containerH - 24` but the actual last circle might be at a different Y position.

Replace the linePct calculation (lines 76–88) so that:
- `trackEnd` is calculated from the **actual last step's circle position** instead of hardcoded `containerH - 24`
- When all steps are reached, the line extends fully to the last step's circle

Specifically:
```ts
// Calculate trackEnd from the actual last step position
const lastStep = stepRefs.current[stepRefs.current.length - 1];
const lastStepY = lastStep 
  ? lastStep.getBoundingClientRect().top + 12 - containerRect.top 
  : containerH - 24;
const trackStart = 24;
const trackEnd = lastStepY;
```

And update the CSS track `bottom` to match (change `bottom-[24px]` on the background track to align with the last step's actual position, or simply keep it as-is since the fill line will now reach the correct spot).

This ensures the animated fill line reaches the last circle marker exactly.

