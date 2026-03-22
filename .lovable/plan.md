

## Separate StatBand for Homepage vs StoryBuilders

**Problem**: The `StatBand` component is shared between the homepage (`/`) and the StoryBuilders page (`/storybuilders`). All recent copy and layout changes (text change to "You can see your child struggling...", accent border, tighter max-width, etc.) were applied to the shared component, unintentionally altering the homepage too. No other pages use `StatBand`, so only these two were affected.

### Plan

1. **Revert `StatBand.tsx` to its original homepage version** — restore the original text ("You know your child struggles with language...") and the original layout styling (no accent border, original padding/width)

2. **Create a new `StoryBuildersStatBand.tsx`** — a separate component specifically for the StoryBuilders page with:
   - The updated copy ("You can see your child struggling with language...")
   - The accent border, `max-w-5xl` constraint, and all the layout refinements
   - The italic emotional closer

3. **Update `StoryBuilders.tsx`** — swap the `StatBand` import for `StoryBuildersStatBand`

### Files
- **Revert**: `src/components/StatBand.tsx` (restore original homepage version)
- **Create**: `src/components/StoryBuildersStatBand.tsx` (new, with all the StoryBuilders-specific styling)
- **Edit**: `src/pages/StoryBuilders.tsx` (update import)

