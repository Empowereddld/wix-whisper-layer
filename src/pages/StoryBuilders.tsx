import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import { DotBackground } from "@/components/ui/dot-background";
import SEOHead from "@/components/SEOHead";
import StoryBuildersStatBand from "@/components/StoryBuildersStatBand";
import storybuildersHero from "@/assets/storybuilders-hero.png";
import storybuildersAppMockup from "@/assets/storybuilders-app-mockup.png";

import storybuildersMovement from "@/assets/storybuilders-movement.png";
import storybuildersAwareness from "@/assets/storybuilders-awareness.png";
import storybuildersUnderstood from "@/assets/storybuilders-understood.png";
import howItWorksSteps from "@/assets/how-it-works-steps.png";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { useStorybuildersWaitlist } from "@/hooks/useStorybuildersWaitlist";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Rocket,
  Gift,
  Headphones,
  Crown,
  Sparkles,
  Mail,
} from "lucide-react";

/* ─── Milestones ─── */
const milestones = [
  { invites: 0, label: "Tier 1 (0 pts)", reward: "Behind-the-scenes updates on Story Pros development, Founding Member status, and your name on the Early Supporters Wall" },
 { invites: 1, label: "Tier 2 (35 pts)", reward: "FREE digital product: Executive Function Skills for Your Child (normally paid in the Resource Hub)" },
 { invites: 3, label: "Tier 3 (75 pts)", reward: "50 Story Coins dropped into your account to spend on in-app extras at launch" },
 { invites: 5, label: "Tier 4 (130 pts)", reward: "VIP Beta access to test Story Pros before launch and help shape the final product" },
 { invites: 10, label: "Tier 5 (250 pts)", reward: "Founder Pricing locked for life: $7.99/month forever instead of $9.99 (points double from this tier on)" },
 { invites: -1, label: "Tier 6 (500 pts)", reward: "Signed Dan & Daria book plus DLD-themed merch, limited to the first 50 members to reach Tier 6 by June 1" },
];

const COLLECTIVE_GOAL = 4000;

/* ─── Scroll-animated Progress Journey ─── */
type ProgressStep = {
  task: string;
  impact: string;
  reward: { icon: React.ReactNode; title: string; desc: string; subdesc?: string } | null;
  invites: number;
};

