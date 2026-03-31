

## Plan: Polish Progress Section — copy upgrades, Step 1 reward card, dynamic anchor, and founder scarcity

**File**: `src/pages/StoryBuilders.tsx`

### 1. Update reward card copy (lines 644–667)

| Step | Current title | New title |
|------|--------------|-----------|
| 2 | Early access to StoryBuilders | Be one of the first to explore StoryBuilders |
| 3 | Get your Story Pack | Unlock your Story Pack |
| 4 | Unlock a private Dan & Daria episode | Listen to a private Dan & Daria episode |

Also update Step 3 impact text:
- Current: "Help more children understand what's happening and explain it clearly"
- New: "Help more children understand what happened and explain it clearly"

### 2. Add reward card to Step 1 (line 641)

Change `reward: null` → add a reward card:
- Icon: `<Sparkles size={20} />` (import from lucide-react)
- Title: "You're officially in"
- Desc: "You're part of this from the very beginning"

Move the current impact text ("You're part of this from the very beginning") into the reward card desc, and set impact to a shorter line like "Welcome to the Launch Team".

### 3. Add dynamic progress anchor line (lines 628–633)

Replace the static subtitle with a motivational line:
- "You're just getting started — your next reward is one step away"

This replaces the current "You're helping more children feel confident communicating" micro-line.

### 4. Add scarcity line to founder pricing card (line 665)

Update Step 5's reward desc:
- Current: `"$5.99/month forever — available to the first 100 who reach this milestone"`
- New: Split into two lines in the render — main desc stays `"$5.99/month forever"`, add a secondary lighter line below: `"Only for the first 100 families"`

This means updating the `ProgressStep` type to support an optional `subdesc` field on the reward, and rendering it in a smaller, lighter style below the main desc.

### Technical summary

- Import `Sparkles` from lucide-react alongside existing icons
- Add optional `subdesc?: string` to the reward type in `ProgressStep`
- Render `subdesc` below `desc` in the reward card with smaller font (12px), lighter color, and slight top margin
- All changes in a single file: `src/pages/StoryBuilders.tsx`

