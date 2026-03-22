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

/* Positions for 3 nodes around a circle (top, bottom-right, bottom-left) */
const nodePositions = [
  { cx: 50, cy: 8 },   // top center
  { cx: 91, cy: 72 },  // bottom right
  { cx: 9, cy: 72 },   // bottom left
];

const FadeSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, className: fadeClass } = useScrollFadeIn({ delay });
  return <div ref={ref} className={`${fadeClass} ${className}`}>{children}</div>;
};

const HowItWorksOptionA = () => {
  return (
    <section className="py-16 md:py-[120px] bg-background">
      <div className="max-w-[900px] mx-auto px-6 md:px-8">
        <FadeSection className="text-center mb-6">
          <p className="text-[11px] md:text-[12px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
            Option A — Animated Loop
          </p>
          <h2 className="text-[32px] md:text-[42px] lg:text-[46px] font-bold text-foreground leading-[1.1] mb-4">
            Here's How Story Builders Works
          </h2>
          <p className="text-[14px] md:text-[16px] text-muted-foreground leading-[1.7] max-w-[500px] mx-auto">
            Simple enough for home. Powerful enough to make a difference.
          </p>
        </FadeSection>

        <FadeSection delay={200}>
          <div className="relative w-full max-w-[600px] mx-auto" style={{ aspectRatio: "1 / 0.85" }}>
            {/* SVG circle path with traveling dot */}
            <svg
              viewBox="0 0 100 85"
              fill="none"
              className="absolute inset-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Triangle path connecting the 3 nodes */}
              <path
                d="M50 8 L91 72 L9 72 Z"
                stroke="hsl(var(--border))"
                strokeWidth="0.4"
                fill="none"
                strokeDasharray="2 2"
              />

              {/* Animated traveling dot */}
              <circle r="1.2" fill="hsl(var(--primary))">
                <animateMotion
                  dur="6s"
                  repeatCount="indefinite"
                  path="M50 8 L91 72 L9 72 Z"
                />
              </circle>

              {/* Directional arrows along each edge */}
              {/* Top to bottom-right */}
              <polygon points="72,42 70,39 74,40" fill="hsl(var(--primary))" opacity="0.4" />
              {/* Bottom-right to bottom-left */}
              <polygon points="50,72 52,69 48,69" fill="hsl(var(--primary))" opacity="0.4" />
              {/* Bottom-left to top */}
              <polygon points="28,42 30,39 26,40" fill="hsl(var(--primary))" opacity="0.4" transform="rotate(0)" />
            </svg>

            {/* Step cards positioned around the triangle */}
            {steps.map((step, i) => {
              const pos = nodePositions[i];
              // Convert SVG coords to percentage positioning
              const left = `${pos.cx}%`;
              const top = `${pos.cy}%`;
              return (
                <div
                  key={step.number}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-[140px] md:w-[180px] text-center"
                  style={{ left, top }}
                >
                  <div className="bg-background border border-border rounded-xl p-4 md:p-5 shadow-sm">
                    <span className="text-[28px] md:text-[36px] font-black text-primary/20 leading-none block">
                      {step.number}
                    </span>
                    <h3 className="text-[14px] md:text-[16px] font-bold text-foreground mt-1 mb-2 leading-[1.2]">
                      {step.title}
                    </h3>
                    <p className="text-[11px] md:text-[12px] text-muted-foreground leading-[1.6]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeSection>
      </div>
    </section>
  );
};

export default HowItWorksOptionA;
