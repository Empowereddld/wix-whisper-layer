import { useEffect, useRef, useState } from "react";

const cards = [
  {
    title: "1 in 14 People Have DLD",
    description:
      "You're already serving families affected by DLD. They just haven't been identified yet. In a community of 1,000 people, 75 have DLD.",
    rotation: -1.5,
  },
  {
    title: "6x Higher Mental Health Risk",
    description:
      "Unidentified language disorders contribute to anxiety, depression, and social isolation throughout childhood and adulthood.",
    rotation: 1.2,
  },
  {
    title: "Systematically Overlooked",
    description:
      "Girls, multilingual learners, and racialized individuals are least likely to receive DLD identification and support.",
    rotation: -1,
  },
  {
    title: "Social Isolation",
    description:
      "Children with DLD have fewer friendships and struggle with peer relationships, leading to loneliness and withdrawal.",
    rotation: 1.5,
  },
  {
    title: "Increased School Dropout Risk",
    description:
      "Students with unsupported DLD are more likely to disengage from education and leave school without completing their programs.",
    rotation: -1.2,
  },
  {
    title: "Lower Employment Outcomes",
    description:
      "Adults with unidentified DLD face barriers to education and career advancement, limiting their economic opportunities.",
    rotation: 1,
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

  // Mobile: simple vertical list
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
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card, i) => (
              <div
                key={card.title}
                className="rounded-xl p-5 shadow-[var(--shadow-card)]"
                style={{
                  background: "linear-gradient(145deg, #111111 0%, #000000 100%)",
                }}
              >
                <span className="text-[10px] font-medium tracking-widest select-none block mb-2" style={{ color: "hsl(0, 0%, 55%)" }}>
                  {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                </span>
                <h3 className="text-[14px] font-black mb-1.5" style={{ color: "hsl(0, 0%, 100%)" }}>
                  {card.title}
                </h3>
                <p className="text-[11px] leading-[1.6]" style={{ color: "hsl(0, 0%, 78%)" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop / Tablet: two-column sticky stacked card scroll
  return (
    <section
      ref={sectionRef}
      className="relative md:h-[450vh]"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-lavender/30 via-background to-background pointer-events-none" />

      <div className="sticky top-0 h-screen flex items-center justify-center px-6 md:px-8 relative">
        <div className="flex items-center gap-10 lg:gap-16 max-w-[1100px] w-full mx-auto">

          {/* Left Column — Label + Title + subtitle */}
          <div className="w-[38%] flex flex-col justify-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-5 block">
              The Reality of DLD
            </span>
            <h2 className="text-[40px] lg:text-[52px] font-black text-foreground leading-[1.05] mb-6">
              DLD is Affecting the Communities You Serve
            </h2>
            <p className="text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7]">
              Developmental Language Disorder affects 1 in 14 children, yet most
              people have never heard of it. Your organization can change that.
            </p>
          </div>

          {/* Center — Card Stack (10-15% wider) */}
          <div className="w-[52%] flex items-center justify-center">
            <div className="relative w-full max-w-[540px] h-[310px] md:h-[300px]">
              {cards.map((card, i) => {
                const offset = scrollProgress - i;
                const isActive = Math.abs(offset) < 0.5;

                // Layered shadows: deeper for lower cards
                const depthIndex = Math.max(0, Math.min(cards.length - 1, Math.round(Math.abs(offset))));
                const shadowBase = isActive
                  ? "0 8px 24px -4px rgba(0,0,0,0.25), 0 2px 8px -2px rgba(0,0,0,0.15)"
                  : `0 ${12 + depthIndex * 4}px ${32 + depthIndex * 8}px -${4 + depthIndex * 2}px rgba(0,0,0,${0.3 + depthIndex * 0.05}), 0 4px 12px -4px rgba(0,0,0,0.2)`;

                // Subtle gradient on black cards
                const cardBg = isActive
                  ? "linear-gradient(145deg, #151515 0%, #050505 50%, #000000 100%)"
                  : "linear-gradient(145deg, #111111 0%, #000000 100%)";

                let transform = "";
                let opacity = 1;
                let zIndex = cards.length - i;

                if (offset >= 1) {
                  transform = `translate(40%, -120%) rotate(4deg)`;
                  opacity = 0;
                  zIndex = i;
                } else if (offset > 0) {
                  const yOff = -offset * 120;
                  const xOff = offset * 40;
                  const rot = offset * 4;
                  opacity = 1;
                  transform = `translate(${xOff}%, ${yOff}%) rotate(${rot}deg)`;
                  zIndex = cards.length + 1;
                } else if (offset === 0 || (offset > -0.01 && offset < 0.01)) {
                  transform = `translateY(0) rotate(0deg) scale(1.01)`;
                  opacity = 1;
                  zIndex = cards.length + 1;
                } else {
                  const belowOffset = -offset;
                  const yOff = belowOffset * 8;
                  const rot = card.rotation;
                  const scale = 1 - Math.min(belowOffset, 3) * 0.02;
                  transform = `translateY(${yOff}px) rotate(${rot}deg) scale(${scale})`;
                  opacity = belowOffset <= 2 ? 1 - belowOffset * 0.15 : 0;
                  zIndex = cards.length - Math.round(belowOffset);
                }

                return (
                  <div
                    key={card.title}
                    className="absolute inset-0 rounded-xl transition-all duration-100 ease-out"
                    style={{
                      transform,
                      opacity,
                      zIndex,
                      background: cardBg,
                      boxShadow: shadowBase,
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "40px 44px",
                      display: "flex",
                      flexDirection: "column" as const,
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center" as const,
                    }}
                  >
                    <span
                      className="absolute top-5 right-6 text-[11px] font-medium tracking-widest select-none"
                      style={{ color: "hsl(0, 0%, 55%)" }}
                    >
                      {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                    </span>

                    <h3
                      className="text-[21px] lg:text-[24px] font-black mb-3"
                      style={{ color: "hsl(0, 0%, 100%)" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-[14px] lg:text-[15px] leading-[1.75] max-w-[380px]"
                      style={{ color: "hsl(0, 0%, 78%)" }}
                    >
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Vertical progress dots */}
          <div className="w-[10%] flex flex-col items-center justify-center gap-2">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? "bg-foreground w-2 h-6"
                    : "bg-foreground/20 w-2 h-2"
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
