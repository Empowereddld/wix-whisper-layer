

## Plan: Reduce Logo Size on Signup Pages

The logo on `/hub/signup` and `/signup/role` uses `h-48` (192px tall), while all other auth pages consistently use `h-10` (40px). This is why it appears enormous.

### Changes

**`src/pages/hub/HubSignup.tsx` (line 79)**
- Change `className="h-48 mx-auto"` to `className="h-10 mx-auto mb-6"` (matching other auth pages)

**`src/pages/auth/SignupRole.tsx` (line 109)**
- Change `className="h-48 mx-auto"` to `className="h-10 mx-auto mb-6"` (matching other auth pages)

Two lines changed, two files.

