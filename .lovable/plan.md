## Problem

Signup and login flows show raw Supabase error text (or a generic hardcoded "Invalid email or password") for every failure. The most visible case is a user who already has an account seeing "User already registered" verbatim with no path forward.

## Affected flows

1. **HubSignup** (`/hub/signup`) — passes raw `error.message` to the toast.
2. **Signup** (`/signup`) — same pattern.
3. **HubLogin** (`/hub/login`) — hardcoded "Invalid email or password" for every error.
4. **Login** (`/login`) — same hardcoded string.
5. **SocialLoginButtons** — OAuth errors only hit `console.error`; no toast.

## Proposed changes

### 1. New utility `src/lib/auth-errors.ts`

Pure `getFriendlyAuthError(rawMessage: string): { title: string; description?: string }` that matches the raw message (case-insensitive substring) and returns friendly copy for exactly these cases:

- **Account already exists** → "An account with this email already exists. Try logging in instead." (matches `already registered`, `already exists`, `user already`)
- **Incorrect email or password** → "The email or password you entered doesn't match our records." (matches `invalid login`, `invalid credentials`)
- **Email not verified** → "Please verify your email before logging in. Check your inbox for the verification link." (matches `email not confirmed`)
- **Too many attempts** → "Too many attempts. Please wait a few minutes and try again." (matches `rate limit`, `too many`, `429`)
- **Network / connection issue** → "We're having trouble connecting. Please check your internet and try again." (matches `failed to fetch`, `network`, `timeout`)
- **Fallback** → "Something went wrong. Please try again in a moment."

No mapping for weak-password / HIBP errors. If Supabase ever surfaces one, it falls through to the generic fallback.

### 2. Wire into HubSignup and Signup

Replace `toast({ title: error.message })` with the mapped title/description. For the "already exists" case, the toast description will include a link to the matching login page (`/hub/login` or `/login`) so users can recover in one click.

### 3. Wire into HubLogin and Login

Replace the hardcoded "Invalid email or password" with the mapper. This means rate limits and network errors are labelled correctly instead of always blaming the password.

### 4. Wire into SocialLoginButtons

Import `useToast` and surface a friendly toast when OAuth fails (currently silent for the user).

## Out of scope

- No backend changes, no migrations, no auth-config changes.
- No changes to the Story Pros waitlist edge function or its hook (already handles `already_joined` gracefully with its own friendly copy).
- No password-strength UX or messaging.