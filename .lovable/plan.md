

## Plan: Replace emoji icons with Lucide React icons in Progress section

**File**: `src/pages/StoryBuilders.tsx`

### Icon mapping for each reward step

| Step | Current | New Lucide Icon | Why |
|------|---------|-----------------|-----|
| Step 2 — Early access to StoryBuilders | ✨ | `Rocket` | Conveys early launch/access |
| Step 3 — Get your Story Pack | 🎁 | `Gift` | Direct match for a reward pack |
| Step 4 — Private Dan & Daria episode | 🎧 | `Headphones` | Matches audio/episode content |
| Step 5 — Founder pricing for life | 💜 | `Crown` | Premium/founder status |

### Changes

1. **Add imports** at the top of the file:
   ```ts
   import { Rocket, Gift, Headphones, Crown } from "lucide-react";
   ```

2. **Change the `icon` field type** in the `ProgressStep` type from `string` to `React.ReactNode`

3. **Update step data** — replace emoji strings with JSX components:
   - `icon: "✨"` → `icon: <Rocket size={20} />`
   - `icon: "🎁"` → `icon: <Gift size={20} />`
   - `icon: "🎧"` → `icon: <Headphones size={20} />`
   - `icon: "💜"` → `icon: <Crown size={20} />`

4. **Update the render** — the `<span>` that displays `step.reward.icon` will now render a React component instead of a string, which works without any JSX changes since it's already in a `{}` expression.

The icons will inherit the purple accent color from their parent container. Each icon is sized at 20px to fit the reward card layout.

