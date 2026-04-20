
User approved Pass A + B. Plan: do the mechanical edits in one batch.

**Pass A — Em dash replacements** (~25 user-facing spots)
Files to edit (body copy / headlines only, skip SEO meta + admin placeholders):
- `src/components/WhatIsDLDSection.tsx` — headline quote
- `src/components/DownloadablesSignupCTA.tsx`
- `src/components/AboutDLDHero.tsx`
- `src/components/StatBand.tsx`
- `src/components/DownloadablesLibraryIntro.tsx`
- `src/pages/EducationalApp.tsx` — hero subhead, feature copy
- `src/lib/waitlist-constants.ts` — tier descriptions, reward copy
- `src/pages/hub/HubPreview.tsx`
- Spot-check: `src/components/Footer.tsx`, hero/CTA sections found in scan

Replacement rules:
- ` — ` (with spaces) → `, ` or `: ` based on grammar (clause = comma, list/explanation = colon)
- `—` (no spaces) → `, `
- Leave em dashes inside SEO `<title>` strings, OG tags, and admin form placeholders untouched

**Pass B — "Free" softening** (~10 Hub entry points)
- "Create Free Account" → "Create Account" (buttons in DownloadablesSignupCTA, HubPreview, hero CTAs)
- "Free Account" labels → "Account"
- "Sign Up for Free Access" → "Sign Up for Instant Access"
- "Get Free Access" → "Get Instant Access"
- Keep "free" where it accurately describes a specific free resource (e.g. DLD Starter Kit "It is free", FreeCourse page title) — those are factual, not marketing
- Keep "free" in legal/privacy pages

**Out of scope for this pass**
- "children with DLD" wording (that's Pass C, table-based review)
- Resource descriptions in the database (you've been editing those manually)
- Blog post bodies (content-integrity rule)

**After edits**
I'll list every file changed with a one-line summary so you can spot-check, then we move to Step 2: Functional Smoke Tests.
