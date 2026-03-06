import { useEffect, useRef, useState, useCallback } from "react";
import motherDaughterReading from "@/assets/mother-daughter-reading.png";
import boyThinking from "@/assets/boy-thinking.png";
import familyReading from "@/assets/family-reading.png";

const panels = [
  {
    step: "1 / 3",
    heading: "The Signs",
    body: (
      <>
        <p className="text-[15px] text-muted-foreground leading-[1.7] mb-4">
          Your child struggles to follow directions, even simple ones. They
          can't seem to find the right words. You're noticing:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-muted-foreground leading-[1.7]">
          <li>Trouble following multi-step instructions</li>
          <li>Difficulty retelling what happened at school</li>
          <li>Simpler sentences than other kids their age</li>
          <li>Explosive meltdowns when they can't communicate</li>
        </ul>
      </>
    ),
    cta: "Learn the Signs",
    image: motherDaughterReading,
    alt: "Mother and daughter reading together",
  },
  {
    step: "2 / 3",
    heading: "The Dismissals",
    body: (
      <p className="text-[15px] text-muted-foreground leading-[1.7]">
        You've been told "give it time," "they're shy," or "it's just a speech
        delay." But deep down, you know something more is going on. Your child
        is falling further behind each year — and the wait-and-see advice
        isn't working.
      </p>
    ),
    cta: "Break Through the Noise",
    image: boyThinking,
    alt: "Boy thinking",
  },
  {
    step: "3 / 3",
    heading: "The Answer",
    body: (
      <p className="text-[15px] text-muted-foreground leading-[1.7]">
        What if your child has Developmental Language Disorder (DLD) — a
        condition that affects 1 in 14 people, yet most parents have never
        heard of it? Understanding DLD changes everything. You can finally get
        answers, find the right support, and help your child thrive.
      </p>
    ),
    cta: "Get Answers Now",
    image: familyReading,
    alt: "Family reading together",
  },
];

const SplitScreenScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = panelRefs.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (idx !== -1 && idx !== activeIndex) {
            setTransitioning(true);
            setTimeout(() => {
              setActiveIndex(idx);
              setTransitioning(false);
            }, 200);
          }
        }
      }
    },
    [activeIndex]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.5,
    });

    panelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [handleIntersect]);

  const active = panels[activeIndex];

  return (
    <section style={{ backgroundColor: "#FAF9F7" }}>
      {/* Desktop */}
      <div className="hidden lg:flex">
        {/* Left sticky column */}
        <div className="w-[42%] relative">
          <div className="sticky top-0 h-screen flex items-center">
            <div className="px-10 xl:px-16 max-w-[480px] ml-auto mr-0">
              <div
                className="transition-all duration-[400ms] ease-in-out"
                style={{
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning
                    ? "translateY(12px)"
                    : "translateY(0)",
                }}
              >
                <span className="text-[13px] font-semibold tracking-widest uppercase text-muted-foreground/60 mb-4 block">
                  {active.step}
                </span>
                <h2 className="font-serif text-[36px] xl:text-[42px] leading-[1.1] mb-5 text-foreground">
                  {active.heading}
                </h2>
                <div className="mb-8">{active.body}</div>
                <a
                  href="#contact"
                  className="inline-block rounded-full bg-primary text-primary-foreground px-8 py-3 text-[13px] font-semibold tracking-wide hover:bg-primary/90 transition-colors"
                >
                  {active.cta}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right scrolling column */}
        <div className="w-[58%] py-8">
          {panels.map((panel, i) => (
            <div
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="h-[80vh] px-6 py-4"
            >
              <div className="h-full w-full rounded-xl overflow-hidden">
                <img
                  src={panel.image}
                  alt={panel.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden py-12 px-6 md:px-8 space-y-16">
        {panels.map((panel, i) => (
          <div key={i} className="space-y-6">
            <div>
              <span className="text-[12px] font-semibold tracking-widest uppercase text-muted-foreground/60 mb-3 block">
                {panel.step}
              </span>
              <h2 className="font-serif text-[28px] md:text-[34px] leading-[1.1] mb-4 text-foreground">
                {panel.heading}
              </h2>
              <div className="mb-5">{panel.body}</div>
              <a
                href="#contact"
                className="inline-block rounded-full bg-primary text-primary-foreground px-7 py-2.5 text-[13px] font-semibold tracking-wide hover:bg-primary/90 transition-colors"
              >
                {panel.cta}
              </a>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src={panel.image}
                alt={panel.alt}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SplitScreenScroll;
