

## Plan: Remove Embedded Signup Form from /hub/preview

### Overview
Remove Section 2 (the embedded signup form) entirely from the HubPreview landing page. All signup CTAs should link directly to `/hub/signup`.

### Changes Required

**File: `src/pages/hub/HubPreview.tsx`**

1. **Remove Form State & Logic (lines 96-113)**
   - Delete `name`, `email`, `errors` state variables
   - Delete `handleFormSubmit` function
   - Remove `useNavigate` import (no longer needed)

2. **Remove Unused Imports**
   - Remove `Input` component import (line 9)
   - Remove `Label` component import (line 10)

3. **Delete Section 2 Entirely (lines 153-184)**
   - Remove the entire "Signup Form" section
   - The page will flow directly from Hero → Community Stats

### Result
The page will have three "Get Instant Access" buttons linking to `/hub/signup`:
1. Hero section (line 142-145) — already exists
2. Resource cards hover overlay (line 252) — already exists
3. Final CTA section (line 299-302) — already exists

### Files Modified
- `src/pages/hub/HubPreview.tsx`

