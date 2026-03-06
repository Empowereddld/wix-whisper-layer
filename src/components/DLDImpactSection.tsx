import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const cards = [
  {
    title: "1 in 14 People Have DLD",
    description:
      "You're already serving families affected by DLD. They just haven't been identified yet. In a community of 1,000 people, 75 have DLD.",
    restRotation: -2.5,
  },
  {
    title: "6x Higher Mental Health Risk",
    description:
      "Unidentified language disorders contribute to anxiety, depression, and social isolation throughout childhood and adulthood.",
    restRotation: 1.8,
  },
  {
    title: "Systematically Overlooked",
    description:
      "Girls, multilingual learners, and racialized individuals are least likely to receive DLD identification and support.",
    restRotation: -1.5,
  },
  {
    title: "Social Isolation",
    description:
      "Children with DLD have fewer friendships and struggle with peer relationships, leading to loneliness and withdrawal.",
    restRotation: 2,
  },
  {
    title: "Increased School Dropout Risk",
    description:
      "Students with unsupported DLD are more likely to disengage from education and leave school without completing their programs.",
    restRotation: -1.8,
  },
  {
    title: "Lower Employment Outcomes",
    description:
      "Adults with unidentified DLD face barriers to education and career advancement, limiting their economic opportunities.",
    restRotation: 1.5,
  },
];

const DLDImpactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useIsMobile();

  const activeIndex = Math.round(scrollProgress);

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrolled = -rect.top;
      const scrollableRange = sectionHeight - window.innerHeight;

      if (scrolled < 0) {
        setScrollProgress(0);
        return;
      }
      if (scrolled > scrollableRange) {
        setScrollProgress(cards.length - 1);
        return;
      }

      const progress = scrolled / scrollableRange;
      setScrollProgress(Math.min(cards.length - 1, progress * (cards.length - 1)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className="py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-lavender/40 via-background to-background pointer-events-none" />
        <div className="container px-6 relative">
          <div className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-3 block">
              The Reality of DLD
            </span>
            <h2 className="text-[28px] font-black text-foreground leading-[1.1] mb-3">
              DLD is Affecting the Communities You Serve
            </h2>
            <p className="text-[13px] text-muted-foreground leading-[1.7] max-w-[500px]">
              Developmental Language Disorder affects 1 in 14 children, yet most
              people have never heard of it. Your organization can change that.
            </p>
          </div>
          <div className="space-y-5">
            {cards.map((card, i) => (
              <div
                key={card.title}
                className="rounded-xl p-7"
                style={{
                  background: "linear-gradient(145deg, #151515 0%, #050505 50%, #000000 100%)",
                  boxShadow: "0 8px 24px -4px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-[11px] font-medium tracking-widest select-none block mb-4" style={{ color: "hsl(0, 0%, 50%)" }}>
                  {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                </span>
                <h3 className="text-[18px] font-black mb-2" style={{ color: "hsl(0, 0%, 100%)" }}>
                  {card.title}
                </h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: "hsl(0, 0%, 72%)" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative md:h-[300vh] lg:h-[450vh]"
    >
      {/* Very soft background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, hsl(266 100% 97% / 0.5) 0%, hsl(0 0% 100%) 40%, hsl(0 0% 100%) 60%, hsl(266 100% 97% / 0.3) 100%)",
        }}
      />

      <div className="sticky top-0 h-screen flex items-center justify-center px-6 md:px-8 relative">
        <div className="flex items-center gap-12 lg:gap-20 max-w-[1100px] w-full mx-auto">

          {/* Left Column */}
          <div className="w-[36%] flex flex-col justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50 mb-5 block">
              The Reality of DLD
            </span>
            <h2 className="text-[32px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-6">
              DLD is Affecting the Communities You Serve
            </h2>
            <p className="text-[13px] lg:text-[15px] text-muted-foreground leading-[1.7] max-w-[360px]">
              Developmental Language Disorder affects 1 in 14 children, yet most
              people have never heard of it. Your organization can change that.
            </p>
          </div>

          {/* Center — Card Stack */}
          <div className="w-[52%] flex items-center justify-center">
            <div className="relative w-full max-w-[540px] h-[320px] md:h-[310px]">
              {cards.map((card, i) => {
                const offset = scrollProgress - i;

                // --- Compute per-card transforms ---
                let transform = "";
                let opacity = 1;
                let zIndex = cards.length - i;
                let shadow: string;
                let cardBg: string;

                if (offset >= 1) {
                  // Card has fully departed — moved up and faded
                  transform = `translateY(-100%) rotate(0deg) scale(0.98)`;
                  opacity = 0;
                  zIndex = i;
                  shadow = "none";
                  cardBg = "linear-gradient(145deg, #111 0%, #000 100%)";
                } else if (offset > 0) {
                  // Card is actively departing upward
                  const yOff = -offset * 90;        // slides up
                  const rot = card.restRotation * (1 - offset);  // straightens out
                  const scl = 1 - offset * 0.03;
                  opacity = 1 - offset * 0.6;
                  transform = `translateY(${yOff}%) rotate(${rot}deg) scale(${scl})`;
                  zIndex = cards.length + 1;
                  shadow = `0 4px 16px -4px rgba(0,0,0,${0.2 * (1 - offset)})`;
                  cardBg = "linear-gradient(145deg, #151515 0%, #050505 50%, #000 100%)";
                } else if (Math.abs(offset) < 0.01) {
                  // Active card — straightened, elevated, soft shadow
                  transform = `translateY(0) rotate(0deg) scale(1)`;
                  opacity = 1;
                  zIndex = cards.length + 1;
                  shadow = "0 12px 40px -8px rgba(0,0,0,0.35), 0 4px 12px -4px rgba(0,0,0,0.18)";
                  cardBg = "linear-gradient(145deg, #181818 0%, #080808 40%, #000 100%)";
                } else {
                  // Cards waiting below in the stack
                  const belowOffset = -offset; // positive number
                  const yOff = belowOffset * 10;   // peek down slightly
                  const rot = card.restRotation;    // keep resting rotation
                  const scl = 1 - Math.min(belowOffset, 4) * 0.015;
                  transform = `translateY(${yOff}px) rotate(${rot}deg) scale(${scl})`;
                  opacity = belowOffset <= 3 ? 1 - belowOffset * 0.12 : 0;
                  zIndex = cards.length - Math.round(belowOffset);
                  // Deeper shadows for cards further back
                  const shadowStrength = 0.25 + belowOffset * 0.06;
                  shadow = `0 ${14 + belowOffset * 4}px ${36 + belowOffset * 6}px -${6 + belowOffset}px rgba(0,0,0,${Math.min(shadowStrength, 0.55)})`;
                  cardBg = "linear-gradient(145deg, #111 0%, #000 100%)";
                }

                return (
                  <div
                    key={card.title}
                    className="absolute inset-0 rounded-2xl will-change-transform"
                    style={{
                      transform,
                      opacity,
                      zIndex,
                      background: cardBg,
                      boxShadow: shadow,
                      border: "1px solid rgba(255,255,255,0.05)",
                      padding: "44px 48px",
                      transition: "transform 150ms ease-out, opacity 150ms ease-out, box-shadow 200ms ease-out",
                    }}
                  >
                    <span
                      className="absolute top-6 right-7 text-[11px] font-medium tracking-widest select-none"
                      style={{ color: "hsl(0, 0%, 45%)" }}
                    >
                      {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-[21px] lg:text-[24px] font-black mb-3 mt-3"
                      style={{ color: "hsl(0, 0%, 100%)" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-[14px] lg:text-[15px] leading-[1.75] max-w-[420px]"
                      style={{ color: "hsl(0, 0%, 70%)" }}
                    >
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Progress dots */}
          <div className="w-[10%] flex flex-col items-center justify-center gap-2.5">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? "bg-primary w-2 h-6"
                    : "bg-border w-2 h-2"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default DLDImpactSection;
