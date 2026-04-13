-- SLP Referral Bonus System
-- Date: 2026-04-13

-- Add columns to storybuilders_waitlist for SLP tracking
ALTER TABLE public.storybuilders_waitlist
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'parent',
ADD COLUMN IF NOT EXISTS slp_verified BOOLEAN DEFAULT false;

-- Create SLP verification requests table
CREATE TABLE IF NOT EXISTS public.slp_verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  waitlist_id UUID NOT NULL REFERENCES public.storybuilders_waitlist(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  referred_by_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for verification requests
CREATE INDEX IF NOT EXISTS idx_slp_verification_requests_status
  ON public.slp_verification_requests(status);

CREATE INDEX IF NOT EXISTS idx_slp_verification_requests_email
  ON public.slp_verification_requests(user_email);

CREATE INDEX IF NOT EXISTS idx_slp_verification_requests_referred_by
  ON public.slp_verification_requests(referred_by_email);

-- RPC: Request SLP verification
CREATE OR REPLACE FUNCTION public.request_slp_verification(
  p_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_waitlist_id UUID;
  v_referred_by_email TEXT;
  v_result JSON;
BEGIN
  -- Get waitlist record
  SELECT id, referred_by_email INTO v_waitlist_id, v_referred_by_email
  FROM public.storybuilders_waitlist
  WHERE email = p_email;

  IF v_waitlist_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found in waitlist');
  END IF;

  -- Check if verification request already exists
  IF EXISTS (
    SELECT 1 FROM public.slp_verification_requests
    WHERE user_email = p_email AND status = 'pending'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Verification request already pending');
  END IF;

  -- Create verification request
  INSERT INTO public.slp_verification_requests (
    waitlist_id,
    user_email,
    referred_by_email,
    status
  )
  VALUES (v_waitlist_id, p_email, v_referred_by_email, 'pending');

  RETURN json_build_object(
    'success', true,
    'message', 'SLP verification request created'
  );
END;
$$;

-- RPC: Verify SLP referral and award bonus points
CREATE OR REPLACE FUNCTION public.verify_slp_referral(
  p_request_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request record;
  v_referrer_email TEXT;
  v_result JSON;
BEGIN
  -- Get verification request
  SELECT * INTO v_request
  FROM public.slp_verification_requests
  WHERE id = p_request_id;

  IF v_request IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Verification request not found');
  END IF;

  IF v_request.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Verification request already processed');
  END IF;

  -- Update user's SLP verified status
  UPDATE public.storybuilders_waitlist
  SET slp_verified = true, role = 'slp'
  WHERE email = v_request.user_email;

  -- Award bonus points to referrer if they exist
  IF v_request.referred_by_email IS NOT NULL THEN
    -- Award 50 bonus points (on top of normal 25)
    v_result := public.award_waitlist_points(
      v_request.referred_by_email,
      50,
      'slp_referral_verified',
      json_build_object(
        'verified_slp_email', v_request.user_email,
        'bonus_reason', 'SLP referral verification bonus'
      )
    );
  END IF;

  -- Update verification request status
  UPDATE public.slp_verification_requests
  SET status = 'verified', verified_at = now()
  WHERE id = p_request_id;

  RETURN json_build_object(
    'success', true,
    'message', 'SLP verified and referrer awarded bonus points',
    'bonus_points', 50
  );
END;
$$;

-- RPC: Reject SLP verification request
CREATE OR REPLACE FUNCTION public.reject_slp_verification(
  p_request_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request record;
BEGIN
  -- Get verification request
  SELECT * INTO v_request
  FROM public.slp_verification_requests
  WHERE id = p_request_id;

  IF v_request IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Verification request not found');
  END IF;

  IF v_request.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Verification request already processed');
  END IF;

  -- Update verification request status
  UPDATE public.slp_verification_requests
  SET status = 'rejected'
  WHERE id = p_request_id;

  RETURN json_build_object(
    'success', true,
    'message', 'SLP verification request rejected'
  );
END;
$$;

-- RPC: Get pending SLP verification requests
CREATE OR REPLACE FUNCTION public.get_pending_slp_verifications()
RETURNS TABLE (
  id UUID,
  user_email TEXT,
  referred_by_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id,
    user_email,
    referred_by_email,
    created_at
  FROM public.slp_verification_requests
  WHERE status = 'pending'
  ORDER BY created_at DESC;
$$;
