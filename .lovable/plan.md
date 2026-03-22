

## Create 3 Visual Treatments for "How It Works" Section

You want to see all three visual approaches rendered as live sections so you can compare and pick a winner. I'll create each as its own component and stack them below the current `StoryBuildersHowItWorks` on the page.

---

### Option A — Animated Loop / Cycle Path

A circular SVG path connecting the 3 steps with a dot that continuously travels along the path (CSS animation loop). Steps are positioned around the circle. The traveling dot uses a `stroke-dashoffset` animation on an infinite loop. Clean, minimal, feels like a product diagram.

### Option B — Illustrated Icon Cards

Each step gets a large, colorful illustrated icon area (using styled geometric shapes and lucide icons as a base) with a premium card treatment — gradient accent bars, larger visual weight. More editorial, magazine-feel.

### Option C — Interactive Carousel

A single-step-at-a-time carousel that auto-cycles through the 3 steps with smooth transitions (similar to the "What's Inside" section pattern already on the site). Each step fills more space with larger typography and a progress indicator showing which step is active.

---

### Files

1. **Create** `src/components/HowItWorksOptionA.tsx` — Circular animated loop with traveling dot
2. **Create** `src/components/HowItWorksOptionB.tsx` — Illustrated icon cards with geometric accents
3. **Create** `src/components/HowItWorksOptionC.tsx` — Auto-cycling carousel with progress dots
4. **Edit** `src/pages/StoryBuilders.tsx` — Import all 3 and place them after `<StoryBuildersHowItWorks />` with labels ("Option A", "Option B", "Option C") so you can scroll through and compare

Once you pick one, I'll remove the other two and replace the original section.

