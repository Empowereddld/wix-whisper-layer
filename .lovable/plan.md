## Add Role to Story Pros Signup + Editable Profile Dropdown

### What changes for users

**At signup (`/storypros`):**
A required "I am a..." dropdown appears under name + email with 3 options:
- Parent / Caregiver
- Speech Professional
- Other

If "Other" is selected, a second text input appears: **"Tell us a bit more"** (required, max 60 chars).

**On the dashboard profile button (top-right):**
- Add a small **"Profile"** label under the user icon so it's discoverable.

**Inside the profile dropdown (after verification):**
- Display Name → Email → **Role** (with the friendly label, e.g. "Other: Grandparent").
- A small "Edit" pencil opens a modal where the user can change role + the "Other" detail. Saves immediately and refreshes the dashboard.
- Existing rows with no role on file show "Add your role" prompting them to set it.
- Speech Professional verification pill (✓ / pending) only renders when role is `speech_pro`, so it doesn't duplicate.

### Database

Add two nullable columns to `storybuilders_waitlist`:
- `role` text — values: `parent` | `speech_pro` | `other`
- `role_other` text — only populated when `role = 'other'`, max 60 chars (validated app-side)

Both nullable so the 800+ existing rows are unaffected.

### Frontend changes

**`src/lib/storypros-roles.ts`** (new):
- Role codes, labels, and a `formatRole(role, roleOther)` helper that returns "Parent / Caregiver", "Speech Professional", or "Other: {detail}".

**`src/pages/StoryBuilders.tsx`** (signup form):
- Add `role` and `roleOther` state, render `<Select>` under email.
- Conditionally render "Tell us a bit more" `<Input>` when role is `other`.
- Block submit until role is chosen (and `roleOther` is non-empty when role is `other`).
- Pass `{ role, roleOther }` into `wl.joinWaitlist()`.

**`src/hooks/useStorybuildersWaitlist.ts`:**
- Add `role` and `roleOther` to `WaitlistState` and the localStorage snapshot.
- Update `joinWaitlist(name, email, { role, roleOther })` to insert role + role_other and set `is_speech_professional = role === 'speech_pro'`.
- Add `updateRole({ role, roleOther })` that updates the row, keeps `is_speech_professional` flag in sync, refreshes stats. Never clears `speech_professional_verified` or claws back the +50 bonus.
- Include `role` and `role_other` in the `refreshStats()` SELECT.

**`src/pages/StoryProsDashboard.tsx`:**
- Wrap profile avatar in a vertical flex with "Profile" label below.
- In `DropdownMenuLabel`, replace the current Speech Professional pill with a Role line; show Speech Professional pill only when role is `speech_pro`.
- Add edit Dialog: `<Select>` for role + conditional `<Input>` for "Other" detail, Save button calls `wl.updateRole()` and toasts success.

**`src/pages/AdminStoryBuilders.tsx`:**
- Add a "Role" column to the admin table using `formatRole(...)` so "Other" entries show their custom detail inline.

### Validation & safety

- Client-side: role required, `roleOther` required when role = other, trimmed, max 60 chars.
- Edge: rely on existing `update-waitlist-profile` edge function pattern (extend it to accept `role` + `role_other`) so the client never writes directly. Service-role validates the same rules and rejects unknown role codes.
- Switching away from Other clears `role_other`. Switching to Other pre-fills with previous answer if any.

### Files touched

```text
supabase migration                           (add role, role_other columns)
supabase/functions/update-waitlist-profile   (extend to accept role fields)
src/lib/storypros-roles.ts                   (new — codes, labels, formatter)
src/pages/StoryBuilders.tsx                  (signup form + state)
src/hooks/useStorybuildersWaitlist.ts        (state + joinWaitlist + updateRole)
src/pages/StoryProsDashboard.tsx             (Profile label, role row, edit modal)
src/pages/AdminStoryBuilders.tsx             (Role column)
```
