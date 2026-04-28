import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "motion/react";
import {
  Copy,
  Check,
  Twitter,
  Facebook,
  Mail,
  Share2,
  Instagram,
  User as UserIcon,
  Users,
  Lock,
  Settings,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Coins,
  Download,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import SEOHead from "@/components/SEOHead";
import RewardsInventory from "@/components/waitlist/RewardsInventory";
import ScriptCarousel from "@/components/waitlist/ScriptCarousel";
import { useStorybuildersWaitlist } from "@/hooks/useStorybuildersWaitlist";
import {
  TIER_NAMES,
  TIER_THRESHOLDS,
  ONETIME_POINTS,
  REPEATABLE_POINTS,
  DAILY_CAPS,
  COIN_DROPS,
  TIER_REWARDS,
  SOCIAL_LINKS,
} from "@/lib/waitlist-constants";
import { getTierName } from "@/lib/waitlist-utils";
import storyPreviewBg from "@/assets/story-preview-bg.png";
import storypros from "@/assets/storybuilders-hero.png";
import shareCardImage from "@/assets/storypros-share-card.jpg";

const StoryProsDashboard = () => {
  const wl = useStorybuildersWaitlist();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [resending, setResending] = useState(false);
  const [authHydrating, setAuthHydrating] = useState(false);
  const [recoveryInvalid, setRecoveryInvalid] = useState(false);

  // Handle ?ref=CODE recovery links emailed via the "Find my dashboard" flow.
  // If the code matches a row, seed localStorage so the dashboard hydrates.
  // If it doesn't match, flag it so we redirect to /storypros with a message.
  useEffect(() => {
    let cancelled = false;
    const handleRecoveryRef = async () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (!ref) return;

      // Strip ?ref=… from the URL so refreshes don't re-trigger this.
      params.delete("ref");
      const newSearch = params.toString();
      window.history.replaceState(
        {},
        "",
        window.location.pathname + (newSearch ? `?${newSearch}` : "")
      );

      setAuthHydrating(true);
      const { data } = await supabase
        .from("storybuilders_waitlist")
        .select("referral_code, name, email, deleted_at")
        .eq("referral_code", ref)
        .maybeSingle();
      if (cancelled) return;

      if (!data || data.deleted_at) {
        setRecoveryInvalid(true);
        setAuthHydrating(false);
        return;
      }

      localStorage.setItem(
        "sb_waitlist_state",
        JSON.stringify({
          joined: true,
          name: data.name,
          email: data.email,
          referralCode: data.referral_code,
        })
      );
      // Hard reload so the hook re-initializes from localStorage. Calling
      // wl.refreshStats() here is a no-op because the hook's internal
      // state.referralCode is still empty at this point.
      window.location.replace(window.location.pathname);
      return;
    };
    handleRecoveryRef();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If localStorage is empty but the visitor is logged in via Supabase Auth
  // (e.g. they joined the waitlist on another device, or cleared their browser),
  // look up their waitlist row by email and seed the hook's localStorage so
  // the dashboard can hydrate normally instead of redirecting back to /storypros.
  useEffect(() => {
    let cancelled = false;
    const seedFromAuth = async () => {
      if (wl.joined || wl.loading) return;
      if (!user?.email) return;
      const saved = localStorage.getItem("sb_waitlist_state");
      if (saved) return; // hook will hydrate from localStorage
      setAuthHydrating(true);
      const { data } = await supabase
        .from("storybuilders_waitlist")
        .select("referral_code, name, email")
        .eq("email", user.email.toLowerCase())
        .maybeSingle();
      if (cancelled) return;
      if (data?.referral_code) {
        localStorage.setItem(
          "sb_waitlist_state",
          JSON.stringify({
            joined: true,
            name: data.name,
            email: data.email,
            referralCode: data.referral_code,
          })
        );
        // Hard reload so the hook re-initializes from localStorage.
        window.location.reload();
        return;
      }
      setAuthHydrating(false);
    };
    seedFromAuth();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, wl.joined, wl.loading]);

  const handleResendVerification = async () => {
    setResending(true);
    await wl.resendVerification();
    setResending(false);
  };

  // Run a small celebration when ?verified=1 is in the URL (post email verify redirect)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get("verified");
    if (!v) return;
    if (v === "1") {
      toast.success("Email verified! Bonus points added.");
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.3 } });
      } catch {}
      setTimeout(() => wl.refreshStats(), 400);
    } else if (v === "already") {
      toast.success("Your email is already verified.");
    }
    params.delete("verified");
    const newSearch = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (newSearch ? `?${newSearch}` : "")
    );
  }, [wl]);

  // Celebrate when a referral converts (broadcast from the hook on invite_count++)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { count?: number } | undefined;
      const count = detail?.count || 1;
      toast.success(
        count === 1
          ? "🎉 Someone just joined using your link! +25 pts"
          : `🎉 ${count} people just joined using your link! +${count * 25} pts`,
        { duration: 6000 }
      );
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 } });
      } catch {}
    };
    window.addEventListener("sp:referral-converted", handler);
    return () => window.removeEventListener("sp:referral-converted", handler);
  }, []);

  // Poll for fresh stats every 30s while the dashboard is open so referral
  // conversions surface in near-real-time without needing a hard refresh.
  useEffect(() => {
    if (!wl.joined) return;
    const id = setInterval(() => {
      wl.refreshStats();
    }, 30000);
    return () => clearInterval(id);
  }, [wl.joined, wl.refreshStats]);

  // Refresh stats whenever the tab regains focus or becomes visible. This
  // catches the common case where the user clicks the verify-email link in
  // another tab/window — when they switch back, we re-fetch and the
  // "verify your email" banner disappears immediately.
  useEffect(() => {
    if (!wl.joined) return;
    const onFocus = () => wl.refreshStats();
    const onVisible = () => {
      if (document.visibilityState === "visible") wl.refreshStats();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [wl.joined, wl.refreshStats]);

  // While the hook is hydrating from localStorage on first paint, briefly wait
  // before deciding the user isn't joined.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Recovery link with an invalid/expired ref code: send them back to
  // /storypros with a clear explanation instead of the generic redirect.
  if (recoveryInvalid) {
    if (typeof window !== "undefined") {
      const flagKey = "sp_recovery_invalid_notified";
      if (!sessionStorage.getItem(flagKey)) {
        sessionStorage.setItem(flagKey, "1");
        toast.error(
          "This link is no longer valid. Try finding your dashboard again or sign up.",
          { duration: 7000 }
        );
      }
    }
    return <Navigate to="/storypros" replace />;
  }

  // If they're truly not on the waitlist, send them back to /storypros to join.
  // Show a toast so it doesn't feel like a silent logout — common on shared
  // computers where someone else cleared the local session.
  if (hydrated && !wl.joined && !wl.loading && !authHydrating) {
    if (typeof window !== "undefined") {
      const flagKey = "sp_dashboard_redirect_notified";
      if (!sessionStorage.getItem(flagKey)) {
        sessionStorage.setItem(flagKey, "1");
        toast.info("Sign in or join the Story Pros waitlist to see your dashboard.", {
          duration: 6000,
        });
      }
    }
    return <Navigate to="/storypros" replace />;
  }

  if (!wl.joined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading your dashboard…</div>
      </div>
    );
  }

  const currentTier = wl.currentTier;
  const currentTierName = getTierName(currentTier);
  const nextThreshold = TIER_THRESHOLDS[currentTier + 1];
  const currentThreshold = TIER_THRESHOLDS[currentTier] ?? 0;
  const pointsInTier = wl.points - currentThreshold;
  const pointsNeeded = nextThreshold ? nextThreshold - currentThreshold : 0;
  const progressPercent =
    nextThreshold && pointsNeeded > 0
      ? Math.min(100, (pointsInTier / pointsNeeded) * 100)
      : 100;

  const firstName = (wl.name || "Friend").split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  // Earn-points checklist: each row reflects the user's real claim state
  const earnRows = [
    { label: "Sign up", done: wl.joined, pts: ONETIME_POINTS.SIGNUP },
    { label: "Verify email", done: wl.emailVerified, pts: ONETIME_POINTS.VERIFY_EMAIL },
    { label: "Complete profile", done: !!wl.name && !wl.name.includes("@"), pts: ONETIME_POINTS.COMPLETE_PROFILE },
    { label: "Follow Instagram", done: wl.socialClaims.instagram, pts: ONETIME_POINTS.FOLLOW_INSTAGRAM },
    { label: "Follow Facebook", done: wl.socialClaims.facebook, pts: ONETIME_POINTS.FOLLOW_FACEBOOK },
    { label: "Subscribe YouTube", done: wl.socialClaims.youtube, pts: ONETIME_POINTS.SUBSCRIBE_YOUTUBE },
    { label: "First share", done: wl.shareCount > 0, pts: ONETIME_POINTS.FIRST_SHARE },
    { label: "First referral bonus", done: wl.inviteCount > 0, pts: ONETIME_POINTS.FIRST_REFERRAL_BONUS },
  ];

  const handleCopy = async () => {
    if (!wl.referralLink) return;
    await navigator.clipboard.writeText(wl.referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!wl.referralLink) return;
    const url = encodeURIComponent(wl.referralLink);

    // Platform-specific pre-filled copy. Each one is tuned for the format of
    // the destination (tweet length, WhatsApp casual, Facebook prompt, etc.)
    // so users can post in one tap without writing anything.
    const twitterText = encodeURIComponent(
      `I just joined the founding waitlist for Story Pros, a new storytelling app for kids with DLD, built by an SLP and a teacher. If you know a family who'd love this, take a look 💜`
    );
    const whatsappText = encodeURIComponent(
      `Hey! I just joined the founding waitlist for Story Pros, a storytelling app for kids with DLD (developmental language disorder), built by an SLP and a teacher. Thought you'd want to see it. Here's my link:`
    );
    const facebookQuote = encodeURIComponent(
      `Just joined the founding waitlist for Story Pros, a new storytelling app for kids with developmental language disorder (DLD). It's built by a speech-language pathologist and an elementary school teacher. If you know a family who'd benefit, here it is.`
    );
    const instagramText = `Just joined the Story Pros founding waitlist, a storytelling app for kids with DLD. Link in my story 💜\n${wl.referralLink}`;
    const emailSubject = encodeURIComponent("Thought you'd want to see this: Story Pros");
    const emailBody = encodeURIComponent(
      `Hey,\n\nI just joined the founding waitlist for Story Pros, a new storytelling app and monthly live community for kids who need extra support with language and storytelling. It's built by a speech-language pathologist and an elementary school teacher.\n\nThought of you. Here's my link if you want to join me:\n${wl.referralLink}\n\nNo pressure either way, just wanted to put it on your radar.`
    );

    const map: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${twitterText}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${facebookQuote}`,
      email: `mailto:?subject=${emailSubject}&body=${emailBody}`,
      whatsapp: `https://wa.me/?text=${whatsappText}%20${url}`,
      // Instagram doesn't support URL share intents — copy a ready-to-paste caption
      // and link, then open instagram.com so the user can paste into a story/DM.
      instagram: `https://www.instagram.com/`,
    };

    // For platforms where the post composer doesn't reliably accept our prefilled
    // caption (Instagram has no share intent; Facebook's `quote` param is often
    // ignored on mobile), copy a ready-to-paste caption so users can just hit paste.
    if (platform === "instagram" || platform === "facebook") {
      navigator.clipboard
        .writeText(
          platform === "instagram"
            ? instagramText
            : `${decodeURIComponent(facebookQuote)}\n${wl.referralLink}`
        )
        .then(() =>
          toast.success(
            platform === "instagram"
              ? "Caption + link copied! Paste it in your IG story or DM."
              : "Caption copied! Paste it into your Facebook post if it's blank."
          )
        )
        .catch(() => {});
    }
    if (map[platform]) window.open(map[platform], "_blank");
    wl.trackShare(platform);
  };

  const handleDownloadShareImage = async () => {
    try {
      const res = await fetch(shareCardImage);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "story-pros-share.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded! Post it with your script.");
    } catch {
      toast.error("Couldn't download. Long-press the preview to save instead.");
    }
  };

  const handleFollowClick = (platform: "instagram" | "facebook" | "youtube", url: string) => {
    window.open(url, "_blank");
    wl.claimSocialFollow(platform);
  };

  // Coin balance: derived from tier-up coin drops only (Tier 3 = 50 currently)
  const coinBalance = currentTier >= 2 ? COIN_DROPS[2] || 0 : 0;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Your Story Pros Dashboard | Empowered DLD"
        description="Track your Story Pros waitlist tier, points, referrals, and rewards."
        path="/storypros/dashboard"
      />

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-deep-purple text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            to="/storypros"
            className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Story Pros
          </Link>
          <button
            onClick={() => {
              wl.signOut();
              toast.success("Signed out.");
            }}
            className="text-xs text-white/80 hover:text-white underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* User Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-[#dedede] py-6"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#8861d4] flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-[#121212] truncate">
                  Welcome, {firstName}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {currentTierName} · {wl.points} points
                  {wl.queuePosition ? (
                    <>
                      {" · "}
                      <span className="font-semibold text-[#8861d4]">
                        #{wl.queuePosition.toLocaleString()}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border border-amber-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 fill-amber-400" />
                <span className="font-bold text-amber-700 text-sm sm:text-base">{coinBalance}</span>
                <span className="text-xs sm:text-sm text-amber-700/80 hidden sm:inline">coins</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#dedede] bg-gray-100 flex items-center justify-center hover:border-[#8861d4] transition-colors shrink-0"
                    aria-label="Profile menu"
                  >
                    <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {wl.name || "Story Pros member"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {wl.email || "—"}
                      </p>
                      <p className="text-xs text-[#8861d4] font-medium mt-1">
                        {wl.isSpeechProfessional
                          ? wl.speechProfessionalVerified
                            ? "Speech Professional ✓"
                            : "Speech Professional (pending)"
                          : "Family / Supporter"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      wl.signOut();
                      toast.success("Signed out.");
                    }}
                    className="cursor-pointer"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Waitlist position spotlight: high-impact motivator (Robinhood / Superhuman style) */}
      {wl.queuePosition && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-[#8861d4] to-[#6a47b8] text-white"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Sparkles className="h-5 w-5 shrink-0 opacity-90" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider opacity-80 font-semibold">
                    Your spot on the waitlist
                  </p>
                  <p className="text-xl sm:text-2xl font-bold leading-tight">
                    #{wl.queuePosition.toLocaleString()}
                    {wl.totalCount ? (
                      <span className="text-sm sm:text-base font-medium opacity-80 ml-2">
                        of {wl.totalCount.toLocaleString()}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm opacity-90 max-w-xs sm:max-w-sm leading-snug">
                Refer friends to climb the list and unlock founder rewards faster.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Verify-email nudge banner */}
      {!wl.emailVerified && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-amber-50 border-b border-amber-200"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900 leading-snug">
                  <strong>Verify your email to unlock +15 points</strong> and start earning referrals.
                  Check your inbox (and your <em>Promotions</em> or <em>Spam</em> folder, just in case).
                </div>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={resending}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {resending ? "Sending…" : "Resend email"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Tier Progress + Referrals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-sans font-bold text-foreground">Tier Progress</h3>
                    <Badge className="bg-primary/10 text-primary">{currentTierName}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {wl.points} / {nextThreshold || wl.points} points
                  </p>
                </div>
                <div className="relative h-3 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
                {nextThreshold ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Current Tier</span>
                    <span className="font-semibold text-primary">
                      {nextThreshold - wl.points} points to next tier
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 font-semibold">
                    Top tier reached. Thank you, founder!
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                Referrals
              </p>
              <p className="text-3xl font-bold text-primary mt-1">{wl.inviteCount}</p>
              {wl.inviteCount === 0 && (
                <p className="text-xs text-muted-foreground mt-2 leading-snug">
                  No referrals yet. Invite your first friend and earn +25 pts (plus a +10 first-referral bonus).
                </p>
              )}
            </Card>
          </motion.div>
        </div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="font-sans font-bold text-foreground mb-6 text-center">
              How to Earn Points
            </h3>
            <div className="max-w-md mx-auto">
              <div className="space-y-2 text-sm">
                {earnRows.map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span
                      className={
                        row.done
                          ? "text-emerald-600 flex items-center gap-1"
                          : "text-foreground"
                      }
                    >
                      {row.done && <Check className="h-3 w-3" />}
                      {row.label}
                    </span>
                    <span
                      className={
                        row.done
                          ? "font-bold text-emerald-500"
                          : "font-bold text-[#8861d4]"
                      }
                    >
                      {row.done ? `+${row.pts} pts ✓` : `${row.pts} pts (once)`}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-foreground">Refer a friend</span>
                    <span className="font-bold text-[#8861d4]">
                      {REPEATABLE_POINTS.REFERRAL} pts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Share link</span>
                    <span className="font-bold text-[#8861d4]">
                      {REPEATABLE_POINTS.SHARE} pts (max {DAILY_CAPS.MAX_SHARE_POINTS}/day)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Feature suggestion</span>
                    <span className="font-bold text-[#8861d4]">
                      {REPEATABLE_POINTS.SUGGESTION} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        

        {/* Referral Link + Share Preview */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="font-sans font-bold text-foreground mb-4">Your Referral Link</h3>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground truncate">
                {wl.referralLink || "—"}
              </div>
              <Button
                onClick={handleCopy}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Share preview — what your friends will see */}
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Preview when shared
                </p>
              </div>
              <div className="rounded-xl border border-border overflow-hidden bg-white max-w-md">
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-muted">
                  <img
                    src={storypros}
                    alt="Story Pros share preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 border-t border-border">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    empowereddld.com
                  </p>
                  <p className="text-sm font-semibold text-foreground leading-snug mt-1">
                    Story Pros — the storytelling app for kids with DLD
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    Built by an SLP and an elementary school teacher. Join the founding waitlist.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-snug">
                This is how your link appears in iMessage, WhatsApp, Facebook, and X when someone receives it.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Share */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
          <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="font-sans font-bold text-foreground mb-2">Share & Earn Referrals</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-snug">
              Tap a platform to open it with a caption ready to paste. For Instagram, we copy the caption + your link and open the app so you can paste into a story or post.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Button onClick={() => handleShare("twitter")} className="bg-foreground hover:bg-foreground/90 text-background flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <span className="hidden sm:inline">Twitter</span>
              </Button>
              <Button onClick={() => handleShare("facebook")} className="bg-[#1877F2] hover:bg-[#0A66C2] text-white flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                <span className="hidden sm:inline">Facebook</span>
              </Button>
              <Button onClick={() => handleShare("email")} className="bg-[#EA4335] hover:bg-[#C5221F] text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </Button>
              <Button onClick={() => handleShare("whatsapp")} className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button onClick={() => handleShare("instagram")} className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </Button>
              <Button onClick={handleCopy} className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
            </div>

            {/* Downloadable graphic */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Ready-to-post image</p>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-snug">
                Download this graphic and post it anywhere you share — Instagram, Facebook, or stories. The scripts below are best for more personal messages; this image works as a general post.
              </p>
              <p className="text-xs text-foreground mb-4 leading-snug italic">
                Suggested caption: "Just joined this early. Feels like something special." (Feel free to add your own words.)
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="rounded-xl border border-border overflow-hidden bg-white w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                  <img
                    src={shareCardImage}
                    alt="Story Pros downloadable share graphic"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={1024}
                    height={1024}
                  />
                </div>
                <div className="flex-1">
                  <Button
                    onClick={handleDownloadShareImage}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 leading-snug">
                    Tip: pair it with a copied script below for a one-tap post. We trust you — points are awarded when you tap a share button. Real referrals also award bonus points when someone joins through your link.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Scripts to share */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.37 }}>
          <ScriptCarousel referralLink={wl.referralLink || ""} />
        </motion.div>

        {/* Follow */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="font-sans font-bold text-foreground mb-2">Follow Us & Earn Points</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Follow us on social media to earn bonus points per platform.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "instagram" as const, label: "Instagram", color: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500", url: SOCIAL_LINKS.INSTAGRAM, points: ONETIME_POINTS.FOLLOW_INSTAGRAM, Icon: Instagram },
                { id: "facebook" as const, label: "Facebook", color: "bg-[#1877F2]", url: SOCIAL_LINKS.FACEBOOK, points: ONETIME_POINTS.FOLLOW_FACEBOOK, Icon: Facebook },
                { id: "youtube" as const, label: "YouTube", color: "bg-red-600", url: SOCIAL_LINKS.YOUTUBE, points: ONETIME_POINTS.SUBSCRIBE_YOUTUBE, Icon: () => <span className="text-lg">▶️</span> },
              ]).map(({ id, label, color, url, points, Icon }) => {
                const followed = wl.socialClaims[id];
                return (
                  <Button
                    key={id}
                    onClick={() => handleFollowClick(id, url)}
                    disabled={followed}
                    className={`h-12 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all ${
                      followed
                        ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-600"
                        : `${color} hover:opacity-90`
                    } disabled:opacity-100`}
                  >
                    {followed ? <Check className="h-5 w-5 text-emerald-500" /> : <Icon className="h-5 w-5" />}
                    <span className="hidden sm:inline text-sm">
                      {followed ? `+${points} pts ✓` : `${label} (+${points})`}
                    </span>
                  </Button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Tier rewards / Claim / Coin Packs */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.42 }}>
          <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] bg-center bg-no-repeat bg-contain pointer-events-none"
              style={{ backgroundImage: `url(${storyPreviewBg})` }}
            />
            <div className="relative z-10">
              <RewardsInventory
                currentTier={currentTier}
                coins={coinBalance}
                badges={wl.badges}
                inventory={{}}
                onClaimReward={() => toast.info("Reward claim flow coming soon.")}
                onRedeemCoinPack={() => toast.info("Coin pack redemption coming soon.")}
              />
            </div>
          </Card>
        </motion.div>

        {/* Interactive preview gating */}
        {currentTier >= 3 ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
            <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-bold text-foreground">Interactive Story Preview</h3>
                <Badge className="bg-primary/20 text-primary">Tier 4 Exclusive</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                As a Tier 4 member, you have early access to the Story Pros experience. Try an interactive story below.
              </p>
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  src="https://storyprospreview.lovable.app/preview/story/11111111-1111-1111-1111-111111111111"
                  className="w-full h-[600px] sm:h-[900px]"
                  title="Story Pros Interactive Preview"
                  allow="fullscreen"
                />
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
            <Card className="bg-background border border-border rounded-2xl shadow-sm p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-semibold text-foreground">Interactive Preview</p>
                <p className="text-sm text-muted-foreground">
                  Reach Tier 4 ({TIER_THRESHOLDS[3]} pts) to unlock
                </p>
              </div>
              <div className="opacity-20">
                <h3 className="font-sans font-bold text-foreground mb-4">Interactive Story Preview</h3>
                <div className="rounded-xl overflow-hidden" style={{ height: "400px" }}>
                  <img src={storyPreviewBg} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Impact */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Your Impact</p>
              {wl.inviteCount === 0 ? (
                <>
                  <h3 className="font-sans font-bold text-2xl">
                    Be the first to bring a family in 💜
                  </h3>
                  <p className="text-sm opacity-90 max-w-md mx-auto">
                    Every family who joins through your link helps more kids with DLD find Story Pros at launch. Share your link above to get started.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-sans font-bold text-4xl">
                    {wl.inviteCount} {wl.inviteCount === 1 ? "Family" : "Families"}
                  </h3>
                  <p className="text-sm opacity-90">discovered Story Pros because of you</p>
                </>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Coming up */}
        {nextThreshold && TIER_REWARDS[currentTier + 1] && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
            <Card className="bg-gradient-to-br from-[#f3ebf8] to-white border border-[#8861d4]/20 rounded-2xl shadow-sm p-4 sm:p-6">
              <h3 className="font-sans font-bold text-[#3b1f59] mb-2">
                Coming at {TIER_NAMES[currentTier + 1]} ({nextThreshold} pts)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You're {nextThreshold - wl.points} points away from your next reward.
              </p>
              <div className="bg-white rounded-lg p-4 border border-[#dedede]">
                <p className="font-semibold text-[#3b1f59]">{TIER_REWARDS[currentTier + 1]?.name}</p>
                <p className="text-sm text-gray-500 mt-1">{TIER_REWARDS[currentTier + 1]?.description}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default StoryProsDashboard;
