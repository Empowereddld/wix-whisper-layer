-- Soft-delete Phase 4 test fixtures and release their founder slots
UPDATE public.storybuilders_waitlist
SET deleted_at = now(),
    deleted_reason = 'phase4 test cleanup',
    founder_slot_number = NULL,
    email = email || '.deleted.' || extract(epoch from now())::bigint
WHERE email LIKE 'phase4-%@empowereddld.test'
  AND deleted_at IS NULL;