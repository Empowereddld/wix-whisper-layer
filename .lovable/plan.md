

## Plan: Premium StoryBuilders Hero Section

### Overview
Rebuild the `/storybuilders` page hero as a warm, premium two-column layout with the uploaded child+parent image on the right, and structured copy with CTA buttons on the left. Remove the existing inline waitlist form from the hero. Keep the "Why storytelling" and "Final CTA" sections below (they can be updated later).

### What changes

**1. Copy the uploaded image into the project**
- Copy `user-uploads://Gemini_Generated_Image_9nlto39nlto39nlt.png` → `src/assets/storybuilders-hero.png`

**2. Rewrite `src/pages/StoryBuilders.tsx` hero section**

Replace the current centered single-column hero + WaitlistForm with:

- **Background**: Soft warm off-white (`bg-[#FFF9F5]` or similar warm neutral)
- **Two-column layout** (stacks on mobile):
  - **Left column** — text content with motion fade-in:
    - Small label: `COMING SOON` in uppercase tracking
    - **Headline**: "The storytelling app created to support children with DLD" (font-black, ~42-54px)
    - **Subheadline**: "StoryBuilders helps children build language through interactive stories, structured support, and meaningful practice — that feels like a story, not a lesson."
    - **Support text** (smaller, muted): "Built to support comprehension, vocabulary, sentence building, and retell in one calm, child-friendly experience."
    - **CTA area** with space for future expansion:
      - Primary button: "Join the Launch Team" — warm orange/coral bg, rounded-full, shadow
      - Secondary button: "See How It Works" — outline/ghost style, rounded-full
    - **Microcopy** below buttons: "Created with children with Developmental Language Disorder in mind."
  - **Right column** — the uploaded parent+child image with `rounded-2xl` and subtle shadow, `object-cover`

- Remove the `WaitlistForm` component from the hero (keep it in the Final CTA section at the bottom for now, or remove entirely — will be replaced by the custom waitlist system later)

**3. Keep existing sections below the hero**
- "Why storytelling matters" section stays as-is
- "Be the first to try StoryBuilders" section stays but swap the WaitlistForm for the same "Join the Launch Team" button (placeholder until custom waitlist is built)

**4. Add Header/Footer**
- Wrap the page with the site's shared `<Header />` and `<Footer />` for navigation consistency (currently missing)

### Design details
- Buttons: `rounded-full` with generous padding
- Primary CTA color: warm orange/coral (`bg-[#E8734A]` or similar from the coral token `hsl(4, 77%, 67%)`)
- Secondary CTA: outline style with foreground text
- Image: `rounded-2xl shadow-elevated`, natural aspect ratio
- Section padding: `py-20 md:py-32` with `max-w-[1100px]` container
- Typography: DM Sans font-black for headline, regular weight for body
- Animations: reuse existing `fadeUp` motion variants with staggered delays

### Files modified
- `src/assets/storybuilders-hero.png` (new — copied from upload)
- `src/pages/StoryBuilders.tsx` (rewritten hero, add Header/Footer, update Final CTA)

