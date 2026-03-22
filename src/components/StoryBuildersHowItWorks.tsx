import React, { useEffect, useState } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { BookOpen, CheckCircle2, MessageCircle } from "lucide-react";

const STEP_DURATION = 2800;

/* ── Step 1: Story Selection ── */
const StorySelectionScreen = () => {
  const stories = [
    { title: "Dan's Big Day", emoji: "🌟", selected: false },
    { title: "The Park Adventure", emoji: "🌳", selected: true },
    { title: "Daria's New Friend", emoji: "💜", selected: false },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Choose a Story
        </p>
      </div>
      <div className="flex-1 px-4 flex flex-col gap-2.5">
        {stories.map((s) => (
          <div
            key={s.title}
            className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
              s.selected
                ? "bg-primary/10 ring-2 ring-primary shadow-sm"
                : "bg-muted/60"
            }`}
          >
            <span className="text-xl">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[13px] font-semibold leading-tight ${
                  s.selected ? "text-primary" : "text-foreground"
                }`}
              >
                {s.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                5 min · Vocabulary
              </p>
            </div>
            {s.selected && (
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Step 2: Reading Screen ── */
const ReadingScreen = () => (
  <div className="flex flex-col h-full">
    <div className="px-4 pt-3 pb-2 flex items-center gap-2">
      <BookOpen className="h-3.5 w-3.5 text-primary" />
      <p className="text-[11px] font-semibold text-primary">
        The Park Adventure
      </p>
    </div>
    <div className="flex-1 px-4 flex flex-col justify-between">
      <div className="space-y-3 mt-1">
        <p className="text-[12px] text-foreground leading-relaxed">
          Dan and Daria walked to the park together. The sun was warm and
          the birds were singing in the trees.
        </p>
        <p className="text-[12px] text-foreground leading-relaxed">
          "Look!" said Daria, pointing at the big slide. "Can we go on
          that one first?"
        </p>
      </div>
      <div className="pb-3">
        <div className="bg-accent/60 rounded-full px-4 py-2.5 flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" />
          <p className="text-[11px] text-foreground font-medium">
            What happened first?
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ── Step 3: Progress / Success ── */
const ProgressScreen = () => (
  <div className="flex flex-col h-full items-center justify-center px-6 text-center gap-4">
    <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
      <CheckCircle2 className="h-8 w-8 text-primary" />
    </div>
    <div>
      <p className="text-[15px] font-bold text-foreground">Great job!</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        You completed today's story.
      </p>
    </div>
    <div className="w-full max-w-[180px] space-y-1.5">
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: "60%" }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">
        3 of 5 stories completed
      </p>
    </div>
  </div>
);

/* ── Tablet Frame ── */
const steps = [
  { label: "Pick a Story", component: StorySelectionScreen },
  { label: "Read Together", component: ReadingScreen },
  { label: "Watch Them Grow", component: ProgressScreen },
];

const TabletPreview = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % steps.length);
        setVisible(true);
      }, 400);
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, []);

  const ActiveComponent = steps[active].component;

  return (
    <div className="w-full max-w-[300px] md:max-w-[280px] lg:max-w-[300px] mx-auto">
      {/* Tablet outer frame */}
      <div className="rounded-[24px] bg-foreground/5 border border-border shadow-lg p-2">
        {/* Top bar */}
        <div className="flex items-center justify-center gap-1.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/15" />
        </div>
        {/* Screen */}
        <div className="bg-background rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <div
            className={`h-full transition-opacity duration-500 ease-in-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ActiveComponent />
          </div>
        </div>
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 py-2.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-foreground/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── FadeSection helper ── */
const FadeSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const { ref, className: fadeClass } = useScrollFadeIn({ delay });
  return (
    <div ref={ref} className={`${fadeClass} ${className}`}>
      {children}
    </div>
  );
};

/* ── Main Section ── */
const StoryBuildersHowItWorks = () => {
  return (
    <section className="py-16 md:py-[120px] bg-muted">
      <div className="max-w-[1000px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Left: Text */}
          <FadeSection>
            <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold text-foreground leading-[1.1] mb-4">
              How Story Builders Works
            </h2>
            <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[400px]">
              Simple, structured, and designed to fit into everyday life.
            </p>
            {/* Step labels */}
            <div className="mt-8 space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[28px] font-black text-primary/20 leading-none mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] font-semibold text-foreground">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeSection>

          {/* Right: Animated Tablet */}
          <FadeSection delay={150}>
            <TabletPreview />
          </FadeSection>
        </div>
      </div>
    </section>
  );
};

export default StoryBuildersHowItWorks;
