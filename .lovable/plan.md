

## Fix Hook Section Gradient to Match Framer Reference

### The issue
The current gradient spreads lavender evenly from top to bottom. The Framer reference keeps the top ~75% pure white and only fades in color at the very bottom ~25%.

### Fix

**File: `src/pages/StoryBuilders.tsx`** — Change the gradient on the Hook section from:
```
bg-gradient-to-b from-white to-lavender
```
to a multi-stop gradient that stays white much longer before fading:
```
bg-[linear-gradient(to_bottom,white_70%,hsl(266,100%,97%)_100%)]
```

This keeps the top 70% pure white and only introduces the lavender wash in the bottom 30%, matching the Framer reference pattern.

