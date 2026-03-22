import React from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import { BookOpen, MessageCircle, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Pick a Story",
    description:
      "Choose from stories designed with SLPs, each targeting specific vocabulary and language skills.",
    icon: BookOpen,
    gradient: "from-primary/10 to-primary/5",
    accent: "bg-primary",
  },
  {
    number: "02",
    title: "Read Together",
    description:
      "Just 20 minutes. Built-in prompts guide the conversation so you always know what to say.",
    icon: MessageCircle,
    gradient: "from-accent/20 to-accent/5",
    accent: "bg-accent",
  },
  {
    number: "03",
    title: "Watch Them Grow",
    description:
      "Track what your child is learning and get simple tips to keep practicing between sessions.",
    icon: TrendingUp,
    gradient: "from-secondary/30 to-secondary/10",
    accent: "bg-secondary",
  },
];

const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, className: fadeClass } = useScrollFadeIn({ delay });
  return <div ref={ref} className={`${fadeClass} ${className}`}>{children}</div>;
};

const HowItWorksOptionB = () => {
  return (
    <section className="py-16 md:py-[120px] bg-muted">
      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <FadeSection className="text-center mb-10 md:mb-14">
          <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
            Option B — Illustrated Cards
          </p>
          <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold text-foreground leading-[1.1] mb-4">
            Here's How Story Builders Works
          </h2>
          <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[500px] mx-auto">
            Simple enough for home. Powerful enough to make a difference.
          </p>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeSection key={step.number} delay={i * 120}>
                <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden h-full group hover:-translate-y-1 transition-transform duration-200">
                  {/* Gradient accent bar */}
                  <div className={`h-1.5 ${step.accent}`} />

                  {/* Icon area */}
                  <div className={`mx-6 mt-6 mb-4 h-[100px] md:h-[120px] rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center relative overflow-hidden`}>
                    {/* Geometric background shapes */}
                    <div className="absolute top-2 right-2 w-12 h-12 rounded-full border border-foreground/5" />
                    <div className="absolute bottom-3 left-3 w-8 h-8 rotate-45 border border-foreground/5" />
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-foreground/70 relative z-10" strokeWidth={1.4} />
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                      Step {step.number}
                    </span>
                    <h3 className="text-[18px] md:text-[20px] font-bold text-foreground mt-1 mb-3 leading-[1.2]">
                      {step.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksOptionB;
