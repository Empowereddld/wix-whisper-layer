

## Plan: Add animated bullet points below the lamp heading

**File**: `src/components/NotWholeStoryLamp.tsx`

### Changes
Add three bullet points below the `<motion.h2>` heading, each wrapped in its own `<motion.div>` with the same `whileInView` fade-up animation (staggered delays: 0.8, 1.0, 1.2s).

**Bullets:**
- People with DLD have strengths and talents
- Children with DLD can be thoughtful, kind, and great friends
- With the right support, people with DLD can thrive

Each bullet will use the same animation pattern as the heading (`initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`), with incrementing delays so they cascade in after the title. Styled as a centered list with subtle text styling to complement the heading.

**Single file change**: `src/components/NotWholeStoryLamp.tsx`

