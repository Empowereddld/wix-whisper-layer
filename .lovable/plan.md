

## Slow Down Card Transitions with Continuous Scroll-Linked Movement

The current implementation snaps between discrete `activeIndex` states, so cards jump instantly from "active" to "gone." The reference screenshots show the outgoing card **mid-transition** — partially scrolled up while the next card is revealed. To achieve this, we need **continuous scroll-linked positioning** instead of discrete index snapping.

### Approach

Replace the integer `activeIndex` state with a **floating-point scroll progress** value. Each card's position will be calculated continuously based on how far through that card's "segment" the user has scrolled.

### Changes to `DLDImpactSection.tsx`

1. **Replace `activeIndex` with `scrollProgress`** (a float from 0 to `cards.length - 1`):
   - Instead of `Math.floor(progress * cards.length)`, store the raw float: `progress * (cards.length - 1)`
   - This gives us e.g. `2.4` meaning "40% through transitioning from card 2 to card 3"

2. **Calculate per-card transform continuously**:
   - For a card at index `i`, compute `offset = scrollProgress - i`
   - `offset < 0`: card is below (waiting) — stack with subtle Y offset
   - `offset === 0`: card is fully active — front and center
   - `0 < offset < 1`: card is **actively leaving** — `translateY(-offset * 120%)` with gradual rotation and fade. This is the key change that makes the card visibly slide up as the user scrolls
   - `offset >= 1`: card is fully gone — hidden above

3. **Keep transition duration short** (e.g., `duration-100` or `duration-150`) since the scroll itself drives the movement — we just want slight smoothing, not a long CSS animation fighting the scroll position.

4. **Update the left-column counter** to use `Math.round(scrollProgress)` for display.

This gives the smooth, scroll-linked card peeling effect visible in the reference — where you can see the outgoing card at any intermediate position as you scroll.

