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

interface UserStats {
  points: number;
  current_tier: number;
  queue_position: number | null;
  email_verified: boolean;
  badges: string[];
  streak_days: number;
  share_count: number;
  click_count: number;
  invite_count: number;
  total_count: number;
}

interface WaitlistSuggestion {
  title: string;
  description: string;
  category: string;
}

interface VoteSuggestionResponse {
  success: boolean;
}

interface LeaderboardEntry {
  email: string;
  name: string;
  points: number;
  current_tier: number;
  invite_count: number;
}

interface ActivityEntry {
  id: string;
  user_name: string;
  event_type: string;
  points_awarded: number;
  created_at: string;
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

          // Fetch fresh stats if joined
          if (parsed.referralCode) {
            await refreshStats();
          }
        } catch (err) {
          console.error("Failed to parse stored state:", err);
        }
      }

      // Always fetch total count
      await fetchTotalCount();
    };

    initializeState();

    // Set up realtime subscription
    const setupRealtimeSubscription = () => {
      if (realtimeSubscriptionRef.current) {
        supabase.removeChannel(realtimeSubscriptionRef.current);
      }

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
            // Refresh stats when the table changes
            if (state.referralCode) {
              refreshStats();
            }
          }
        )
        .subscribe();

      realtimeSubscriptionRef.current = channel;
    };

    setupRealtimeSubscription();

    return () => {
      if (realtimeSubscriptionRef.current) {
        supabase.removeChannel(realtimeSubscriptionRef.current);
      }
    };
  }, []);

  // Get referral code from URL
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

  const refreshStats = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const email = state.referralCode
        ? (
            await supabase
              .from("storybuilders_waitlist")
              .select("email")
              .eq("referral_code", state.referralCode)
              .single()
          ).data?.email
        : null;

      if (!email) {
        throw new Error("Email not found");
      }

      const { data, error } = await supabase.rpc("get_waitlist_user_stats", {
        p_email: email,
      });

      if (error) throw error;

      const stats = data as UserStats | null;
      if (stats) {
        setState((s) => ({
          ...s,
          points: stats.points,
          currentTier: stats.current_tier,
          queuePosition: stats.queue_position,
          emailVerified: stats.email_verified,
          badges: stats.badges || [],
          streakDays: stats.streak_days,
          shareCount: stats.share_count,
          clickCount: stats.click_count,
          inviteCount: stats.invite_count,
          totalCount: stats.total_count,
          loading: false,
        }));
      }
    } catch (err) {
      console.error("Failed to refresh stats:", err);
      setState((s) => ({ ...s, loading: false }));
    }
  }, [state.referralCode]);

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
          points: result.points,
          currentTier: result.current_tier,
          queuePosition: result.queue_position || null,
          totalCount: result.total_count,
          loading: false,
        };

        if (result.already_joined) {
          newState.error = "Welcome back! You're already on the Launch Team.";
        }

        setState((s) => ({
          ...s,
          ...newState,
        }));

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            joined: true,
            referralCode: result.referral_code,
            inviteCount: result.invite_count,
            points: result.points,
            currentTier: result.current_tier,
            queuePosition: result.queue_position || null,
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

      try {
        const { data: userData } = await supabase
          .from("storybuilders_waitlist")
          .select("email")
          .eq("referral_code", state.referralCode)
          .single();

        if (!userData) throw new Error("User not found");

        // Call edge function to track share
        const { error } = await supabase.functions.invoke("track-share", {
          body: {
            email: userData.email,
            platform,
          },
        });

        if (error) throw error;

        addNotification("success", `Shared on ${platform}!`);
        await refreshStats();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to track share";
        addNotification("error", errorMessage);
        return false;
      }
    },
    [state.referralCode, refreshStats]
  );

  const trackClick = useCallback(async (): Promise<boolean> => {
    if (!state.referralCode) {
      addNotification("error", "You must join the waitlist first");
      return false;
    }

    try {
      const { data: userData } = await supabase
        .from("storybuilders_waitlist")
        .select("email")
        .eq("referral_code", state.referralCode)
        .single();

      if (!userData) throw new Error("User not found");

      const { error } = await supabase.functions.invoke("track-referral-click", {
        body: {
          email: userData.email,
        },
      });

      if (error) throw error;

      await refreshStats();
      return true;
    } catch (err) {
      console.error("Failed to track click:", err);
      return false;
    }
  }, [state.referralCode, refreshStats]);

  const resendVerification = useCallback(async (): Promise<boolean> => {
    if (!state.referralCode) {
      addNotification("error", "You must join the waitlist first");
      return false;
    }

    try {
      const { data: userData } = await supabase
        .from("storybuilders_waitlist")
        .select("email, name")
        .eq("referral_code", state.referralCode)
        .single();

      if (!userData) throw new Error("User not found");

      const { error } = await supabase.functions.invoke("send-waitlist-email", {
        body: {
          template: "verification_resend",
          to: userData.email,
          data: {
            name: userData.name.split(" ")[0],
          },
        },
      });

      if (error) throw error;

      addNotification("success", "Verification email sent!");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send verification";
      addNotification("error", errorMessage);
      return false;
    }
  }, [state.referralCode]);

  const submitSuggestion = useCallback(
    async (
      title: string,
      description: string,
      category: string
    ): Promise<boolean> => {
      if (!state.referralCode) {
        addNotification("error", "You must join the waitlist first");
        return false;
      }

      try {
        const { data: userData } = await supabase
          .from("storybuilders_waitlist")
          .select("email")
          .eq("referral_code", state.referralCode)
          .single();

        if (!userData) throw new Error("User not found");

        const { error } = await supabase.from("waitlist_suggestions").insert({
          user_email: userData.email,
          title,
          description,
          category,
        });

        if (error) throw error;

        addNotification("success", "Suggestion submitted! Thank you for the feedback.");
        await refreshStats();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to submit suggestion";
        addNotification("error", errorMessage);
        return false;
      }
    },
    [state.referralCode, refreshStats]
  );

  const voteSuggestion = useCallback(
    async (suggestionId: string): Promise<boolean> => {
      if (!state.referralCode) {
        addNotification("error", "You must join the waitlist first");
        return false;
      }

      try {
        const { data: userData } = await supabase
          .from("storybuilders_waitlist")
          .select("id")
          .eq("referral_code", state.referralCode)
          .single();

        if (!userData) throw new Error("User not found");

        const { error } = await supabase.from("waitlist_suggestion_votes").insert({
          suggestion_id: suggestionId,
          user_id: userData.id,
        });

        if (error) throw error;

        addNotification("success", "Vote recorded!");
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to vote on suggestion";
        // Silently fail on duplicate vote
        if (errorMessage.includes("duplicate")) {
          return false;
        }
        addNotification("error", errorMessage);
        return false;
      }
    },
    [state.referralCode]
  );

  const fetchLeaderboard = useCallback(
    async (limit = 10): Promise<LeaderboardEntry[]> => {
      try {
        const { data, error } = await supabase.rpc("get_waitlist_leaderboard", {
          p_limit: limit,
        });

        if (error) throw error;
        return (data || []) as LeaderboardEntry[];
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        return [];
      }
    },
    []
  );

  const fetchActivityFeed = useCallback(async (limit = 20): Promise<ActivityEntry[]> => {
    try {
      const { data, error } = await supabase.rpc("get_waitlist_activity", {
        p_limit: limit,
      });

      if (error) throw error;
      return (data || []) as ActivityEntry[];
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
      const notification: Notification = {
        id,
        type,
        message,
        timestamp: Date.now(),
      };

      setState((s) => ({
        ...s,
        notifications: [...s.notifications, notification],
      }));

      // Auto-dismiss after 5 seconds
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

  // Auto-join from authenticated user data
  const autoJoinFromAuth = useCallback(
    async (user: { id: string; email: string }, profile: { first_name: string }) => {
      // Check if already joined
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<WaitlistState>;
          if (parsed.referralCode) {
            return; // Already joined
          }
        } catch (err) {
          console.error("Failed to parse stored state:", err);
        }
      }

      // Auto-join with profile info
      const result = await joinWaitlist(profile.first_name, user.email);
      return result;
    },
    [joinWaitlist]
  );

  // Link auth account to waitlist entry by email
  const linkAuthAccount = useCallback(
    async (userId: string, email: string): Promise<boolean> => {
      try {
        const { error } = await supabase.rpc("link_waitlist_to_auth", {
          p_user_id: userId,
          p_email: email,
        });

        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Failed to link auth account:", err);
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
