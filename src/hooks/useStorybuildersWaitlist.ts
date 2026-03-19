import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistState {
  joined: boolean;
  referralCode: string;
  inviteCount: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = "sb_waitlist_ref";

export function useStorybuildersWaitlist() {
  const [state, setState] = useState<WaitlistState>({
    joined: false,
    referralCode: "",
    inviteCount: 0,
    totalCount: 0,
    loading: false,
    error: null,
  });

  // Load saved referral code from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((s) => ({
          ...s,
          joined: true,
          referralCode: parsed.referralCode || "",
          inviteCount: parsed.inviteCount || 0,
        }));
      } catch {}
    }
    // Fetch total count
    fetchTotalCount();
  }, []);

  const fetchTotalCount = async () => {
    const { data } = await supabase.rpc("get_storybuilders_waitlist_count");
    if (data !== null) {
      setState((s) => ({ ...s, totalCount: data }));
    }
  };

  // Get ref code from URL
  const getRefFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref") || undefined;
  };

  const joinWaitlist = useCallback(async (name: string, email: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const ref = getRefFromUrl();
      const { data, error } = await supabase.functions.invoke("storybuilders-signup", {
        body: { name, email, ref },
      });

      if (error) throw new Error("Failed to join");

      const result = data as {
        already_joined: boolean;
        referral_code: string;
        invite_count: number;
        total_count: number;
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ referralCode: result.referral_code, inviteCount: result.invite_count })
      );

      setState({
        joined: true,
        referralCode: result.referral_code,
        inviteCount: result.invite_count,
        totalCount: result.total_count,
        loading: false,
        error: result.already_joined ? "Welcome back! You're already on the Launch Team." : null,
      });

      return result;
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err.message || "Something went wrong" }));
      return null;
    }
  }, []);

  const referralLink = state.referralCode
    ? `${window.location.origin}/storybuilders?ref=${state.referralCode}`
    : "";

  return { ...state, joinWaitlist, referralLink, fetchTotalCount };
}
