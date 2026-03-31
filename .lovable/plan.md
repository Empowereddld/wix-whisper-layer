

## Plan: Animated collective goal progress with confetti celebration

**Goal**: When the "Our Collective Goal" section fully enters the viewport, animate the progress bar filling from 0 to 4000 over ~4 seconds. When it hits 4000, trigger a localized confetti burst around the progress bar endpoint. Hold for 5 seconds, then reset and repeat while the section is visible.

### Steps

**1. Install canvas-confetti library**
- `npm install canvas-confetti` + `@types/canvas-confetti`
- Lightweight, no-dependency confetti library perfect for localized bursts

**2. Create the animated collective goal section**

Replace the static `<Progress>` bar in the S7 section (lines 562–584) with an animated version:

- **Intersection Observer**: Use `IntersectionObserver` with `threshold: 0.9` on the section so the animation only starts when the entire section is visible
- **Animated counter + bar**: When triggered, animate `displayCount` from 0 → 4000 and `displayPct` from 0 → 100 over ~4 seconds using `requestAnimationFrame` with easing
- **Counter text**: Show the animated number instead of `wl.totalCount` during the animation (e.g., "2,347 storytellers and counting")
- **Confetti on completion**: When the bar reaches 100%, fire a confetti burst:
  - Use `confetti({ particleCount: 80, spread: 50, origin: { x, y } })` where x/y is calculated from the progress bar's right end position
  - Colors: purples and lavenders matching the brand (`#7E5BEF`, `#B794F6`, `#DDD6FE`)
  - Small area of effect — localized to the end of the progress bar
- **Hold 5 seconds**: After confetti, hold the completed state for 5 seconds
- **Reset & repeat**: After the hold, reset to 0 and animate again (loop while section is in view)
- **Stop when out of view**: When the section scrolls out, cancel the animation loop and reset

**3. Implementation details**

File: `src/pages/StoryBuilders.tsx`

- Add a new `AnimatedCollectiveGoal` component (or inline the logic in the section)
- Refs: `sectionRef` for IntersectionObserver, `progressBarRef` for confetti origin calculation
- State: `displayCount`, `isAnimating`, `animationPhase` (filling | celebrating | holding | idle)
- The easing function: ease-out cubic for smooth deceleration as it approaches 4000
- Confetti origin: get `progressBarRef.getBoundingClientRect()`, calculate the right edge position relative to the viewport, convert to 0-1 ratio for `confetti()`

### Technical summary
- New dependency: `canvas-confetti`
- Single file edit: `src/pages/StoryBuilders.tsx` (lines 562–584)
- Animation cycle: 4s fill → confetti burst → 5s hold → reset → repeat
- Trigger: IntersectionObserver at 90% visibility
- Confetti scoped to progress bar endpoint area

