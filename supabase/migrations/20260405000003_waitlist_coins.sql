-- Add coin system columns
ALTER TABLE storybuilders_waitlist
ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inventory JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS coin_pack_1_claimed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS coin_pack_2_claimed BOOLEAN DEFAULT false;

-- RPC to award coins
CREATE OR REPLACE FUNCTION award_story_coins(p_waitlist_id UUID, p_coins INTEGER, p_reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_coins INTEGER;
BEGIN
  UPDATE storybuilders_waitlist
  SET coins = coins + p_coins
  WHERE id = p_waitlist_id
  RETURNING coins INTO v_new_coins;

  -- Log the event
  INSERT INTO waitlist_events (waitlist_id, event_type, metadata)
  VALUES (p_waitlist_id, 'coins_earned', jsonb_build_object('amount', p_coins, 'reason', p_reason, 'new_total', v_new_coins));

  RETURN v_new_coins;
END;
$$;

-- RPC to claim a reward
CREATE OR REPLACE FUNCTION claim_waitlist_reward(p_waitlist_id UUID, p_reward_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE storybuilders_waitlist
  SET inventory = inventory || jsonb_build_object(p_reward_id, jsonb_build_object('claimed', true, 'claimedAt', now()::text))
  WHERE id = p_waitlist_id;

  INSERT INTO waitlist_events (waitlist_id, event_type, metadata)
  VALUES (p_waitlist_id, 'reward_claimed', jsonb_build_object('reward_id', p_reward_id));

  RETURN true;
END;
$$;

-- RPC to redeem a coin pack
CREATE OR REPLACE FUNCTION redeem_coin_pack(p_waitlist_id UUID, p_pack_level INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cost INTEGER;
  v_current_coins INTEGER;
BEGIN
  v_cost := CASE WHEN p_pack_level = 1 THEN 50 WHEN p_pack_level = 2 THEN 150 ELSE 0 END;

  SELECT coins INTO v_current_coins FROM storybuilders_waitlist WHERE id = p_waitlist_id;

  IF v_current_coins < v_cost THEN
    RETURN false;
  END IF;

  UPDATE storybuilders_waitlist
  SET coins = coins - v_cost,
      coin_pack_1_claimed = CASE WHEN p_pack_level = 1 THEN true ELSE coin_pack_1_claimed END,
      coin_pack_2_claimed = CASE WHEN p_pack_level = 2 THEN true ELSE coin_pack_2_claimed END
  WHERE id = p_waitlist_id;

  INSERT INTO waitlist_events (waitlist_id, event_type, metadata)
  VALUES (p_waitlist_id, 'coin_pack_redeemed', jsonb_build_object('pack_level', p_pack_level, 'cost', v_cost));

  RETURN true;
END;
$$;
