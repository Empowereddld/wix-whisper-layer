import React from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const steps = [
  {
    number: "01",
    title: "Pick a Story",
    description:
      "Choose from stories designed with SLPs, each targeting specific vocabulary and language skills.",
  },
  {
    number: "02",
    title: "Read Together",
    description:
      "Just 20 minutes. Built-in prompts guide the conversation so you always know what to say.",
  },
  {
    number: "03",
    title: "Watch Them Grow",
    description:
      "Track what your child is learning and get simple tips to keep practicing between sessions.",
  },
];

const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, className: fadeClass } = useScrollFadeIn({ delay });
  return <div ref={ref} className={`${fadeClass} ${className}`}>{children}</div>;
};

const StoryBuildersHowItWorks = () => {
  return (
    <section className="py-16 md:py-[120px] bg-muted">
      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <FadeSection className="text-center mb-10 md:mb-14">
          <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold text-foreground leading-[1.1] mb-4">
            Here's How Story Builders Works
          </h2>
          <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[500px] mx-auto">
            Simple enough for home. Powerful enough to make a difference.
          </p>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <FadeSection key={step.number} delay={i * 120}>
              <div className="bg-background p-8 rounded-xl border border-border shadow-sm h-full">
                <span className="text-[40px] font-black text-primary/20 leading-none block">
                  {step.number}
                </span>
                <h3 className="text-[18px] md:text-[20px] font-bold text-foreground mt-2 mb-3 leading-[1.2]">
                  {step.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                  {step.description}
                </p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoryBuildersHowItWorks;
