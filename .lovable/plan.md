## Goal

Replace user-facing "Resource Hub" / "resource hub" / "RESOURCE HUB" with "Resource Library" / "resource library" / "RESOURCE LIBRARY" across the site, preserving capitalization. Do not touch URL slugs, class names, variable names, or file names (none containing `resource-hub` were found anyway).

## Scope of changes

A site-wide grep found **17 files** with user-facing "Resource Hub" text. No URL slug, class name, or filename contains "resource-hub", so there are no slugs to leave alone or flag for redirect.

### Marketing site / shared components (4 files)
- `src/components/ContactSection.tsx` — confirmation email body link text
- `src/components/Footer.tsx` — newsletter confirmation email copy + CTA button text (URL unchanged)
- `src/components/HowWeSupportSchoolsSection.tsx` — body copy "...available in our resource hub" (lowercase)
- `src/components/OrganizationsLeadFormSection.tsx` — lead form confirmation email link text

### Legal pages (2 files)
- `src/pages/PrivacyPolicy.tsx` — 2 mentions ("sign up for our resource hub", "DLD Resource Hub")
- `src/pages/TermsAndConditions.tsx` — 1 mention ("DLD Resource Hub")

### Hub pages (4 files)
- `src/pages/hub/HubPreview.tsx` — 6 mentions: 3 FAQ Q&As, hero eyebrow `DLD RESOURCE HUB` → `DLD RESOURCE LIBRARY`, subhead, "A Few of the Tools Inside the Resource Hub", "Start exploring the DLD Resource Hub"
- `src/pages/hub/HubDashboard.tsx` — welcome greeting "Welcome, X, to the DLD Resource Hub"
- `src/pages/hub/PaymentSuccess.tsx` — 3 mentions (success message + 2 "Back to Resource Hub" buttons)
- `src/pages/hub/VerifyEmail.tsx` — verification message
- `src/pages/auth/SignupRole.tsx` — 2 mentions (welcome message + "Take me to the Resource Hub" button)

### Story Pros / waitlist reward copy (4 files)
- `src/components/waitlist/RewardsInventory.tsx` — reward description "(normally paid in the Resource Hub)"
- `src/lib/waitlist-constants.ts` — reward description "(normally paid in the Resource Hub)"
- `src/pages/AdminWaitlistGuide.tsx` — internal guide reward description
- `src/pages/StoryBuilders.tsx` — 2 reward descriptions

### Edge functions / emails (2 files)
- `supabase/functions/verify-payment/index.ts` — payment confirmation email "...unlocked in your Resource Hub"
- `supabase/functions/weekly-app-summary/index.ts` — internal admin summary label "New Resource Hub signups"

## What will NOT change
- No URL routes, slugs, file paths, class names, variable names, or `id` attributes contain "resource-hub" — confirmed by grep. Nothing to preserve there.
- Image filenames and alt text were searched; none contain "Resource Hub".
- Code comments — none contain "Resource Hub".

## Edge cases / things to flag

1. **`HowWeSupportSchoolsSection.tsx`** uses lowercase "resource hub" mid-sentence. Will become "resource library" per spec.
2. **`AdminWaitlistGuide.tsx`** and **`weekly-app-summary`** are admin-internal, not visitor-facing, but they still contain the phrase as readable copy — will update for consistency. Flagging in case you'd rather leave admin internals untouched.
3. **Footer.tsx line 80** has CTA button text "Explore the Resource Hub →" with `href="https://empowereddld.com/hub/preview"` (no slug change needed). Visible text becomes "Explore the Resource Library →".
4. **`StoryBuilders.tsx` line 915** has both a card title and a sub-description; only the descriptive phrase "(normally paid in the Resource Hub)" / "A digital product normally paid in the Resource Hub" will change.
5. Sentence "When you use our website, sign up for our resource hub, subscribe to our newsletter..." (PrivacyPolicy) — lowercase per source, becomes lowercase "resource library".

## Final deliverable summary (will be reported after implementation)

- **Files changed:** 17
- **URLs still containing `resource-hub`:** none found in the project
- **Items flagged for your review:** admin-internal copy in `AdminWaitlistGuide.tsx` and `weekly-app-summary/index.ts` (updated by default, easy to revert if you'd rather keep "Resource Hub" internally)
