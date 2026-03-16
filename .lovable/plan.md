

## Plan: Restructure Hub Signup into Two Distinct Steps

### Overview
Split the current signup flow so Step 1 is pure account creation (at `/hub/signup`) and Step 2 is a lightweight onboarding screen (at a new route or reusing `/signup/role`) with role, interests, and a resource wish field.

### Step 1: Update HubSignup.tsx (Account Creation)
The page already has most of the right structure. Changes needed:
- Keep the existing logo (h-48), heading "Create Your Free Account", subheading "Sign up once. Access everything."
- Keep `SocialLoginButtons` (Google + Apple via Lovable Cloud OAuth)
- Keep the "OR SIGN UP WITH EMAIL" divider
- Keep first name, email, password, confirm password fields
- Button text is already "Create Account" — no change needed
- Keep "Already have an account? Log in" link
- Keep dark purple button styling (`bg-midnight`)
- After successful signup, redirect to the new onboarding step instead of `/hub/verify-email`

**Key decision**: Since email auto-confirm is enabled (per memory), after signup we navigate directly to the onboarding step. If email verification were required, the flow would go verify-email → onboarding.

### Step 2: Create New Onboarding Page (Post-Signup)
Create or repurpose a page for the post-signup onboarding step:
- **Route**: Reuse `/signup/role` path but replace `SignupRole.tsx` content entirely
- **Header**: "One last thing..." with subheading "Help us personalize your experience."
- **Fields**:
  - Role dropdown (Parent, Therapist, Educator, School Leader, Other) — reuse from HubPreview's role select
  - Interest checkboxes — reuse the `interestOptions` array from HubPreview
  - Open text field: "I wish there was a resource for..." with placeholder "Your answer might inspire our next resource."
- **Submit button**: "Take me to the Resource Hub" — saves role + interests to the profiles table, then navigates to `/hub`
- **Skip link**: "Skip for now" in small text beneath the button — navigates directly to `/hub`
- **Styling**: Same `bg-gradient-to-b from-thistle/30 to-background` background, same card styling as Step 1

### Database Considerations
- The `profiles` table already has a `role` column — we'll update that
- Interests and resource wish may need new columns. Will check the schema and add a migration if `interests` and `resource_wish` columns don't exist.

### Changes to HubPreview.tsx
- The inline signup form (Section 2) currently collects name, email, role, interests. Update it to simply link to `/hub/signup` (or keep as a lead-capture form). No structural changes needed since it already has a "Get Instant Access" button linking to `/hub/signup`.

### Files to Modify
1. **`src/pages/hub/HubSignup.tsx`** — Minor updates: ensure redirect goes to `/signup/role` after signup (already does via `emailRedirectTo`, but direct navigation should also go there)
2. **`src/pages/auth/SignupRole.tsx`** — Replace with new onboarding UI (role dropdown, interests, resource wish field)
3. **Database migration** — Add `interests` (text array) and `resource_wish` (text) columns to profiles table if missing

### Flow Summary
```text
/hub/preview → "Get Instant Access" → /hub/signup (Step 1: Create Account)
                                           ↓ success
                                      /signup/role (Step 2: "One last thing...")
                                           ↓ submit or skip
                                        /hub (Dashboard)
```

