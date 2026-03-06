

## Plan: Add Subtle Animations to the For Therapists Page

Add gentle scroll-triggered fade-in animations and smooth hover transitions across the For Therapists page. Nothing dramatic -- just soft entrance effects to reduce visual abruptness.

### 1. Create a reusable `useScrollFadeIn` hook

A lightweight custom hook using IntersectionObserver that returns a ref and a className. When the element scrolls into view, it transitions from `opacity-0 translate-y-4` to `opacity-100 translate-y-0`. Configurable threshold and delay.

**File:** `src/hooks/useScrollFadeIn.ts`

### 2. Apply fade-in on scroll to each section

Wrap the main content containers in each therapist page component with the hook's ref:

- **ForTherapistsHero.tsx** -- Fade in the gray card content (tag, heading, paragraph, button) with a short delay. Image fades separately.
- **TherapistsFamiliarSection.tsx** -- Fade in the black bar and text block as they scroll into view.
- **HowWeSupportTherapistsSection.tsx** -- Fade in the heading, then stagger the 6 cards with small incremental delays (e.g., 50ms apart).
- **WhyTherapistsTrustSection.tsx** -- Fade in the heading + checklist, image fades independently.
- **TherapistsRightPlaceSection.tsx** -- Fade in the heading, image, and text block.
- **ResourceLibraryCTA.tsx** -- Fade in the CTA card.

### 3. Add smooth hover transitions to interactive elements

- **HowWeSupportTherapistsSection cards** -- Add `transition-all duration-300 hover:shadow-lg hover:-translate-y-1` for a subtle lift on hover.
- **CTA buttons** -- Already have `transition-colors`; no changes needed.
- **Links with arrows** -- Add `group` to parent, `group-hover:translate-x-0.5 transition-transform` to the ChevronRight icon.

### 4. CSS additions

Add a small utility class in `src/index.css` for the fade-in base state:

```css
.fade-in-section {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.fade-in-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

This keeps it CSS-driven (no JS animation libraries), performant, and subtle.

