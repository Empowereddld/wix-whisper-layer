# Fix: "Failed to save your info" on signup role step

## What's broken
The `prevent_profile_role_self_escalation` trigger on `public.profiles` blocks any non-admin from changing `role`. New profiles default to `role='parent'`, so the onboarding page (`/signup/role`) fails for every user who picks Therapist/SLP, Educator, School Leader, or Other — the update raises an exception and the UI shows "Failed to save your info. Please try again."

The escalation guard is still needed to prevent users from later promoting themselves, but it must allow the initial role selection during onboarding.

## Fix
Relax the trigger so a user may set their own role exactly once — during onboarding, i.e. while `OLD.interests IS NULL` (the flag we already use to detect that onboarding hasn't been completed). All other self role-changes remain blocked; admin changes remain allowed.

### Migration
Replace the trigger function with:

```sql
CREATE OR REPLACE FUNCTION public.prevent_profile_role_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Admins can always change roles
    IF public.has_role(auth.uid(), 'admin'::app_role) THEN
      RETURN NEW;
    END IF;
    -- Allow the user's first role selection during onboarding
    -- (interests is NULL until the onboarding form is submitted)
    IF auth.uid() = NEW.id AND OLD.interests IS NULL THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Only admins can change the role on a profile';
  END IF;
  RETURN NEW;
END;
$$;
```

No schema, RLS, grant, or client-code changes required.

## Validation
1. Sign up as a new user, pick "Therapist / SLP" on the onboarding step → submits successfully, profile row has `role='slp'`, `interests` populated, redirects to `/hub`.
2. Re-open `/signup/role` for the same account (or attempt a direct update) and change role → trigger blocks it with the same error as before.
3. Admin-initiated role change in the admin panel still works.
