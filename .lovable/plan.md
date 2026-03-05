

## Plan: Improve "Does this sound familiar?" section visual balance

**Problem**: The black card is too tall with wasted empty space, creating visual imbalance with the text column.

**Changes to `src/components/DoesSoundFamiliarSection.tsx`**:

1. Make both columns equal height by ensuring the grid rows stretch — the black card should match the text column height naturally rather than being oversized.
2. Align the heading to the bottom-left of the black card using `items-end` instead of `items-center`, so the empty space feels intentional (like breathing room above the heading).
3. Set `min-h-0` on the black card so it only grows to match the text column, not beyond.
4. Ensure both grid columns have `items-stretch` so they share the same height.

This is a small styling tweak — only modifying the grid and card classes in `DoesSoundFamiliarSection.tsx`.

