

## Plan: Authentication Flow for Empowered DLD Resource Hub

Based on exploring the codebase, there's already auth infrastructure in place at `/hub/signup` and `/hub/login`. The user wants new routes at `/signup`, `/login`, `/forgot-password` with a redesigned flow that separates role selection into a dedicated onboarding step.

### Database Change Required
The `profiles` table currently only has `first_name`. The spec requires `last_name`. I'll add this column via migration.

### Files to Create

1. **`src/pages/auth/Signup.tsx`** (`/signup`)
   - Clean form: first name, last name, email, password, confirm password
   - Pink CTA button "Create My Account →"
   - Trust line with "✦ 100% Free ✦ No credit card ✦ Cancel anytime"
   - After successful signup → redirect to `/signup/role`

2. **`src/pages/auth/SignupRole.tsx`** (`/signup/role`)
   - Friendly heading "Welcome! One quick question..."
   - Three large selectable cards (Parent, Therapist, Educator) with icons
   - Updates user profile with selected role
   - CTA "Take Me to the Resources →" appears after selection
   - Redirects to `/hub`

3. **`src/pages/auth/Login.tsx`** (`/login`)
   - Email + password fields
   - Pink CTA "Log In →"
   - "Forgot your password?" link
   - Links to signup

4. **`src/pages/auth/ForgotPassword.tsx`** (`/forgot-password`)
   - Email field only
   - Sends reset link via Supabase
   - "Back to Log In" link

### Files to Modify

- **`src/App.tsx`** - Add new routes: `/signup`, `/signup/role`, `/login`, `/forgot-password`
- **`src/index.css`** - Add coral/pink accent color variable (`--coral`)
- **`tailwind.config.ts`** - Register the coral color

### Styling Notes
- All pages use centered logo (no nav links)
- Pink/coral CTAs (adding `--coral: 4 77% 67%` for the accent)
- White card on light gradient background (existing `thistle/30`)
- Warm, minimal aesthetic matching brand

### Technical Flow
1. User signs up → account created with `first_name`, `last_name` in metadata → sent to verify email
2. After email verification → redirected to `/signup/role`
3. User selects role → profile updated → redirected to `/hub`
4. Returning users → `/login` → `/hub`

