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
import { REPEATABLE_POINTS } from "@/lib/waitlist-constants";

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
  name: string;
  email: string;
  referralCode: string;
  inviteCount: number;
  totalCount: number;
  points: number;
  currentTier: number;
  queuePosition: number | null;
  emailVerified: boolean;
  badges: string[];

  shareCount: number;
  clickCount: number;
  socialClaims: { instagram: boolean; facebook: boolean; youtube: boolean };
  isSpeechProfessional: boolean;
  speechProfessionalVerified: boolean;
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
const REF_STORAGE_KEY = "sp_pending_ref";
const REF_TTL_DAYS = 30;

export function useStorybuildersWaitlist() {
  const [state, setState] = useState<WaitlistState>({
    joined: false,
    name: "",
    email: "",
    referralCode: "",
    inviteCount: 0,
    totalCount: 0,
    points: 0,
    currentTier: 0,
    queuePosition: null,
    emailVerified: false,
    badges: [],

    shareCount: 0,
    clickCount: 0,
    socialClaims: { instagram: false, facebook: false, youtube: false },
    isSpeechProfessional: false,
    speechProfessionalVerified: false,
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

  // Per-user realtime + tab-focus sync.
  // If this user verifies their email (or earns points) on another device,
  // we want THIS device to update without a manual reload. We subscribe to
  // postgres_changes filtered by their referral_code, and also refetch
  // whenever the tab regains focus (safety net for dropped sockets / mobile
  // tab suspension).
  useEffect(() => {
    const code = state.referralCode;
    if (!code) return;

    const userChannel = supabase
      .channel(`storybuilders_waitlist_user_${code}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "storybuilders_waitlist",
          filter: `referral_code=eq.${code}`,
        },
        () => {
          refreshStatsInternal(code);
        }
      )
      .subscribe();

    const handleVisible = () => {
      if (document.visibilityState === "visible") {
        refreshStatsInternal(code);
      }
    };
    document.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleVisible);

    return () => {
      supabase.removeChannel(userChannel);
      document.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleVisible);
    };
  }, [state.referralCode, refreshStatsInternal]);

  const getRefFromUrl = useCallback((): string | undefined => {
    if (typeof window === "undefined") return undefined;
    // 1. Prefer URL param if present (and persist it for later sessions)
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(REF_PARAM);
    if (fromUrl) {
      try {
        localStorage.setItem(
          REF_STORAGE_KEY,
          JSON.stringify({ code: fromUrl, ts: Date.now() })
        );
      } catch {}
      return fromUrl;
    }
    // 2. Fall back to persisted ref (cross-session / cross-device-after-login attribution)
    try {
      const saved = localStorage.getItem(REF_STORAGE_KEY);
      if (saved) {
        const { code, ts } = JSON.parse(saved) as { code: string; ts: number };
        const ageDays = (Date.now() - ts) / (1000 * 60 * 60 * 24);
        if (code && ageDays < REF_TTL_DAYS) return code;
        // expired
        localStorage.removeItem(REF_STORAGE_KEY);
      }
    } catch {}
    return undefined;
  }, []);

  // Capture ?ref= into localStorage on first load even if user doesn't sign up yet
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(REF_PARAM);
    if (fromUrl) {
      try {
        localStorage.setItem(
          REF_STORAGE_KEY,
          JSON.stringify({ code: fromUrl, ts: Date.now() })
        );
      } catch {}
    }
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
      const { data: userData, error } = await supabase
        .from("storybuilders_waitlist")
        .select("*")
        .eq("referral_code", referralCode)
        .single();

      if (error || !userData) {
        throw new Error("User not found");
      }

      const { data: totalData } = await supabase.rpc("get_storybuilders_waitlist_count");

      const ud = userData as any;
      const userPoints = ud.points || 0;
      const claims = (ud.social_claims as Record<string, unknown>) || {};

      // Compute waitlist position: 1 + number of people who joined before this user.
      // Order by created_at ascending = "joined order". Cheap count(*) head query.
      let queuePosition: number | null = null;
      if (ud.created_at) {
        const { count } = await supabase
          .from("storybuilders_waitlist")
          .select("id", { count: "exact", head: true })
          .lt("created_at", ud.created_at);
        if (typeof count === "number") queuePosition = count + 1;
      }

      // Detect a tier crossing vs the previous client state and trigger
      // the dispatcher inline so the unlock email feels instant instead of
      // waiting for the next cron tick. The Edge Function is idempotent
      // (guards on emailN_sent_at), so duplicate calls are safe.
      let crossedTier = false;
      // Detect a referral conversion (invite_count went up since last refresh)
      // so we can show a celebratory toast in the dashboard.
      let newReferrals = 0;
      setState((s) => {
        const newTier = getTierForPoints(userPoints);
        if (newTier > (s.currentTier || 0) && newTier >= 2 && ud.email_verified) {
          crossedTier = true;
        }
        const incomingInvites = ud.invite_count || 0;
        if (s.joined && incomingInvites > (s.inviteCount || 0)) {
          newReferrals = incomingInvites - (s.inviteCount || 0);
        }
        return {
          ...s,
          name: ud.name || s.name,
          email: ud.email || s.email,
          joined: true,
          referralCode: ud.referral_code || s.referralCode,
          inviteCount: incomingInvites,
          totalCount: totalData || s.totalCount,
          queuePosition: queuePosition ?? s.queuePosition,
          points: userPoints,
          currentTier: newTier,
          emailVerified: !!ud.email_verified,
          shareCount: ud.share_count || 0,
          clickCount: ud.click_count || 0,
          socialClaims: {
            instagram: !!claims.instagram,
            facebook: !!claims.facebook,
            youtube: !!claims.youtube,
          },
          isSpeechProfessional: !!ud.is_speech_professional,
          speechProfessionalVerified: !!ud.speech_professional_verified,
          loading: false,
        };
      });

      if (crossedTier) {
        // Fire-and-forget; don't block the UI on email delivery.
        supabase.functions
          .invoke("dispatch-tier-emails", { body: { referral_code: referralCode } })
          .catch((e) => console.warn("Instant tier dispatch failed (will retry on cron):", e));
      }

      // Surface a celebration when someone uses your link. Dashboard listens
      // to `state.notifications`, but we also broadcast a window event so the
      // page can fire confetti without prop-drilling.
      if (newReferrals > 0) {
        addNotification(
          "success",
          newReferrals === 1
            ? `Someone just joined using your link! +25 pts`
            : `${newReferrals} people just joined using your link! +${newReferrals * 25} pts`
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("sp:referral-converted", { detail: { count: newReferrals } })
          );
        }
      }
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
          name,
          email,
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
            name,
            email,
            referralCode: result.referral_code,
            inviteCount: result.invite_count,
            points: newState.points,
            currentTier: newState.currentTier,
            queuePosition: newState.queuePosition,
          })
        );

        addNotification("success", "Successfully joined the waitlist!");
        try { localStorage.removeItem(REF_STORAGE_KEY); } catch {}
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

  const updateProfile = useCallback(
    async (updates: { name?: string; isSpeechProfessional?: boolean }): Promise<{ success: boolean; error?: string }> => {
      if (!state.referralCode) {
        return { success: false, error: "Not on the waitlist yet." };
      }
      try {
        const { data, error } = await supabase.functions.invoke("update-waitlist-profile", {
          body: {
            referral_code: state.referralCode,
            name: updates.name,
            is_speech_professional: updates.isSpeechProfessional,
          },
        });
        if (error) {
          const msg = error.message || "Could not update your details.";
          addNotification("error", msg);
          return { success: false, error: msg };
        }
        const errMsg = (data as any)?.error;
        if (errMsg) {
          addNotification("error", errMsg);
          return { success: false, error: errMsg };
        }
        const profile = (data as any)?.profile;
        if (profile) {
          setState((s) => ({
            ...s,
            name: profile.name ?? s.name,
            isSpeechProfessional: !!profile.is_speech_professional,
            speechProfessionalVerified: !!profile.speech_professional_verified,
          }));
          // Keep localStorage in sync if the name changed
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, name: profile.name }));
            } catch {}
          }
        }
        addNotification("success", "Saved!");
        return { success: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Could not update your details.";
        addNotification("error", msg);
        return { success: false, error: msg };
      }
    },
    [state.referralCode]
  );

  const trackShare = useCallback(
    async (platform: string): Promise<boolean> => {
      if (!state.referralCode) {
        addNotification("error", "You must join the waitlist first");
        return false;
      }
      try {
        const { data, error } = await supabase.functions.invoke("track-share", {
          body: { referral_code: state.referralCode, platform },
        });
        if (error) throw error;

        if (data?.capped) {
          addNotification("info", "Daily share cap reached. Come back tomorrow!");
        } else if (data?.points_awarded > 0) {
          addNotification("success", `Shared on ${platform}! +${data.points_awarded} pts`);
          await refreshStatsInternal(state.referralCode);
        }
        return true;
      } catch (err) {
        console.error("Failed to track share:", err);
        return false;
      }
    },
    [state.referralCode, refreshStatsInternal]
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

  const claimSocialFollow = useCallback(
    async (platform: "instagram" | "facebook" | "youtube"): Promise<boolean> => {
      if (!state.referralCode) {
        addNotification("error", "You must join the waitlist first");
        return false;
      }
      if (state.socialClaims[platform]) {
        addNotification("info", `Already claimed ${platform}!`);
        return false;
      }
      try {
        const { data, error } = await supabase.functions.invoke("claim-social-follow", {
          body: { referral_code: state.referralCode, platform },
        });
        if (error) throw error;
        if (data?.success && !data?.already_claimed) {
          addNotification("success", `+${data.points_awarded} pts for following on ${platform}!`);
          await refreshStatsInternal(state.referralCode);
          return true;
        }
        if (data?.already_claimed) {
          addNotification("info", `Already claimed ${platform}!`);
        }
        return false;
      } catch (err) {
        console.error("Failed to claim follow:", err);
        addNotification("error", "Could not claim points. Try again.");
        return false;
      }
    },
    [state.referralCode, state.socialClaims, refreshStatsInternal]
  );

  const resendVerification = useCallback(async (): Promise<boolean> => {
    if (!state.referralCode) {
      addNotification("error", "You must join the waitlist first");
      return false;
    }
    try {
      const { data, error } = await supabase.functions.invoke("resend-verification-waitlist", {
        body: { referral_code: state.referralCode },
      });
      if (error) throw error;
      if ((data as any)?.already_verified) {
        addNotification("info", "Your email is already verified");
        return true;
      }
      addNotification("success", "Verification email sent! Check your inbox.");
      return true;
    } catch (err: any) {
      const msg = err?.message?.includes("429") || err?.context?.status === 429
        ? "Please wait a moment before requesting another email"
        : "Could not send verification email. Try again shortly.";
      addNotification("error", msg);
      return false;
    }
  }, [state.referralCode]);

  const submitSuggestion = useCallback(
    async (title: string, description: string, category: string): Promise<{ success: boolean; message: string }> => {
      if (!state.referralCode) {
        return { success: false, message: "Join the waitlist first" };
      }
      const { data, error } = await supabase.rpc("submit_waitlist_suggestion", {
        p_referral_code: state.referralCode,
        p_title: title,
        p_description: description,
        p_category: category,
        p_points: REPEATABLE_POINTS.SUGGESTION,
      });
      if (error) {
        addNotification("error", "Could not submit suggestion");
        return { success: false, message: error.message };
      }
      const row = (data as any)?.[0];
      if (!row?.success) {
        addNotification("error", row?.message || "Could not submit");
        return { success: false, message: row?.message || "Failed" };
      }
      addNotification("success", `Suggestion submitted! +${REPEATABLE_POINTS.SUGGESTION} pts`);
      if (state.referralCode) await refreshStatsInternal(state.referralCode);
      return { success: true, message: "Submitted" };
    },
    [state.referralCode, refreshStatsInternal]
  );

  const voteSuggestion = useCallback(
    async (suggestionId: string): Promise<{ success: boolean; message: string }> => {
      if (!state.referralCode) {
        return { success: false, message: "Join the waitlist first" };
      }
      const { data, error } = await supabase.rpc("vote_waitlist_suggestion", {
        p_referral_code: state.referralCode,
        p_suggestion_id: suggestionId,
      });
      if (error) {
        addNotification("error", "Could not register vote");
        return { success: false, message: error.message };
      }
      const row = (data as any)?.[0];
      if (!row?.success) {
        addNotification("info", row?.message || "Already voted");
        return { success: false, message: row?.message || "Failed" };
      }
      addNotification("success", "Vote recorded");
      return { success: true, message: "Voted" };
    },
    [state.referralCode]
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

  // Clear the local session so a different person on the same browser can sign up
  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({
      joined: false,
      name: "",
      email: "",
      referralCode: "",
      inviteCount: 0,
      totalCount: state.totalCount,
      points: 0,
      currentTier: 0,
      queuePosition: null,
      emailVerified: false,
      badges: [],
      shareCount: 0,
      clickCount: 0,
      socialClaims: { instagram: false, facebook: false, youtube: false },
      isSpeechProfessional: false,
      speechProfessionalVerified: false,
      loading: false,
      error: null,
      notifications: [],
    });
  }, [state.totalCount]);

  return {
    ...state,
    joinWaitlist,
    refreshStats,
    trackShare,
    trackClick,
    claimSocialFollow,
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
    updateProfile,
    signOut,
  };
}
