

## Plan: Rebuild Resource Hub Preview/Landing Page

The existing `HubPreview.tsx` at `/hub/preview` is close but needs updates to match the detailed spec. The page already has the right structure (navbar, hero, preview grid, CTA, footer) but needs these changes:

### Changes to `src/pages/hub/HubPreview.tsx`

1. **Hero updates**
   - Change subheadline from "One Place. Always Free." to "Free to Access. Always Growing."
   - Update body text to say "Parents, Therapists, and Educators" (not SLPs/school leaders)
   - Replace Shield/Users/Sparkles icons with sparkle character "✦" for trust line

2. **Add audience filter tabs** between hero and preview grid
   - Three tabs: Parents | Therapists | Educators + an "All" default
   - State: `activeFilter` controls which cards display
   - Filter based on matching audience tag

3. **Replace dynamic DB fetch with 6 hardcoded placeholder resources**
   - Remove `supabase` import and `useEffect` fetch
   - Use static array with the 6 specified resources, each with title, description, type, and audience
   - Each card shows: icon thumbnail, title, description, audience pill tag, type pill tag, hover lock overlay

4. **Bottom CTA and footer** — already match spec, minor copy tweaks only

5. **Link routes** — Sign Up links to `/hub/signup`, Log In to `/hub/login` (already correct)

No database changes, no new files needed. Single file edit to `HubPreview.tsx`.

