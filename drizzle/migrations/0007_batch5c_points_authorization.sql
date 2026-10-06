-- Ledger guaranteeing each referred member awards referral points at most once.
CREATE TABLE public.referral_awards (
  referred_id uuid PRIMARY KEY REFERENCES public.storybuilders_waitlist(id) ON DELETE CASCADE,
  referrer_id uuid REFERENCES public.storybuilders_waitlist(id) ON DELETE SET NULL,
  points_awarded integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.referral_awards TO service_role;
ALTER TABLE public.referral_awards ENABLE ROW LEVEL SECURITY;

-- Existing referred members already credited their referrer at signup: record them so they never award again.
INSERT INTO public.referral_awards (referred_id, referrer_id, points_awarded, created_at)
SELECT m.id, r.id, NULL, m.created_at
FROM public.storybuilders_waitlist m
LEFT JOIN public.storybuilders_waitlist r ON r.referral_code = m.referred_by_code
WHERE m.referred_by_code IS NOT NULL
ON CONFLICT DO NOTHING;

-- Fixed-amount, idempotent referral award, only after the referred member is verified.
CREATE OR REPLACE FUNCTION public.award_referral_for_member(p_member_id uuid)
RETURNS TABLE(awarded boolean, referrer_email text, referrer_name text, member_name text, referrer_new_points integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  m RECORD; r RECORD; v_award integer; v_inserted uuid;
BEGIN
  SELECT id, name, email, referred_by_code, email_verified, is_speech_professional, deleted_at
    INTO m FROM public.storybuilders_waitlist WHERE id = p_member_id FOR UPDATE;
  IF NOT FOUND OR m.deleted_at IS NOT NULL OR m.email_verified IS NOT TRUE OR m.referred_by_code IS NULL THEN
    RETURN QUERY SELECT false, NULL::text, NULL::text, NULL::text, NULL::integer; RETURN;
  END IF;

  SELECT id, name, email, points, first_referral_bonus_awarded INTO r
  FROM public.storybuilders_waitlist
  WHERE referral_code = m.referred_by_code AND deleted_at IS NULL
  FOR UPDATE;

  -- Claim the one-time slot first; a concurrent or repeat call inserts nothing.
  INSERT INTO public.referral_awards (referred_id, referrer_id, points_awarded)
  VALUES (m.id, r.id, 0)
  ON CONFLICT (referred_id) DO NOTHING
  RETURNING referred_id INTO v_inserted;

  IF v_inserted IS NULL OR r.id IS NULL OR r.id = m.id OR lower(r.email) = lower(m.email) THEN
    RETURN QUERY SELECT false, NULL::text, NULL::text, NULL::text, NULL::integer; RETURN;
  END IF;

  v_award := public.apply_tier_multiplier(r.points, 25);
  IF NOT r.first_referral_bonus_awarded THEN
    v_award := v_award + public.apply_tier_multiplier(r.points, 10);
  END IF;
  IF m.is_speech_professional THEN
    v_award := v_award + public.apply_tier_multiplier(r.points, 25);
  END IF;

  UPDATE public.storybuilders_waitlist
  SET points = points + v_award, invite_count = invite_count + 1, first_referral_bonus_awarded = true
  WHERE id = r.id;
  UPDATE public.referral_awards SET points_awarded = v_award WHERE referred_id = m.id;

  RETURN QUERY SELECT true, r.email, r.name, m.name, r.points + v_award;
END;
$$;

-- Server-only point and lookup functions.
REVOKE EXECUTE ON FUNCTION public.award_referral_for_member(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.award_referral(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.award_slp_referral_bonus(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_share(text, text, integer, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.record_referral_click(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_waitlist_and_award(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_waitlist_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_waitlist_invites(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_founder_slot(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_waitlist_by_referral(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.award_referral_for_member(uuid) TO service_role;

-- Admin-only functions (they check has_role internally): signed-in only.
REVOKE EXECUTE ON FUNCTION public.verify_speech_professional(uuid, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.reject_speech_professional(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.reset_speech_professional_rejection(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_soft_delete_waitlist_entry(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_restore_waitlist_entry(uuid) FROM PUBLIC, anon;

-- Signups go only through the signup service.
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.storybuilders_waitlist;
REVOKE INSERT ON public.storybuilders_waitlist FROM anon, authenticated;
