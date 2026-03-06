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
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrolled = -rect.top;
      const scrollableRange = sectionHeight - window.innerHeight;

      if (scrolled < 0) {
        setActiveIndex(0);
        return;
      }
      if (scrolled > scrollableRange) {
        setActiveIndex(cards.length - 1);
        return;
      }

      const progress = scrolled / scrollableRange;
      const index = Math.min(
        cards.length - 1,
        Math.floor(progress * cards.length)
      );
      setActiveIndex(index);
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
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-lavender border border-border/30 rounded-xl p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-[18px] h-[18px] text-primary" strokeWidth={1.4} />
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

  // Desktop / Tablet: sticky stacked card scroll
  return (
    <section
      ref={sectionRef}
      className="relative md:h-[200vh] lg:h-[300vh]"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-10 text-center max-w-[650px]">
          <h2 className="text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            DLD is Affecting the Communities You Serve
          </h2>
          <p className="text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7]">
            Developmental Language Disorder affects 1 in 14 children, yet most
            people have never heard of it. Your organization can change that.
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative w-full max-w-[480px] h-[280px] md:h-[260px]">
          {cards.map((card, i) => {
            const Icon = card.icon;
            const isAbove = i < activeIndex;
            const isActive = i === activeIndex;
            const isBelow = i > activeIndex;

            // Stack offset for cards below active
            const belowOffset = isBelow ? (i - activeIndex) : 0;

            let transform = "";
            let opacity = 1;
            let zIndex = cards.length - i;

            if (isAbove) {
              // Cards that have scrolled away
              transform = `translateY(-120%) rotate(${card.rotation * 2}deg)`;
              opacity = 0;
              zIndex = i;
            } else if (isActive) {
              transform = `translateY(0) rotate(0deg)`;
              opacity = 1;
              zIndex = cards.length + 1;
            } else if (isBelow) {
              // Stacked cards underneath — subtle offsets
              const yOff = belowOffset * 6;
              const rot = card.rotation * 0.5;
              const scale = 1 - belowOffset * 0.02;
              transform = `translateY(${yOff}px) rotate(${rot}deg) scale(${scale})`;
              opacity = belowOffset <= 2 ? 1 - belowOffset * 0.15 : 0;
              zIndex = cards.length - belowOffset;
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

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-primary w-6"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DLDImpactSection;
