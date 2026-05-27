
CREATE OR REPLACE FUNCTION public.assign_founder_slot(p_user_id uuid, p_cap integer DEFAULT 20)
RETURNS TABLE(slot_number integer, already_had boolean, cap_reached boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing integer;
  v_next integer;
  v_points integer;
  v_deleted timestamptz;
BEGIN
  -- Serialize all slot assignments through a single advisory lock.
  PERFORM pg_advisory_xact_lock(hashtext('storypros_founder_slot_assign'));

  SELECT founder_slot_number, points, deleted_at
    INTO v_existing, v_points, v_deleted
  FROM public.storybuilders_waitlist
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND OR v_deleted IS NOT NULL THEN
    RETURN QUERY SELECT NULL::integer, false, false;
    RETURN;
  END IF;

  IF v_existing IS NOT NULL THEN
    RETURN QUERY SELECT v_existing, true, false;
    RETURN;
  END IF;

  IF COALESCE(v_points, 0) < 500 THEN
    RETURN QUERY SELECT NULL::integer, false, false;
    RETURN;
  END IF;

  SELECT COALESCE(MAX(founder_slot_number), 0) + 1
    INTO v_next
  FROM public.storybuilders_waitlist
  WHERE founder_slot_number IS NOT NULL;

  IF v_next > p_cap THEN
    RETURN QUERY SELECT NULL::integer, false, true;
    RETURN;
  END IF;

  UPDATE public.storybuilders_waitlist
  SET founder_slot_number = v_next
  WHERE id = p_user_id;

  RETURN QUERY SELECT v_next, false, false;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_founder_slot(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_founder_slot(uuid, integer) TO service_role;
