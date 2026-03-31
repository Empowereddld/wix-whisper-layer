

## Plan: Animate card titles upward on hover

**Problem**: Currently the title stays in place and the description just fades in below it. The title should sit lower by default and slide upward on hover to make room for the description.

**File**: `src/pages/StoryBuilders.tsx`

**Change**: For each of the 3 photo cards, update the title and description positioning:

1. **Title**: Add `translate-y-4 group-hover:translate-y-0 transition-transform duration-300` so it sits ~16px lower by default and slides up on hover
2. **Description**: Keep the `opacity-0 group-hover:opacity-100` fade, and also add `translate-y-2 group-hover:translate-y-0 transition-all duration-300` for a subtle upward slide-in effect

Apply this to all 3 cards (left tall card, top-right card, bottom-right card).

