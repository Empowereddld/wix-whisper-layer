import { useState, useRef, useEffect, useCallback } from "react";
import { DotBackground } from "@/components/ui/dot-background";
import SEOHead from "@/components/SEOHead";
import StoryBuildersStatBand from "@/components/StoryBuildersStatBand";
import storybuildersHero from "@/assets/storybuilders-hero.png";
import storybuildersAppMockup from "@/assets/storybuilders-app-mockup.png";
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
  Megaphone,
  Wrench,
  Heart,
} from "lucide-react";

/* ─── Milestones ─── */
const milestones = [
  { invites: 0, label: "Just joined", reward: "Early behind-the-scenes access and first look at new features" },
  { invites: 1, label: "Invite 1 storyteller", reward: "Early access to StoryBuilders before public launch" },
  { invites: 3, label: "Invite 3 storytellers", reward: "Printable Story Pack (story retell template, visual supports, parent prompts)" },
  { invites: 5, label: "Invite 5 storytellers", reward: "Exclusive Dan and Daria podcast episode, private access for Launch Team members only" },
  { invites: 10, label: "Invite 10 storytellers", reward: "Founder pricing at $5.99/month for life. Available to the first 100 people who reach this milestone." },
  { invites: -1, label: "Top 50 contributors", reward: "Recognized as a Founding Family or Founding Professional on our website (opt-in)" },
  { invites: -2, label: "Top 10 contributors", reward: "Dan and Daria t-shirt and a book signed by the voices of Dan and Daria" },
];

