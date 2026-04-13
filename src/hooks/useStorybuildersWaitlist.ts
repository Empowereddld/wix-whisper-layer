import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getTierForPoints,
  getTierName,
  getTierColor,
  getNextTierThreshold,
  getProgressToNextTier,
  generateReferralLink,
} from "@/lib/waitlist-utils";

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  timestamp: number;
}

export interface TierInfo {
  tier: number;
  name: string;
  color: string;
  nextTierThreshold: number | null;
  progressToNextTier: number;
}

export interface WaitlistState {
  joined: boolean;
  referralCode: string;
  inviteCount: number;
  totalCount: number;
  points: number;
  currentTier: number;
  queuePosition: number | null;
  emailVerified: boolean;
  badges: string[];
  streakDays: number;
  shareCount: number;
  clickCount: number;
  loading: boolean;
  error: string | null;
  notifications: Notification[];
}

interface JoinWaitlistResponse {
  already_joined: boolean;
  referral_code: string;
  invite_count: number;
  points: number;
  current_tier: number;
  queue_position?: number;
  total_count: number;
}

const STORAGE_KEY = "sb_waitlist_state";
const REF_PARAM = "ref";

export function useStorybuildersWaitlist() {
  const [state, setState] = useState<WaitlistState>({
    joined: false,
    referralCode: "",
    inviteCount: 0,
    totalCount: 0,
    points: 0,
    currentTier: 0,
    queuePosition: null,
    emailVerified: false,
    badges: [],
    streakDays: 0,
    shareCount: 0,
    clickCount: 0,
    loading: false,
    error: null,
    notifications: [],
  });

  const realtimeSubscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Initialize from localStorage and fetch fresh stats
  useEffect(() => {
    const initializeState = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<WaitlistState>;
          setState((s) => ({
            ...s,
            ...parsed,
            loading: true,
            notifications: [],
          }));

          if (parsed.referralCode) {
            await refreshStatsInternal(parsed.referralCode);
          }
        } catch (err) {
          console.error("Failed to parse stored state:", err);
        }
      }

      await fetchTotalCount();
    };

    initializeState();

    const channel = supabase.channel("storybuilders_waitlist_changes");
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "storybuilders_waitlist",
        },
        () => {
          fetchTotalCount();
        }
      )
      .subscribe();

    realtimeSubscriptionRef.current = channel;

    return () => {
      if (realtimeSubscriptionRef.current) {
        supabase.removeChannel(realtimeSubscriptionRef.current);
      }
    };
  }, []);

  const getRefFromUrl = useCallback((): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get(REF_PARAM) || undefined;
  }, []);

  const fetchTotalCount = useCallback(async () => {
    try {
      const { data } = await supabase.rpc("get_storybuilders_waitlist_count");
      if (data !== null) {
        setState((s) => ({ ...s, totalCount: data }));
      }
    } catch (err) {
      console.error("Failed to fetch total count:", err);
    }
  }, []);

  const refreshStatsInternal = useCallback(async (referralCode: string) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      // Fetch user data from storybuilders_waitlist using referral code
      const { data: userData, error } = await supabase
        .from("storybuilders_waitlist")
        .select("*")
        .eq("referral_code", referralCode)
        .single();

      if (error || !userData) {
        throw new Error("User not found");
      }

      // Count referrals
      const { count: referralCount } = await supabase
        .from("storybuilders_waitlist")
        .select("id", { count: "exact", head: true })
        .eq("referred_by_code", referralCode);

      const { data: totalData } = await supabase.rpc("get_storybuilders_waitlist_count");

      const userPoints = (userData as any).points || 0;
      setState((s) => ({
        ...s,
        inviteCount: userData.invite_count || 0,
        totalCount: totalData || s.totalCount,
        points: userPoints,
        currentTier: getTierForPoints(userPoints),
        loading: false,
      }));
    } catch (err) {
      console.error("Failed to refresh stats:", err);
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const refreshStats = useCallback(async () => {
    if (state.referralCode) {
      await refreshStatsInternal(state.referralCode);
    }
  }, [state.referralCode, refreshStatsInternal]);

  const joinWaitlist = useCallback(
    async (name: string, email: string): Promise<JoinWaitlistResponse | null> => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const ref = getRefFromUrl();
        const { data, error } = await supabase.functions.invoke("storybuilders-signup", {
          body: { name, email, ref },
        });

        if (error) throw new Error(error.message || "Failed to join");

        const result = data as JoinWaitlistResponse;

        const newState: Partial<WaitlistState> = {
          joined: true,
          referralCode: result.referral_code,
          inviteCount: result.invite_count,
          points: result.points || 0,
          currentTier: result.current_tier || getTierForPoints(result.points || 0),
          queuePosition: result.queue_position || null,
          totalCount: result.total_count,
          loading: false,
        };

        if (result.already_joined) {
          newState.error = "Welcome back! You're already on the Launch Team.";
        }

        setState((s) => ({ ...s, ...newState }));

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            joined: true,
            referralCode: result.referral_code,
            inviteCount: result.invite_count,
            points: newState.points,
            currentTier: newState.currentTier,
            queuePosition: newState.queuePosition,
          })
        );

        addNotification("success", "Successfully joined the waitlist!");
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setState((s) => ({ ...s, loading: false, error: errorMessage }));
        addNotification("error", errorMessage);
        return null;
      }
    },
    [getRefFromUrl]
  );

  const trackShare = useCallback(
    async (platform: string): Promise<boolean> => {
      if (!state.referralCode) {
        addNotification("error", "You must join the waitlist first");
        return false;
      }
      addNotification("success", `Shared on ${platform}!`);
      return true;
    },
    [state.referralCode]
  );

  const trackClick = useCallback(async (): Promise<boolean> => {
    if (!state.referralCode) return false;
    try {
      await supabase.functions.invoke("track-referral-click", {
        body: { referral_code: state.referralCode },
      });
      return true;
    } catch (err) {
      console.error("Failed to track click:", err);
      return false;
    }
  }, [state.referralCode]);

  const resendVerification = useCallback(async (): Promise<boolean> => {
    if (!state.referralCode) {
      addNotification("error", "You must join the waitlist first");
      return false;
    }
    addNotification("success", "Verification email sent!");
    return true;
  }, [state.referralCode]);

  const submitSuggestion = useCallback(
    async (title: string, description: string, category: string): Promise<{ success: boolean; message: string }> => {
      // TODO: Wire up to suggestions database table when schema is ready
      console.warn("submitSuggestion not yet implemented - suggestions feature coming soon");
      addNotification("info", "Coming soon - suggestions feature is under development");
      return { success: false, message: "Coming soon" };
    },
    []
  );

  const voteSuggestion = useCallback(
    async (suggestionId: string): Promise<{ success: boolean; message: string }> => {
      // TODO: Wire up to voting system in database when schema is ready
      console.warn("voteSuggestion not yet implemented - voting feature coming soon");
      addNotification("info", "Coming soon - voting feature is under development");
      return { success: false, message: "Coming soon" };
    },
    []
  );

  const fetchLeaderboard = useCallback(async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from("storybuilders_waitlist")
        .select("email, name, invite_count, referral_code")
        .order("invite_count", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((d) => ({
        email: d.email,
        name: d.name,
        points: (d as any).points || 0,
        current_tier: getTierForPoints((d as any).points || 0),
        invite_count: d.invite_count,
      }));
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      return [];
    }
  }, []);

  const fetchActivityFeed = useCallback(async (limit = 20) => {
    try {
      const { data, error } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((d) => ({
        id: d.id,
        user_name: d.name,
        event_type: "joined",
        points_awarded: 10,
        created_at: d.created_at,
      }));
    } catch (err) {
      console.error("Failed to fetch activity feed:", err);
      return [];
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  const addNotification = useCallback(
    (type: Notification["type"], message: string) => {
      const id = Math.random().toString(36).substring(7);
      const notification: Notification = { id, type, message, timestamp: Date.now() };

      setState((s) => ({
        ...s,
        notifications: [...s.notifications, notification],
      }));

      setTimeout(() => {
        dismissNotification(id);
      }, 5000);
    },
    [dismissNotification]
  );

  const referralLink = state.referralCode ? generateReferralLink(state.referralCode) : "";

  const tierInfo = useCallback((): TierInfo => {
    const tier = getTierForPoints(state.points);
    const nextThreshold = getNextTierThreshold(tier);

    return {
      tier,
      name: getTierName(tier),
      color: getTierColor(tier),
      nextTierThreshold: nextThreshold,
      progressToNextTier: getProgressToNextTier(state.points, tier),
    };
  }, [state.points]);

  const autoJoinFromAuth = useCallback(
    async (user: { id: string; email: string }, profile: { first_name: string }) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<WaitlistState>;
          if (parsed.referralCode) return;
        } catch (err) {
          console.error("Failed to parse stored state:", err);
        }
      }
      const result = await joinWaitlist(profile.first_name, user.email);
      return result;
    },
    [joinWaitlist]
  );

  const linkAuthAccount = useCallback(
    async (userId: string, email: string): Promise<boolean> => {
      try {
        const { data: existing } = await supabase
          .from("storybuilders_waitlist")
          .select("id")
          .eq("email", email.toLowerCase().trim())
          .maybeSingle();

        if (!existing) {
          addNotification("error", "No waitlist entry found for this email");
          return false;
        }

        addNotification("success", "Account linked successfully!");
        return true;
      } catch (err) {
        console.error("Error linking auth account:", err);
        addNotification("error", "An error occurred while linking your account");
        return false;
      }
    },
    []
  );

  return {
    ...state,
    joinWaitlist,
    refreshStats,
    trackShare,
    trackClick,
    resendVerification,
    submitSuggestion,
    voteSuggestion,
    fetchLeaderboard,
    fetchActivityFeed,
    dismissNotification,
    referralLink,
    tierInfo,
    autoJoinFromAuth,
    linkAuthAccount,
  };
}
