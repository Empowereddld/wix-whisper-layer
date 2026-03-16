
## Plan: Simplify /hub/preview Embedded Signup Form

### Current State
The embedded signup form (Section 2) in `/hub/preview` currently collects:
- Name
- Email
- Role dropdown (with "Other" option requiring text specification)
- Interest checkboxes (7 predefined options + custom textarea)

The form validates all fields and redirects to `/hub/signup` on submission.

### Changes Required

**File: `src/pages/hub/HubPreview.tsx`**

1. **Remove State Variables**
   - Delete `selectedInterests`, `selectedRole`, `otherRole`, `customInterest` state
   - Delete `toggleInterest` function
   - Keep only `name`, `email`, and `errors` state

2. **Simplify Form Validation**
   - Remove role and interests validation
   - Keep only name and email validation in `handleFormSubmit`
   - Update error handling to only check name/email fields

3. **Update Form UI (lines 194-276)**
   - Keep Name input field (lines 195-199)
   - Keep Email input field (lines 200-204)
   - **Remove** Role dropdown section entirely (lines 205-231)
   - **Remove** Interests checkboxes section entirely (lines 232-269)
   - Update button text from "Access the Resource Hub" to "Get Instant Access"
   - Keep the "Free account. Instant access." subtext

4. **Update Heading/Subheading (optional refinement)**
   - Current heading works but could be simplified to match the minimal approach
   - Consider: "Create your free account" instead of "Create your free account to explore the DLD Resource Hub"

### Result
The embedded form becomes a lightweight lead capture that only asks for name and email, reducing friction. Users who click "Get Instant Access" are taken to `/hub/signup` where they complete account creation (password), then proceed to `/signup/role` for role and interests onboarding.

### Flow
```
/hub/preview (name + email only) 
  → /hub/signup (password creation) 
  → /signup/role (role + interests)
  → /hub (dashboard)
```
