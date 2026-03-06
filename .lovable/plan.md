

## Responsive & Mobile Optimization Audit and Plan

After reviewing all components across the three main pages (Index, WhoWeServe, ForParents) and the Hub pages, the codebase already follows a mobile-first responsive approach with Tailwind breakpoints. However, there are several areas that need improvement:

### Issues Found

1. **Header**: Mobile menu works, but the LOGIN button doesn't link anywhere; shopping cart icon is non-functional. No responsive issues per se, but touch targets could be tighter.

2. **HeroSection**: Desktop image scaling uses aggressive transforms (`scale-[0.68]`, `translate-x`) that can cause layout overflow on intermediate screen sizes (768–1024px). The `md:min-h-[calc(100vh-90px)]` doesn't account for the actual header height of 70px on mobile.

3. **StatBand**: Font jump from `18px` mobile to `42px` desktop is extreme — needs an intermediate `sm` or `md` step.

4. **ChoosePathSection**: 4-column grid at `lg` can feel cramped on 1024px screens. Per project conventions, complex multi-column layouts should use `lg` breakpoint (already does), but card icons have negative margin (`-m-3`) that can clip on small screens.

5. **BookShowcase**: 2-column book grid has no responsive text sizing for titles/subtitles on very small screens (320px). Image heights `h-36 sm:h-44 lg:h-56` work but could use `aspect-ratio` for consistency.

6. **TrustSection**: Three-column layout at `lg` works, but the `md` breakpoint shows a cramped 2-column with tiny 180px images. The `hidden md:flex lg:hidden` / `flex md:hidden lg:flex` pattern is correct but the `md` images are quite small.

7. **NotAloneSection**: Uses `md:grid-cols-[1fr_0.8fr]` — on tablets (768–1024px) this can feel tight. Per project conventions, this should use `lg` for the side-by-side layout.

8. **ContactSection**: Uses `lg` for 2-column correctly. Form card has no max-width constraint, could stretch too wide on very large screens.

9. **EveryChildSection**: Uses `md` for the overlapping image layout — should use `lg` per project conventions to avoid cramped tablet layouts. The image overlap with `md:absolute md:right-0` at 768px leaves very little space.

10. **ChoosePathCTA**: Heading uses `mx-auto text-center` but has no centering on the subtitle text above it — minor inconsistency.

11. **HubDashboard**: Quick-start cards and resource grid are well-responsive. Mobile filter sheet is functional.

12. **Footer**: Newsletter input is `lg:w-[420px]` which works but could be wider on xl screens.

### Plan

**Phase 1 — Critical fixes (layout-breaking on common devices)**

- **NotAloneSection**: Change `md:grid-cols-[1fr_0.8fr]` to `lg:grid-cols-[1fr_0.8fr]` so it stacks on tablets. Constrain image height when stacked.
- **EveryChildSection**: Change `md:` prefixes to `lg:` for the card/image overlap layout so tablets get stacked view.
- **StatBand**: Add intermediate font size: `text-[18px] sm:text-[28px] md:text-[42px]`.

**Phase 2 — Spacing and touch target improvements**

- **HeroSection**: Fix min-height calc to use correct header height (`70px` on mobile, `80px` on desktop).
- **Header**: Ensure all interactive elements meet 44px minimum touch target on mobile.
- **ChoosePathSection**: Remove negative icon margins that can clip.

**Phase 3 — Polish for small screens (320–375px)**

- **BookShowcase**: Add `text-[11px] sm:text-[12px]` scaling for book titles.
- **Footer**: Ensure newsletter inputs don't overflow on 320px screens.
- **TestimonialBand**: Carousel prev/next buttons can overlap text on very small screens — add `px-8` to the container on mobile.

**Phase 4 — Add viewport meta and reduced-motion support**

- Verify `index.html` has proper viewport meta tag.
- Add `motion-reduce:` variants to all `transition-all` and hover animations per accessibility requirements.

### Scope
- ~12 component files touched
- All changes are Tailwind class adjustments — no structural/logic changes
- Estimated: responsive class tweaks only, no new components

