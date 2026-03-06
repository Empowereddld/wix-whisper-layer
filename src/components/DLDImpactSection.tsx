import { useEffect, useRef, useState } from "react";
import { BarChart3, Heart, EyeOff, Users, GraduationCap, Briefcase } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const cards = [
  {
    icon: BarChart3,
    title: "1 in 14 People Have DLD",
    description:
      "You're already serving families affected by DLD. They just haven't been identified yet. In a community of 1,000 people, 75 have DLD.",
    rotation: -0.6,
  },
  {
    icon: Heart,
    title: "6x Higher Mental Health Risk",
    description:
      "Unidentified language disorders contribute to anxiety, depression, and social isolation throughout childhood and adulthood.",
    rotation: 0.4,
  },
  {
    icon: EyeOff,
    title: "Systematically Overlooked",
    description:
      "Girls, multilingual learners, and racialized individuals are least likely to receive DLD identification and support.",
    rotation: -0.3,
  },
  {
    icon: Users,
    title: "Social Isolation",
    description:
      "Children with DLD have fewer friendships and struggle with peer relationships, leading to loneliness and withdrawal.",
    rotation: 0.5,
  },
  {
    icon: GraduationCap,
    title: "Increased School Dropout Risk",
    description:
      "Students with unsupported DLD are more likely to disengage from education and leave school without completing their programs.",
    rotation: -0.4,
  },
  {
    icon: Briefcase,
    title: "Lower Employment Outcomes",
    description:
      "Adults with unidentified DLD face barriers to education and career advancement, limiting their economic opportunities.",
    rotation: 0.3,
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
      <section className="py-10">
        <div className="container px-6">
          <div className="mb-8">
            <h2 className="text-[28px] font-black text-foreground leading-[1.1] mb-3">
              DLD is Affecting the Communities You Serve
            </h2>
            <p className="text-[13px] text-muted-foreground leading-[1.7] max-w-[500px]">
              Developmental Language Disorder affects 1 in 14 children, yet most
              people have never heard of it. Your organization can change that.
            </p>
          </div>
          <div className="space-y-5">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-lavender border border-border/30 rounded-xl p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={1.4} />
                    </div>
                    <span className="text-[12px] text-muted-foreground/60 font-medium tracking-widest">
                      {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-black text-foreground mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-[1.7]">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Desktop / Tablet: two-column sticky stacked card scroll
  return (
    <section
      ref={sectionRef}
      className="relative md:h-[300vh] lg:h-[450vh]"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 md:px-8">
        <div className="flex items-center gap-10 lg:gap-16 max-w-[1100px] w-full mx-auto">

          {/* Left Column — Title + subtitle */}
          <div className="w-[38%] flex flex-col justify-center">
            <h2 className="text-[32px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-4">
              DLD is Affecting the Communities You Serve
            </h2>
            <p className="text-[13px] lg:text-[15px] text-muted-foreground leading-[1.7]">
              Developmental Language Disorder affects 1 in 14 children, yet most
              people have never heard of it. Your organization can change that.
            </p>
          </div>

          {/* Center — Card Stack */}
          <div className="w-[52%] flex items-center justify-center">
            <div className="relative w-full max-w-[480px] h-[280px] md:h-[260px]">
              {cards.map((card, i) => {
                const Icon = card.icon;
                const offset = scrollProgress - i;

                let transform = "";
                let opacity = 1;
                let zIndex = cards.length - i;

                if (offset >= 1) {
                  // Fully gone above
                  transform = `translateY(-120%) rotate(${card.rotation * 2}deg)`;
                  opacity = 0;
                  zIndex = i;
                } else if (offset > 0) {
                  // Actively leaving — continuous scroll-linked
                  const yOff = -offset * 120;
                  const rot = offset * card.rotation * 2;
                  opacity = 1 - offset * 0.8;
                  transform = `translateY(${yOff}%) rotate(${rot}deg)`;
                  zIndex = cards.length + 1;
                } else if (offset === 0 || (offset > -0.01 && offset < 0.01)) {
                  // Fully active
                  transform = `translateY(0) rotate(0deg)`;
                  opacity = 1;
                  zIndex = cards.length + 1;
                } else {
                  // Waiting below
                  const belowOffset = -offset;
                  const yOff = belowOffset * 8;
                  const rot = card.rotation * 0.5;
                  const scale = 1 - Math.min(belowOffset, 3) * 0.02;
                  transform = `translateY(${yOff}px) rotate(${rot}deg) scale(${scale})`;
                  opacity = belowOffset <= 2 ? 1 - belowOffset * 0.15 : 0;
                  zIndex = cards.length - Math.round(belowOffset);
                }

                return (
                  <div
                    key={card.title}
                    className="absolute inset-0 bg-lavender border border-border/30 rounded-xl p-8 md:p-10 shadow-[var(--shadow-elevated)] transition-all duration-500 ease-out"
                    style={{
                      transform,
                      opacity,
                      zIndex,
                    }}
                  >
                    <span className="absolute top-4 right-5 text-[11px] text-muted-foreground/30 font-medium tracking-widest select-none">
                      {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                    </span>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                      <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={1.4} />
                    </div>
                    <h3 className="text-[20px] lg:text-[22px] font-black text-foreground mb-3">
                      {card.title}
                    </h3>
                    <p className="text-[14px] text-muted-foreground leading-[1.7] max-w-[400px]">
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
