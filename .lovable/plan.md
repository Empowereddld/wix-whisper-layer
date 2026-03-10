

## WebP Asset Swap — Homepage Images

Replace 5 PNG assets with the uploaded WebP versions and update all component imports.

### Asset Mapping

| Upload | Replaces | Used In |
|--------|----------|---------|
| `two_girls-_home_page.webp` | `hero-girls.png` | HeroSection |
| `Parents_and_caregiver-_home_page.webp` | `icon-parents.png` | ChoosePathSection |
| `For_Teachers_and_Support_Staff.webp` | `icon-educators.png` | ChoosePathSection |
| `school_clinics_and_organization-_home_page.webp` | `icon-organizations.png` | ChoosePathSection |
| `Empowered_Logo-_home_page.webp` | `empowered-logo.png` | Header, Footer (white version stays), AdminLayout, HubLogin, HubSignup, HubPreview, HubComingSoon, Signup, Login, ForgotPassword, ResetPassword, VerifyEmail, SignupRole |

### Steps

1. **Copy 5 files** to `src/assets/` as WebP replacements:
   - `hero-girls.webp`
   - `icon-parents.webp`
   - `icon-educators.webp`
   - `icon-organizations.webp`
   - `empowered-logo.webp`

2. **Update imports** in all components that reference these assets (swap `.png` → `.webp`):
   - `HeroSection.tsx` — hero-girls
   - `ChoosePathSection.tsx` — 3 icons (parents, educators, organizations)
   - `Header.tsx`, `AdminLayout.tsx`, `HubLogin.tsx`, `HubSignup.tsx`, `HubPreview.tsx`, `HubComingSoon.tsx`, `Signup.tsx`, `Login.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `VerifyEmail.tsx`, `SignupRole.tsx` — empowered-logo

### Note
- `icon-slps.png` (therapist/clinician icon) has no WebP replacement uploaded yet — it remains as PNG.
- `empowered-logo-white.png` (used in Footer and HubHeader) also has no replacement — stays as PNG.