const ScrollProgress = ({ steps, inviteCount }: { steps: ProgressStep[]; inviteCount: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [linePct, setLinePct] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const containerRect = el.getBoundingClientRect();
      const containerH = containerRect.height;
      if (containerH === 0) return;

      const windowH = window.innerHeight;
      const triggerY = windowH * 0.85;

      let reachedStep = -1;
      for (let i = 0; i < stepRefs.current.length; i++) {
        const stepEl = stepRefs.current[i];
        if (!stepEl) continue;
        const stepRect = stepEl.getBoundingClientRect();
        const circleCenter = stepRect.top + 12;
        if (circleCenter <= triggerY) {
          reachedStep = i;
        }
      }

      setActiveStep(reachedStep);

      if (reachedStep < 0) {
        setLinePct(0);
      } else {
        const targetStep = stepRefs.current[reachedStep];
        if (targetStep) {
          const targetRect = targetStep.getBoundingClientRect();
          const targetY = targetRect.top + 12 - containerRect.top;
          const trackStart = 12;
          const lastStep = stepRefs.current[stepRefs.current.length - 1];
          const trackEnd = lastStep
            ? lastStep.getBoundingClientRect().top + 12 - containerRect.top
            : containerH - 12;
          const pct = Math.max(0, Math.min(100, ((targetY - trackStart) / (trackEnd - trackStart)) * 100));
          setLinePct(pct);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="max-w-[560px] mx-auto relative" style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Background track */}
      <div
        className="absolute w-[3px] rounded-full"
        style={{
          left: "11px",
          top: "12px",
          bottom: "12px",
          background: "hsl(258,50%,50%,0.15)",
        }}
      />
      {/* Animated fill line */}
      <div
        className="absolute w-[3px] rounded-full"
        style={{
          left: "11px",
          top: "12px",
          height: `${linePct}%`,
          maxHeight: "calc(100% - 24px)",
          background: "hsl(258,50%,50%)",
          transition: "height 0.25s ease-out",
        }}
      />

      {steps.map((step, i, arr) => {
        const completed = inviteCount >= step.invites;
        const isCurrent = !completed && (i === 0 || inviteCount >= arr[i - 1].invites);
        const locked = !completed && !isCurrent;
        const reached = i <= activeStep;

        return (
          <div
            key={i}
            ref={(el) => { stepRefs.current[i] = el; }}
            className="relative flex items-start gap-5"
            style={{ paddingBottom: i < arr.length - 1 ? "56px" : "0" }}
          >
            {/* Circle marker */}
            <div className="relative z-10 shrink-0 flex items-center justify-center w-[24px]">
              <div
                className="rounded-full"
                style={{
                  width: reached ? "14px" : "10px",
                  height: reached ? "14px" : "10px",
                  background: reached
                    ? "hsl(258,50%,50%)"
                    : "hsl(258,50%,50%,0.2)",
                  boxShadow: isCurrent && reached
                    ? "0 0 0 6px hsl(258,50%,50%,0.15)"
                    : "none",
                  transform: reached ? "scale(1)" : "scale(0.8)",
                  opacity: 1,
                  transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
            </div>

            {/* Content */}
            <div
              className="flex-1"
              style={{
                opacity: 1,
                transition: "opacity 0.4s ease-out",
              }}
            >
              {/* Task line (secondary) */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B6B7B",
                  fontWeight: 600,
                  lineHeight: 1.5,
                  marginBottom: "4px",
                }}
              >
                {step.task}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#8A8A9A",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  marginBottom: step.reward ? "12px" : "0",
                }}
              >
                {step.impact}
              </p>

              {/* Reward card (focal point) */}
              {step.reward && (
                <div
                  style={{
                    background: isCurrent
                      ? "linear-gradient(135deg, hsla(258,60%,55%,0.12) 0%, hsla(270,70%,75%,0.14) 100%)"
                      : "linear-gradient(135deg, hsla(258,60%,55%,0.08) 0%, hsla(270,70%,75%,0.10) 100%)",
                    borderRadius: "16px",
                    padding: "18px 20px",
                    boxShadow: isCurrent
                      ? "0 8px 24px -4px hsl(258,50%,50%,0.12), 0 0 0 1px hsl(258,50%,50%,0.08)"
                      : "0 4px 16px -4px hsl(258,50%,50%,0.08)",
                    transform: reached && i === activeStep ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-primary" style={{ lineHeight: 1, marginTop: "2px" }}>
                      {step.reward.icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#2F2F3A",
                          lineHeight: 1.3,
                          marginBottom: "4px",
                        }}
                      >
                        {step.reward.title}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#7A7A8A",
                          lineHeight: 1.5,
                        }}
                      >
                        {step.reward.desc}
                      </p>
                      {step.reward.subdesc && (
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: 400,
                            color: "#9B9BAB",
                            lineHeight: 1.5,
                            marginTop: "4px",
                          }}
                        >
                          {step.reward.subdesc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Fade wrapper ─── */
const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, className: fadeClass } = useScrollFadeIn({ delay });
  return <div ref={ref} className={`${fadeClass} ${className}`}>{children}</div>;
};

/* ─── Scroll-animated "What Is StoryBuilders" section ─── */
const WhatIsStoryBuildersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const windowH = window.innerHeight;
    // Progress 0 when section top enters viewport bottom, 1 when section top reaches viewport top
    const raw = 1 - rect.top / windowH;
    setProgress(Math.max(0, Math.min(1, raw)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const rotateY = 18 * (1 - progress);
  const rotateX = 10 * (1 - progress);

  return (
    <section ref={sectionRef} className="bg-white border-t border-border py-16 md:py-[120px]">
      <div className="container px-6 md:px-8">
        <FadeSection className="text-center mb-10 md:mb-14">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-primary" />
          </div>
          <h2 className="text-[24px] md:text-[30px] lg:text-[34px] font-bold tracking-tight text-foreground">
            What Is Story Pros
          </h2>
        </FadeSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-[1100px] mx-auto">
          {/* Left: app mockup with scroll-driven tilt */}
          <div className="flex justify-center lg:justify-start lg:order-1 order-2 relative">
            <DotBackground className="rounded-2xl opacity-40" dotColor="hsl(258, 50%, 50%, 0.12)" />
            <div
              style={{
                transform: `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                willChange: "transform",
              }}
              className="relative z-10"
            >
              <img
                src={storybuildersAppMockup}
                alt="Story Pros app interface showing an interactive storytelling session"
                className="w-full max-w-[520px] rounded-2xl"
                style={{ boxShadow: "0 8px 60px -12px hsl(258, 50%, 50%, 0.25)" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: description */}
          <FadeSection className="lg:order-2 order-1">
            <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] mb-6">
              Story Pros is an interactive app designed to help children:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Understand and retell stories",
                "Build vocabulary and sentence structure",
                "Share their ideas with more confidence",
                "Feel proud of how they communicate",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-[15px] md:text-[16px] text-foreground leading-[1.6]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7]">
              It was designed for children with Developmental Language Disorder and can be used at home, in therapy, or in the classroom.
            </p>
          </FadeSection>
        </div>
      </div>
    </section>
  );
};


const StoryBuilders = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const wl = useStorybuildersWaitlist();

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (name.trim().includes("@")) {
      toast.error("Please enter your name, not your email.");
      return;
    }
    const result = await wl.joinWaitlist(name, email);
    if (result) {
      toast.success(result.already_joined ? "Welcome back!" : "You're on the Launch Team!");
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle ?verified= query param when users return from email verification
  const verifiedHandledRef = useRef(false);
  useEffect(() => {
    if (verifiedHandledRef.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get("verified");
    if (!v) return;
    verifiedHandledRef.current = true;

    if (v === "1") {
      toast.success("Email verified! +5 bonus points added.");
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.3 },
        });
      } catch {}
      // Refresh stats so the new points/verified badge appear immediately
      setTimeout(() => wl.refreshStats(), 400);
    } else if (v === "already") {
      toast.success("Your email is already verified.");
    }

    // Clean the URL so refreshes don't re-fire the toast
    params.delete("verified");
    const newSearch = params.toString();
    const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
    window.history.replaceState({}, "", newUrl);
  }, [wl]);

  const nextMilestone = milestones.find((m) => m.invites > 0 && m.invites > wl.inviteCount);
  const invitesNeeded = nextMilestone ? nextMilestone.invites - wl.inviteCount : 0;
  const progressPct = nextMilestone ? Math.min(100, (wl.inviteCount / nextMilestone.invites) * 100) : 100;
  const collectivePct = Math.min(100, (wl.totalCount / COLLECTIVE_GOAL) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <SEOHead
        title="Story Pros Launch Team — Join the Movement | Empowered DLD"
        description="Join the Story Pros Launch Team and help build a storytelling app for children with Developmental Language Disorder. Earn points, unlock rewards, and be part of something meaningful."
        path="/storypros"
      />
      <Header />

      {/* ─── S1: HERO ─── */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)]">
        <img
          src={storybuildersHero}
          alt="Mother and son laughing together while using a tablet"
          className="absolute inset-0 w-full h-full object-cover object-[82%_20%] md:object-[50%_30%] lg:object-[50%_40%]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-deep-purple/70 md:bg-transparent md:bg-gradient-to-r md:from-deep-purple/90 md:via-deep-purple/70 md:to-deep-purple/40" />

        <div className="relative z-10 container px-6 md:px-8 min-h-[600px] md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)] flex flex-col justify-center items-start text-left gap-5 max-w-none">
          <div className="max-w-[560px]">
              <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
                FOR FAMILIES, EDUCATORS &amp; PROFESSIONALS
              </p>
              <h1 className="text-[32px] md:text-[44px] lg:text-[50px] font-black text-white leading-[1.1] mt-4 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                The First App Built<br className="hidden md:inline lg:hidden" /> For Kids With DLD
              </h1>
              <p className="text-[14px] md:text-[16px] text-white/90 leading-[1.7] mt-4 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
                Join the Story Pros Launch Team and help us bring daily 20-minute story sessions that build vocabulary, comprehension, and confidence to children with DLD worldwide.
              </p>
              {!wl.joined ? (
                <>
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3 w-full max-w-[520px] mt-5">
                    <Input
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md focus-visible:ring-primary flex-1 min-w-[140px]"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md focus-visible:ring-primary flex-1 min-w-[140px]"
                    />
                    <Button
                      type="submit"
                      disabled={wl.loading}
                      className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors shadow-[var(--shadow-button)] whitespace-nowrap w-full sm:w-auto"
                    >
                      {wl.loading ? "Joining…" : "Join Now"}
                    </Button>
                  </form>
                  <label className="flex items-start gap-2.5 mt-3 max-w-[520px] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isSpeechPro}
                      onChange={(e) => setIsSpeechPro(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/40 bg-white/10 accent-primary cursor-pointer"
                    />
                    <span className="text-[13px] text-white/80 leading-[1.5] text-left">
                      I'm a speech-language professional (SLP, SLT, Speech Therapist, etc.) — <span className="text-white/95 font-semibold">unlocks +50 bonus points after verification</span>
                    </span>
                  </label>
                  <p className="text-[13px] text-white/60 mt-6 leading-[1.6]">
                    <span className="font-semibold text-white/80">Not just stories</span> — A guided way to build language step by step
                  </p>
                </>
              ) : (
                <div className="mt-5 max-w-[520px] bg-white/10 border border-white/20 rounded-md p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 h-8 w-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-[16px] leading-snug">
                        Thank you for joining the Story Pros waitlist!
                      </p>
                      <p className="text-white/80 text-[13px] leading-[1.6] mt-2">
                        Check your inbox. We just sent you an email with everything you need, including your personal referral link.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {wl.error && <p className="text-white/70 text-[13px]">{wl.error}</p>}
          </div>
        </div>
      </section>


      {/* ─── S2: HOOK ─── */}
      <section className="bg-white bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(266,100%,92%)_0%,transparent_100%)] py-16 md:py-24">
        <FadeSection className="max-w-[700px] mx-auto px-6 md:px-8 text-center space-y-6 md:space-y-8">
          <p className="text-base md:text-xl lg:text-2xl text-foreground leading-[1.7] font-normal">
            For many children, telling a story about their day is not simple.
          </p>
          <p className="text-base md:text-xl lg:text-2xl text-foreground leading-[1.7]">
            <span className="text-primary font-semibold">Words get stuck.</span>{" "}
            <span className="text-primary font-semibold">Details get lost.</span>
            <br />
            And over time, <span className="text-primary font-semibold">confidence starts to fade.</span>
          </p>
          <p className="text-base md:text-xl lg:text-2xl leading-[1.7] font-bold text-deep-purple">
            Story Pros was created to change that.
          </p>
      </FadeSection>
      </section>

      {/* ─── PREMIUM PROMO SECTION ─── */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1300px] mx-auto px-6 md:px-8">
          <FadeSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-10 items-start">
                {/* Left column — text */}
                <div className="flex flex-col gap-6">
                  <h2 className="text-[28px] md:text-[34px] lg:text-[38px] font-bold tracking-tight text-foreground leading-[1.15] whitespace-nowrap">
                    What is Story Pros?
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[500px]">
                    Story Pros is an interactive app designed to help children:
                  </p>
                  <ul className="flex flex-col gap-2 max-w-[500px]">
                    {[
                      "Understand and retell stories",
                      "Build vocabulary and sentence structure",
                      "Share their ideas with more confidence",
                      "Feel proud of how they communicate",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-base md:text-lg text-muted-foreground leading-relaxed">
                        <Check className="w-4 h-4 text-primary mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[500px]">
                    It was designed for children with Developmental Language Disorder and can be used at home, in therapy, or in the classroom.
                  </p>
                </div>
                {/* Right column — mockup */}
                <div className="flex justify-center lg:justify-start">
                  <img
                    src={storybuildersAppMockup}
                    alt="Story Pros app on iPad"
                    className="w-full max-w-[500px] lg:max-w-none mx-auto lg:mx-0"
                  />
                </div>
              </div>
          </FadeSection>
        </div>
      </section>


      {/* ─── BIGGER THAN AN APP ─── */}
      <section className="py-12 md:py-16">
        <FadeSection className="max-w-[900px] mx-auto px-6 md:px-8">
          <div className="bg-[hsl(266,100%,97%)] rounded-2xl px-8 py-10 md:px-12 md:py-14 text-center space-y-5">
            <h3 className="text-[22px] md:text-[28px] lg:text-[32px] font-bold tracking-tight text-foreground leading-[1.2]">
              We're Building Something Bigger Than an App
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[700px] mx-auto">
              Story Pros is being created for children who struggle to understand and express their ideas
              — and for the parents, educators, and therapists supporting them every day.
            </p>
            <p className="text-base md:text-lg text-foreground font-semibold leading-relaxed">
              We're inviting you to be part of it from the very beginning.
            </p>
          </div>
        </FadeSection>
      </section>


      <section className="py-16 md:py-[120px] bg-background">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8">
          {/* Header row */}
          <FadeSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
            <div className="max-w-[500px]">
              <span className="text-primary text-[13px] md:text-[14px] tracking-[0.22em] uppercase font-semibold block mb-3">
                WHY JOIN
              </span>
              <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-black tracking-tight text-foreground leading-[1.1]">
                Every child deserves to share their ideas clearly.
              </h2>
            </div>
            <p className="text-muted-foreground text-[16px] leading-relaxed max-w-[400px] md:text-right">
              Story Pros is being built for children who deserve to be heard. Your support helps make sure they are.
            </p>
          </FadeSection>

          {/* Bento card grid */}
          <FadeSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 min-h-[560px]">
              {/* Left tall card */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer min-h-[300px] md:min-h-0">
                <img src={storybuildersUnderstood} alt="Be a part of the movement" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <p className="text-white font-semibold text-[18px] md:text-[20px] translate-y-8 group-hover:translate-y-0 transition-transform duration-300">Be a part of the movement</p>
                  <p className="text-white/80 text-sm max-w-[280px] mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Some people talk about change. You just helped create it.
                  </p>
                </div>
              </div>

              {/* Right stacked cards */}
              <div className="grid grid-rows-2 gap-4">
                {/* Top right */}
                <div className="relative overflow-hidden rounded-xl group cursor-pointer min-h-[200px] md:min-h-0">
                  <img src={storybuildersAwareness} alt="Spread awareness of DLD" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80" />
                    <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-white font-semibold text-[16px] md:text-[18px] translate-y-8 group-hover:translate-y-0 transition-transform duration-300">Spread awareness of DLD</p>
                    <p className="text-white/80 text-sm max-w-[280px] mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Most people have never heard of DLD. Every person you invite is one more who will.
                    </p>
                  </div>
                </div>

                {/* Bottom right */}
                <div className="relative overflow-hidden rounded-xl group cursor-pointer min-h-[200px] md:min-h-0">
                  <img src={storybuildersMovement} alt="Help more children feel understood" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/80" />
                    <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-white font-semibold text-[16px] md:text-[18px] translate-y-8 group-hover:translate-y-0 transition-transform duration-300">Help more children feel understood</p>
                    <p className="text-white/80 text-sm max-w-[280px] mt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      When more families find Story Pros, more children get a tool built specifically for how they think and communicate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S5: HOW IT WORKS ─── */}
      <section className="bg-muted py-16 md:py-[120px]">
        <div className="container px-6 md:px-8">
          <FadeSection className="text-center mb-12 md:mb-16">
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-foreground">
              How It Works
            </h2>
          </FadeSection>
          <FadeSection delay={100}>
            <div className="max-w-[900px] mx-auto">
              <img
                src={howItWorksSteps}
                alt="How it works: Join the Launch Team, Invite others to join, Unlock meaningful milestones"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </FadeSection>
        </div>
      </section>

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S6: YOUR PROGRESS ─── */}
      <section className="py-16 md:py-[120px]" style={{ backgroundColor: "#FAFAFC" }}>
        <div className="container px-6 md:px-8">
          <FadeSection className="text-center mb-14 md:mb-20">
            <h2 className="text-[34px] md:text-[40px] tracking-tight leading-[1.2]" style={{ color: "#2F2F3A", fontWeight: 700, fontFamily: "Poppins, sans-serif" }}>
              Your Story Pros Journey
            </h2>
            <p className="text-[16px] md:text-[18px] mt-3 leading-[1.6]" style={{ color: "#6B6B6B", fontFamily: "Nunito, sans-serif" }}>
              Each step unlocks something new.
            </p>
            <p className="text-[14px] mt-1.5 leading-[1.6]" style={{ color: "#9B9BAB", fontFamily: "Nunito, sans-serif" }}>
              You're just getting started — your next reward is one step away.
            </p>
          </FadeSection>

          {(() => {
            const progressSteps: ProgressStep[] = [
              {
                task: "Tier 1 — 0 points",
                impact: "You earned 10 points just by signing up. Complete your profile, verify your email, and follow us on social media to start climbing.",
                reward: { icon: <Sparkles size={20} />, title: "You're officially a Story Pros founding member", desc: "Get behind-the-scenes development updates, Founding Member status, and your name on the Early Supporters Wall" },
                invites: 0,
              },
              {
                task: "Tier 2 — 35 points",
                impact: "Share your referral link with other families and post on social media to climb. You can reach this tier without any referrals.",
                reward: { icon: <Gift size={20} />, title: "FREE: Executive Function Skills for Your Child", desc: "A digital product normally paid in the Resource Hub, yours free the moment you hit Tier 2, plus your Tier 2 badge", subdesc: "Tip: Profile + email + 3 social follows gets you past Tier 2 right away" },
                invites: 1,
              },
              {
                task: "Tier 3 — 75 points",
                impact: "Keep referring families and sharing your link. Consistency is rewarded, the more you share, the faster you climb.",
                reward: { icon: <Gift size={20} />, title: "50 Story Coins dropped into your account", desc: "Story Coins are in-app currency you can spend on upgrades and extras when the app launches, plus your Tier 3 badge" },
                invites: 3,
              },
              {
                task: "Tier 4 — 130 points",
                impact: "You're making a real difference for families navigating DLD, ADHD, and Dyslexia. Your referrals bring more children into a tool designed specifically for how they think and communicate.",
                reward: { icon: <Crown size={20} />, title: "VIP Beta Access + Suggestion Board", desc: "Be one of the first families inside Story Pros before launch. Test the app, shape the final product, and unlock the Suggestion Board to weigh in on what we build next, plus your Tier 4 badge" },
                invites: 5,
              },
              {
                task: "Tier 5 — 250 points",
                impact: "You're among our most dedicated supporters. Heads up: points double from Tier 5 onward to push you toward Tier 6.",
                reward: { icon: <Headphones size={20} />, title: "Founder Pricing locked in for life", desc: "$7.99/month forever instead of the regular $9.99, a permanent 20% discount as long as your subscription stays active, plus your Tier 5 badge", subdesc: "This reward never expires. Once you earn it, it's yours" },
                invites: 10,
              },
              {
                task: "Tier 6 — 500 points",
                impact: "You're a true Story Pros founder. Limited to the first 50 members to reach Tier 6 by June 1.",
                reward: { icon: <Crown size={20} />, title: "Signed Dan & Daria book + DLD-themed merch", desc: "A signed copy of the Dan & Daria book and exclusive DLD-themed merch shipped to you, plus your Tier 6 Founder badge", subdesc: "After the first 50 Founder slots are claimed, additional Tier 6 members earn 100 bonus Story Coins as Legends" },
                invites: 25,
              },
            ];

            return <ScrollProgress steps={progressSteps} inviteCount={wl.inviteCount} />;
          })()}
        </div>
      </section>

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S7: COLLECTIVE GOAL ─── */}
      {(() => {
        const GOAL = COLLECTIVE_GOAL;
        const FILL_DURATION = 4000; // ms
        const HOLD_DURATION = 5000; // ms

        const AnimatedGoal = () => {
          const sectionRef = useRef<HTMLDivElement>(null);
          const barRef = useRef<HTMLDivElement>(null);
          const [displayCount, setDisplayCount] = useState(0);
          const [isVisible, setIsVisible] = useState(false);
          const phaseRef = useRef<"idle" | "filling" | "celebrating" | "holding">("idle");
          const rafRef = useRef<number>(0);
          const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

          // Ease-out cubic
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);

          const fireConfetti = useCallback(() => {
            if (!barRef.current) return;
            const rect = barRef.current.getBoundingClientRect();
            const x = (rect.right - 4) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            // Fire a few bursts for effect
            const colors = ["#7E5BEF", "#B794F6", "#DDD6FE", "#EDE9FE"];
            confetti({ particleCount: 60, spread: 45, origin: { x, y }, colors, gravity: 1.2, scalar: 0.9, ticks: 80 });
            setTimeout(() => {
              confetti({ particleCount: 40, spread: 35, origin: { x: x - 0.02, y: y - 0.02 }, colors, gravity: 1, scalar: 0.7, ticks: 60 });
            }, 150);
          }, []);

          const runCycle = useCallback(() => {
            phaseRef.current = "filling";
            const start = performance.now();

            const tick = (now: number) => {
              if (phaseRef.current !== "filling") return;
              const elapsed = now - start;
              const progress = Math.min(elapsed / FILL_DURATION, 1);
              const eased = ease(progress);
              setDisplayCount(Math.round(eased * GOAL));

              if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
              } else {
                // Reached goal — celebrate
                phaseRef.current = "celebrating";
                setDisplayCount(GOAL);
                fireConfetti();

                // Hold phase
                phaseRef.current = "holding";
                timeoutRef.current = setTimeout(() => {
                  if (phaseRef.current === "holding") {
                    setDisplayCount(0);
                    // Restart cycle
                    runCycle();
                  }
                }, HOLD_DURATION);
              }
            };

            rafRef.current = requestAnimationFrame(tick);
          }, [fireConfetti]);

          const stopAll = useCallback(() => {
            phaseRef.current = "idle";
            cancelAnimationFrame(rafRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }, []);

          useEffect(() => {
            const el = sectionRef.current;
            if (!el) return;

            const obs = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                } else {
                  setIsVisible(false);
                  stopAll();
                  setDisplayCount(0);
                }
              },
              { threshold: 0.85 }
            );
            obs.observe(el);
            return () => { obs.disconnect(); stopAll(); };
          }, [stopAll]);

          useEffect(() => {
            if (isVisible && phaseRef.current === "idle") {
              runCycle();
            }
          }, [isVisible, runCycle]);

          const pct = Math.min((displayCount / GOAL) * 100, 100);
          const remaining = GOAL - displayCount;

          return (
            <section ref={sectionRef} className="bg-lavender py-16 md:py-[120px]">
              <div className="container px-6 md:px-8">
                <div className="max-w-[650px] mx-auto text-center">
                  <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-foreground mb-6">
                    Our Collective Goal
                  </h2>
                  <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] mb-8">
                    If we reach 4,000 supporters, we will create a brand new Dan and Daria
                    story together. The community will help choose the theme, and this story
                    will become the fifth book in our Living Life with DLD book series.
                  </p>
                  <div className="bg-background/60 rounded-xl border border-border p-6">
                    <p className="text-[14px] font-semibold text-foreground mb-3">
                      {displayCount.toLocaleString()} supporter{displayCount !== 1 ? "s" : ""} and counting.{" "}
                      <span className="text-muted-foreground font-normal">
                        {remaining > 0 ? `${remaining.toLocaleString()} to go.` : "Goal reached! 🎉"}
                      </span>
                    </p>
                    <div ref={barRef} className="relative h-3 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-none"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        };

        return <AnimatedGoal />;
      })()}

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S8: SHARE THIS ─── */}
      <section className="py-16 md:py-[120px]">
        <div className="container px-6 md:px-8">
          <FadeSection className="max-w-[650px] mx-auto text-center">
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-foreground mb-6">
              Know Someone Who Would Care About This?
            </h2>
            <div className="bg-lavender rounded-xl border border-border p-6 text-left mb-5">
              <p className="text-[14px] md:text-[15px] text-foreground leading-[1.7] italic">
                "I just came across an app called Story Pros and have been trying to spread the word about it. It's being built to help kids feel more confident understanding and explaining their ideas. Thought of you. You can join the waitlist here."
              </p>
            </div>
            {wl.joined && wl.referralLink ? (
              <Button
                onClick={() => handleCopy(wl.referralLink)}
                className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors shadow-[var(--shadow-button)] gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Your Link"}
              </Button>
            ) : (
              <Button
                onClick={scrollToForm}
                className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors shadow-[var(--shadow-button)]"
              >
                Join First to Get Your Link
              </Button>
            )}
          </FadeSection>
        </div>
      </section>

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S9: CLOSING CTA + FORM ─── */}
      <section ref={formRef} className="bg-deep-purple py-20 md:py-28 lg:py-32">
        <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
          <h2 className="text-[28px] md:text-[42px] lg:text-[48px] font-black text-white leading-[1.1] max-w-[800px]">
            Be Part of Something That Could Change How Children Experience Communication
          </h2>

          {!wl.joined ? (
            <div className="w-full max-w-[520px]">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md"
                />
                <Button
                  type="submit"
                  disabled={wl.loading}
                  className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-colors shadow-[var(--shadow-button)] whitespace-nowrap"
                >
                  {wl.loading ? "Joining…" : "Join Now"}
                </Button>
              </form>
              <label className="flex items-start gap-2.5 mt-3 cursor-pointer group text-left">
                <input
                  type="checkbox"
                  checked={isSpeechPro}
                  onChange={(e) => setIsSpeechPro(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/40 bg-white/10 accent-primary cursor-pointer"
                />
                <span className="text-[13px] text-white/80 leading-[1.5]">
                  I'm a speech-language professional (SLP, SLT, Speech Therapist, etc.) — <span className="text-white/95 font-semibold">unlocks +50 bonus points after verification</span>
                </span>
              </label>
            </div>
          ) : (
            <div className="mt-4 text-center">
              <p className="text-white/80 text-[15px] mb-3">
                You're on the team! Share your link to unlock milestones:
              </p>
              <div className="flex items-center gap-2 justify-center">
                <code className="bg-white/10 border border-white/20 rounded-md px-4 py-2.5 text-white text-[13px] max-w-[320px] truncate">
                  {wl.referralLink}
                </code>
                <Button
                  onClick={() => handleCopy(wl.referralLink)}
                  variant="outline"
                  className="h-10 px-4 border-white/30 text-white bg-transparent hover:bg-white/10 rounded-md"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {wl.error && (
            <p className="text-white/70 text-[13px]">{wl.error}</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoryBuilders;
