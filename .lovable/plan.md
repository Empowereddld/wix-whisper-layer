

## Make Hook Gradient a Radial Bottom-Center Wash

### The issue
The Framer reference shows the colored wash concentrated in the **bottom-center** like a soft semicircle/ellipse radiating outward — not a flat horizontal band that spans the full width evenly.

### Fix

**File: `src/pages/StoryBuilders.tsx`** (line 149) — Replace the linear gradient with a radial gradient centered at the bottom:

```
bg-[linear-gradient(to_bottom,white_70%,hsl(266,100%,97%)_100%)]
```
→
```
bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(266,100%,97%)_0%,transparent_100%)]
```

This creates an elliptical lavender wash that's strongest at the bottom-center and fades out radially — matching the Framer reference's semicircle effect. The section background itself stays white, with the radial gradient layered on top.

