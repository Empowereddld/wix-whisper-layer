

## Plan: White background lamp section

The lamp effect uses `bg-foreground` (dark/black) in ~8 places as the base that masks and blends with the purple glow. Switching to white means:

### Changes in `src/components/ui/lamp.tsx`
- Replace all `bg-foreground` references with `bg-white` (6 occurrences: main container, 4 mask divs, 1 top block)

### Changes in `src/components/NotWholeStoryLamp.tsx`
- Change text gradient from `from-primary-foreground to-primary-foreground/60` to `from-foreground to-foreground/80` (dark text on white background)

### Will it look weird?
Honestly — the purple glow on white can look elegant, almost like a soft spotlight effect. It shifts from "dramatic/cinematic" to "clean/modern." Since the rest of the About DLD page uses light backgrounds, a white lamp section would flow more naturally with the surrounding content instead of being a jarring dark block. Worth trying — easy to revert if you don't like it.

### Files
| File | Change |
|------|--------|
| `src/components/ui/lamp.tsx` | Replace `bg-foreground` → `bg-white` in 6 places |
| `src/components/NotWholeStoryLamp.tsx` | Update text color to dark gradient |

