

## Plan: Fix progress line & circle opacity consistency

**File**: `src/pages/StoryBuilders.tsx` (ScrollProgress component, lines 95–168)

### Changes

**1. Progress line — uniform opacity throughout**
- Background track: change `bg-primary/10` → `bg-primary/20` (line 98)
- Fill line: increase width from `2px` → `3px` for both track and fill
- Use a solid, consistent purple gradient with higher opacity

**2. Circle markers — start hidden, become 100% when reached and stay**
- Currently: unreached circles are `scale(0.6)` + `opacity: 0.4`, reached ones are `scale(1)` + `opacity: 1`
- Fix: All circles that have been reached (`i <= activeStep`) get full `opacity: 1` and `scale(1)` and **stay that way** (this part already works but the issue is the locked styling makes them look faded)
- Unreached circles: keep at `opacity: 0` (fully hidden) instead of `0.4`, so they pop in cleanly when reached
- When reached, all circles use the same solid purple styling regardless of completed/current/locked status: `w-[14px] h-[14px] bg-primary` with full opacity

**3. Card backgrounds — uniform opacity for all steps**
- Change the locked card gradient from `0.03/0.04` → `0.06/0.08` to match completed/current cards
- All cards look the same regardless of status

### Technical details
- Lines 125–137: Simplify circle rendering — if `reached`, show solid purple circle at full opacity; if not reached, render the circle at `opacity: 0`
- Lines 143–147: Use the same gradient values for all three states
- Lines 98, 101: Increase track/line width and opacity

