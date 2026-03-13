

## Redesign Hub Preview Page to Match Main Site Branding

The current Hub Preview page uses its own isolated design (midnight bg, mauve accents, custom header/footer) that feels disconnected from the main Empowered DLD website. This redesign will use the **main site's Header/Footer**, typography (DM Sans, font-black headlines), color palette (deep-purple hero, bg-muted sections), and layout conventions.

### Architecture

The page will be a single file rewrite of `src/pages/hub/HubPreview.tsx`. It will import and use the shared `Header` and `Footer` components instead of custom ones.

### Section-by-Section Plan

**1. Hero** — Use the standardized deep-purple hero pattern (`bg-deep-purple py-20 md:py-28 lg:py-32`) with:
- Eyebrow: `DLD RESOURCE HUB`
- Headline: "DLD Resources for Families and Professionals" (font-black, same size scale as ResourcesHero)
- Subheadline: "Posters, guides, checklists, and learning tools..."
- Trust line: "Join 4,300+ parents, therapists, and educators..."
- CTA button: "Get Instant Access" styled like main site buttons (`bg-deep-purple-foreground text-deep-purple` or white on purple)
- Small text: "Create a free account to explore the Resource Hub."

**2. Signup Form Card** — Centered card on `bg-muted` section:
- Title, description, Name/Email fields, Role dropdown, Interest checkboxes
- Submit button: "Access the Resource Hub"
- This form will call the existing `/hub/signup` flow (Link redirect for now, since actual signup requires the auth system)

**3. Community Stats** — Reuse the `ShopGlobalCommunity`-style stat cards with animated counters:
- 4,300+ community members
- 15+ countries reached  
- Supporting parents, therapists, and educators worldwide

**4. Resource Preview** — Keep existing card grid with audience filter tabs, updated copy:
- Title: "Explore the Resource Library"
- Subtitle: "Browse posters, guides, checklists, and practical tools..."
- Remove "free" emphasis from hover overlay; change to "Sign Up to Access"

**5. Testimonials** — Keep existing testimonial cards, use site-standard section styling

**6. FAQ** — Updated questions per the brief, accordion style maintained

**7. Final CTA** — "Start exploring the DLD Resource Hub" with "Get Instant Access" button

### Key Style Changes
- Replace all `bg-midnight` / `text-midnight` hero styling with `bg-deep-purple` / white text
- Use `font-black` for headlines (matching `h1` on other pages)
- Use site's `Header` and `Footer` components
- Section backgrounds: alternate `bg-white`, `bg-muted`, `bg-deep-purple`
- Buttons: `bg-deep-purple` style with uppercase tracking (matching main site CTAs)
- Keep animated counters but restyle with site palette

### Files to Change
- `src/pages/hub/HubPreview.tsx` — Full rewrite

