

## Refine "SHOP ALL" Button Width

The button currently stretches wider than needed due to `w-fit` not being set (it defaults to full width in the flex column). The fix is to constrain the button to hug its content by adding `w-fit`, making it compact and visually balanced.

### Changes

**`src/components/BookShowcase.tsx`**
- Add `w-fit` to the Button's className so it only spans the width of its text content instead of stretching across the column.

