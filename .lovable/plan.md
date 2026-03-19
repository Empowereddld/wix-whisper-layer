

## Plan: Redesign StoryBuilders Hero + Dark Band to Match Homepage

### Section 1 — Hero (replacing current deep-purple block, lines 97-151)

Adopt the homepage's layered editorial style:
- **Background**: Blurred `school-hallway-bg.webp` with white-lavender gradient overlay (same as homepage `HeroSection`)
- **Layout**: Left-aligned text, no full-height (use `py-20 md:py-28 lg:py-32` instead of viewport-height)
- **Small caps label**: `FOR CHILDREN WITH DLD` — `text-primary/85`, `text-[9px] sm:text-[11px]`, `tracking-[0.18em]`
- **Headline**: "Every child deserves to tell their story." — `font-black`, `text-foreground`, same scale as homepage (~42-74px responsive)
- **Subtext**: "StoryBuilders is an app being built to help children with Developmental Language Disorder communicate with confidence. Join the Launch Team and help us build it." — `text-foreground/55`, `max-w-[420px]`
- **CTA**: "JOIN THE LAUNCH TEAM" button (deep-purple bg, same style as homepage "CHOOSE YOUR PATH" button) — scrolls to the signup form section lower on the page
- Keep the inline signup form logic but move it out of the hero (it stays in the closing CTA section at the bottom)

### Section 2 — Dark Accent Band (replacing current "Emotional Hook", lines 153-163)

Mirror the homepage `StatBand` component exactly:
- `bg-foreground text-background`, `py-10 md:py-16`
- **Left**: Bold headline "Why StoryBuilders?" — same sizing as "What affects 1 in 14 people?" (~18-42px responsive)
- **Right**: Paragraph "Storytelling is one of the hardest skills for children with DLD — and one of the most important. StoryBuilders is designed to change that, one story at a time." + outline button "See How It Works ›" that scrolls to the How It Works section

### What stays the same
- All sections from Section 3 onward (What Is StoryBuilders, Why Join, How It Works, Milestones, Collective Goal, Share, FAQ, Closing CTA) — unchanged
- The inline signup form remains in the **closing CTA section** at the bottom of the page
- All waitlist/referral hook logic unchanged
- Header, Footer, SEOHead unchanged

### File modified
- `src/pages/StoryBuilders.tsx` — replace lines 97-163 (hero + emotional hook) with new hero + dark band

