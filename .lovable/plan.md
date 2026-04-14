

## Rename Tier Names to "Tier 1–5" (+ Founding Elite → Tier 6)

I agree — "Tier 1, Tier 2..." is cleaner and more intuitive for users. Here's what needs to change:

### Files to update

1. **`src/lib/waitlist-constants.ts`** — Change `TIER_NAMES` array from `["Storyteller", "Advocate", "Champion", "Hero", "Legend", "Founding Elite"]` to `["Tier 1", "Tier 2", "Tier 3", "Tier 4", "Tier 5", "Tier 6"]`

2. **`src/pages/StoryBuilders.tsx`** — Update the `milestones` array labels (e.g. `"Storyteller (0 pts)"` → `"Tier 1 (0 pts)"`) and the `progressSteps` task names (e.g. `"Storyteller — 0 points"` → `"Tier 1 — 0 points"`). Also update the community goal copy ("storytellers" → "supporters" or similar).

3. **`src/components/waitlist/TierProgressBar.tsx`** — Update the local `TIERS` array names from old names to Tier 1–6.

4. **`src/components/waitlist/RewardsInventory.tsx`** — Update `BADGES` array names and the tier requirement display string.

5. **`src/components/waitlist/PositionCard.tsx`** — Already reads from `TIER_NAMES`, so auto-updated.

6. **`src/components/admin/UserPreviewMode.tsx`** — Badge label map entries; already reads `TIER_NAMES` for dropdowns so mostly auto-updated.

7. **`src/pages/EarlySupportersWall.tsx`** / **`src/pages/WaitlistUserGuide.tsx`** — Both use `TIER_NAMES` from constants, auto-updated.

8. **`src/components/waitlist/MilestoneModal.tsx`** — References tier names for confetti colors, will adapt.

9. **SVG badge files** (`public/badges/share-*.svg`) — Update text from "HERO", "LEGEND", etc. to "TIER 4", "TIER 5", etc.

### Approach
- Most components already read from `TIER_NAMES` in `waitlist-constants.ts`, so changing that single source updates ~60% of references automatically.
- The remaining hardcoded references in StoryBuilders.tsx, TierProgressBar.tsx, and RewardsInventory.tsx need manual updates.
- SVG badges get updated text labels.

