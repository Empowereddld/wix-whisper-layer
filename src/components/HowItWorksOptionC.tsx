import React, { useState, useEffect, useCallback } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { BookOpen, MessageCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick a Story",
    description:
      "Choose from stories designed with SLPs, each targeting specific vocabulary and language skills.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Read Together",
    description:
      "Just 20 minutes. Built-in prompts guide the conversation so you always know what to say.",
    icon: MessageCircle,
  },
  {
    number: "03",
    title: "Watch Them Grow",
    description:
      "Track what your child is learning and get simple tips to keep practicing between sessions.",
    icon: TrendingUp,
  },
];

const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, className: fadeClass } = useScrollFadeIn({ delay });
  return <div ref={ref} className={`${fadeClass} ${className}`}>{children}</div>;
};

const HowItWorksOptionC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const activeStep = steps[activeIndex];
  const Icon = activeStep.icon;

  return (
    <section className="py-16 md:py-[120px] bg-background">
      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <FadeSection className="text-center mb-10 md:mb-14">
          <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
            Option C — Interactive Carousel
          </p>
          <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold text-foreground leading-[1.1] mb-4">
            Here's How Story Builders Works
          </h2>
          <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[500px] mx-auto">
            Simple enough for home. Powerful enough to make a difference.
          </p>
        </FadeSection>

        <FadeSection delay={200}>
          <div
            className="bg-muted rounded-2xl border border-border p-8 md:p-12 lg:p-16 text-center min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Animated content */}
            <div
              key={activeIndex}
              className="animate-fade-in flex flex-col items-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" strokeWidth={1.4} />
              </div>

              <span className="text-[48px] md:text-[64px] font-black text-primary/10 leading-none mb-2">
                {activeStep.number}
              </span>

              <h3 className="text-[22px] md:text-[28px] font-bold text-foreground mb-3 leading-[1.2]">
                {activeStep.title}
              </h3>

              <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[450px]">
                {activeStep.description}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-6">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="flex items-center gap-2 group"
                aria-label={`Go to step ${step.number}`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground/30"
                  }`}
                />
                {i === activeIndex && (
                  <span className="text-[12px] font-semibold text-foreground hidden md:inline">
                    {step.title}
                  </span>
                )}
              </button>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
};

export default HowItWorksOptionC;