const COLLECTIVE_GOAL = 4000;

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
            What Is Story Builders
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
                alt="Story Builders app interface showing an interactive storytelling session"
                className="w-full max-w-[420px] rounded-2xl"
                style={{ boxShadow: "0 8px 60px -12px hsl(258, 50%, 50%, 0.25)" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: description */}
          <FadeSection className="lg:order-2 order-1">
            <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] mb-6">
              Story Builders is an interactive app designed to help children:
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

  const nextMilestone = milestones.find((m) => m.invites > 0 && m.invites > wl.inviteCount);
  const invitesNeeded = nextMilestone ? nextMilestone.invites - wl.inviteCount : 0;
  const progressPct = nextMilestone ? Math.min(100, (wl.inviteCount / nextMilestone.invites) * 100) : 100;
  const collectivePct = Math.min(100, (wl.totalCount / COLLECTIVE_GOAL) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <SEOHead
        title="StoryBuilders Launch Team — Join the Movement | Empowered DLD"
        description="Join the StoryBuilders Launch Team and help build a storytelling app for children with Developmental Language Disorder. Invite others, unlock rewards, and be part of something meaningful."
        path="/storybuilders"
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
                Join the Story Builders Launch Team and help us bring daily 20-minute story sessions that build vocabulary, comprehension, and confidence to children with DLD worldwide.
              </p>
              {!wl.joined ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3 w-full max-w-[520px] mt-5">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md focus-visible:ring-primary flex-1 min-w-[140px]"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
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
              ) : (
                <div className="flex items-center gap-2 mt-5">
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
              )}
              {wl.error && <p className="text-white/70 text-[13px]">{wl.error}</p>}
          </div>
        </div>
      </section>

      {/* ─── STAT BAND ─── */}
      <StoryBuildersStatBand />

      {/* ─── S2: HOOK ─── */}
      <section className="bg-white bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,hsl(266,100%,97%)_0%,transparent_100%)] py-16 md:py-24">
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
            Story Builders was created to change that.
          </p>
        </FadeSection>
      </section>

      {/* ─── S3: WHAT IS STORYBUILDERS ─── */}
      <WhatIsStoryBuildersSection />

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S4: WHY JOIN ─── */}
      <section className="py-16 md:py-[120px]">
        <div className="container px-6 md:px-8">
          <FadeSection className="text-center mb-12 md:mb-16">
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-foreground">
              Why Join the Launch Team
            </h2>
          </FadeSection>
          <FadeSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
              {[
                { icon: Megaphone, title: "Spread awareness of DLD" },
                { icon: Wrench, title: "Help shape a tool used across home, school, and therapy" },
                { icon: Heart, title: "Be part of something meaningful from the beginning" },
              ].map((card) => (
                <div key={card.title} className="bg-muted rounded-xl border border-border p-6 text-center premium-card">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-[14px] md:text-[15px] text-foreground font-semibold leading-[1.5]">{card.title}</p>
                </div>
              ))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
              {[
                "Join the Launch Team",
                "Invite other storytellers",
                "Unlock meaningful milestones",
              ].map((step, i) => (
                <div key={i} className="bg-background rounded-xl border border-border p-6 text-center premium-card">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-[15px] font-bold">
                    {i + 1}
                  </div>
                  <p className="text-[14px] md:text-[15px] text-foreground font-medium leading-[1.5]">{step}</p>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S6: MILESTONES ─── */}
      <section className="py-16 md:py-[120px]">
        <div className="container px-6 md:px-8">
          <FadeSection className="text-center mb-12 md:mb-16">
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-foreground">
              Your Milestones
            </h2>
          </FadeSection>

          <FadeSection delay={100}>
            <div className="max-w-[600px] mx-auto space-y-4">
              {milestones.map((m, i) => {
                const unlocked = m.invites >= 0 && wl.inviteCount >= m.invites;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-5 transition-colors ${
                      unlocked ? "bg-background border-coral/40" : "bg-muted border-border"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                          unlocked
                            ? "bg-coral/15 text-coral"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {m.invites >= 0 ? m.invites : "★"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-[14px] md:text-[15px]">
                          {m.label}
                          {unlocked && m.invites >= 0 && (
                            <span className="ml-2 text-coral text-[12px] font-bold uppercase tracking-wide">
                              Unlocked
                            </span>
                          )}
                        </p>
                        <p className="text-muted-foreground text-[13px] leading-[1.6] mt-1">{m.reward}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeSection>

          {/* Individual progress */}
          {wl.joined && (
            <FadeSection delay={200} className="max-w-[600px] mx-auto mt-10">
              <div className="rounded-xl border border-border bg-muted p-6">
                <p className="font-semibold text-foreground text-[15px]">Your progress</p>
                <p className="text-muted-foreground text-[13px] mt-1 mb-4">
                  You've invited {wl.inviteCount} storyteller{wl.inviteCount !== 1 ? "s" : ""}.
                  {nextMilestone
                    ? ` ${invitesNeeded} more to unlock your next milestone.`
                    : " You've unlocked all numbered milestones!"}
                </p>
                <Progress value={progressPct} className="h-2.5 bg-border [&>div]:bg-primary rounded-full" />
              </div>
            </FadeSection>
          )}
        </div>
      </section>

      <div className="w-16 h-px bg-border mx-auto" />

      {/* ─── S7: COLLECTIVE GOAL ─── */}
      <section className="bg-lavender py-16 md:py-[120px]">
        <div className="container px-6 md:px-8">
          <FadeSection className="max-w-[650px] mx-auto text-center">
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold tracking-tight text-foreground mb-6">
              Our Collective Goal
            </h2>
            <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.7] mb-8">
              If we reach 4,000 storytellers, we will create a brand new Dan and Daria
              story together. The community will help choose the theme, and this story
              will become the fifth book in our Living Life with DLD book series.
            </p>
            <div className="bg-background/60 rounded-xl border border-border p-6">
              <p className="text-[14px] font-semibold text-foreground mb-3">
                {wl.totalCount.toLocaleString()} storyteller{wl.totalCount !== 1 ? "s" : ""} and counting.{" "}
                <span className="text-muted-foreground font-normal">
                  {(COLLECTIVE_GOAL - wl.totalCount).toLocaleString()} to go.
                </span>
              </p>
              <Progress value={collectivePct} className="h-3 bg-border [&>div]:bg-primary rounded-full" />
            </div>
          </FadeSection>
        </div>
      </section>

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
                "I just joined the StoryBuilders Launch Team. It's an app being built
                to help children with DLD gain confidence in storytelling. If this
                matters to you, come join us."
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
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-[520px] mt-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-md"
              />
              <Input
                type="email"
                placeholder="Your email"
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
