

## Phase 1: Authentication & Core Structure

This plan covers database schema, signup, login, basic dashboard layout, and account settings for the Empowered DLD Resource Hub.

### Important Notes

- **Social login**: Google + Apple (Facebook is not available on Lovable Cloud)
- **Auth method**: Email + password (traditional)
- **Color palette**: New design tokens (Midnight, Lavender, Thistle, Mauve, Stone) will be added alongside existing theme variables
- **Email verification**: Enabled by default (users must verify before accessing the hub)

---

### 1. Database Migration

Create the following tables and enums:

```sql
-- Enums
CREATE TYPE public.user_role AS ENUM ('parent', 'slp', 'educator', 'school_leader', 'other');
CREATE TYPE public.age_range AS ENUM ('0-4', '5-7', '8-10', '11-13', '14+', 'not_applicable');

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'parent',
  country TEXT,
  age_range age_range DEFAULT 'not_applicable',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: users can read/update their own profile
-- Trigger: auto-create profile on signup using raw_user_meta_data
```

Also create the `resources` and `user_downloads` tables now (empty, for Phase 2), so the schema is complete.

```sql
CREATE TYPE public.resource_type AS ENUM ('poster','guide','checklist','handout','activity','bundle','infographic');

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  resource_type resource_type NOT NULL,
  settings TEXT[] DEFAULT '{}',
  age_ranges TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{English}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  download_count INTEGER DEFAULT 0
);

CREATE TABLE public.user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

RLS policies:
- `profiles`: authenticated users can SELECT/UPDATE their own row
- `resources`: authenticated users can SELECT all
- `user_downloads`: authenticated users can SELECT/INSERT their own rows

Trigger on `auth.users` insert to auto-create a profile row from `raw_user_meta_data` (first_name, role).

### 2. Design System Updates

Add the Resource Hub color palette to `tailwind.config.ts` and `index.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `midnight` | `#1F1A3A` | Nav, headings, primary buttons |
| `hub-lavender` | `#8F79B5` | Hover states, highlights |
| `thistle` | `#D7CCE5` | Section backgrounds, filter areas |
| `mauve` | `#C18CAB` | Badges, tags, accents |
| `stone` | `#A7B4C4` | Secondary text, neutral UI |

### 3. New Pages & Routes

Add these routes to `App.tsx`:

| Route | Component | Access |
|-------|-----------|--------|
| `/hub/signup` | `HubSignup` | Public |
| `/hub/login` | `HubLogin` | Public |
| `/hub/verify-email` | `VerifyEmail` | Public |
| `/hub` | `HubDashboard` | Auth required |
| `/hub/settings` | `HubSettings` | Auth required |

### 4. Signup Page (`/hub/signup`)

- Headline: "Create Your Free Account" / "Sign up once. Access everything."
- Google + Apple social login buttons at top (using Lovable Cloud managed OAuth)
- Divider: "Or sign up with email"
- Form fields: First Name, Email, Password, Confirm Password, Role (required dropdown), Country (optional), Age Range (optional)
- Password validation: min 8 chars, 1 number, 1 uppercase
- On submit: `supabase.auth.signUp()` with `raw_user_meta_data: { first_name, role, country, age_range }`
- Redirect to `/hub/verify-email` screen

### 5. Login Page (`/hub/login`)

- Headline: "Welcome Back"
- Google + Apple buttons
- Email + password form
- "Forgot password?" link (triggers `resetPasswordForEmail`)
- Button: "Access Resources"
- On success: redirect to `/hub`

### 6. Auth Context & Protected Routes

- Create `AuthProvider` context wrapping hub routes
- Check session state with `onAuthStateChange` + `getSession`
- Redirect unauthenticated users to `/hub/login`
- Store user profile data in context

### 7. Hub Dashboard Layout (`/hub`)

- Top nav bar with Midnight background, logo (links to empowereddld.com), search bar placeholder, user menu (first name + dropdown: Settings, Log Out)
- Welcome message on first login
- Empty resource grid placeholder (content comes in Phase 2)
- Filter sidebar placeholder (left side, Thistle background)

### 8. Account Settings (`/hub/settings`)

- Profile section: edit first name, role, country, age range
- Password section: change password (current + new + confirm)
- Login methods display (which provider was used)
- Delete account button with confirmation modal
- Export data placeholder

### 9. Password Reset Flow

- Create `/hub/reset-password` page
- Handles `type=recovery` from URL hash
- Form to set new password via `supabase.auth.updateUser()`

### File Structure (new files)

```text
src/
├── contexts/
│   └── AuthContext.tsx
├── components/hub/
│   ├── HubHeader.tsx
│   ├── HubLayout.tsx
│   ├── ProtectedRoute.tsx
│   ├── SocialLoginButtons.tsx
│   └── PasswordInput.tsx
├── pages/hub/
│   ├── HubSignup.tsx
│   ├── HubLogin.tsx
│   ├── VerifyEmail.tsx
│   ├── HubDashboard.tsx
│   ├── HubSettings.tsx
│   └── ResetPassword.tsx
```

### Security (built-in with this approach)

- Password hashing: handled by Supabase Auth (bcrypt)
- Session management: 30-day persistence via Supabase Auth config
- CSRF: handled by Supabase's token-based auth
- Input validation: Zod schemas on all forms
- RLS on all tables
- Generic error messages ("Invalid email or password")
- Rate limiting: Supabase Auth has built-in rate limits on login/signup

### What you'll need to configure manually

- Rate limiting beyond Supabase defaults (custom login attempt tracking would require an edge function)
- Content Security Policy headers (configure on your hosting/CDN)
- HTTPS redirect (handled by Lovable's hosting automatically)

