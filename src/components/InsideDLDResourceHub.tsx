import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import resourcePreview1 from "@/assets/resource-preview-1.png";
import resourcePreview2 from "@/assets/resource-preview-2.png";
import resourcePreview3 from "@/assets/resource-preview-3.png";
import resourcePreview4 from "@/assets/resource-preview-4.png";
import resourcePreview5 from "@/assets/resource-preview-5.png";

type ResourceItem = {
  title: string;
  subheading: string;
  description: string;
  src: string;
};

const resources: ResourceItem[] = [
  {
    title: "Dan and Daria's Tips for Little Talkers",
    subheading: "For Parents",
    description:
      "Everyday strategies to help younger children with DLD build communication skills during routines at home.",
    src: resourcePreview1,
  },
  {
    title: "Helping Kids Join Conversations",
    subheading: "Everyday Communication",
    description:
      "Understand why conversations are hard and learn simple strategies that help children participate more confidently with friends and family.",
    src: resourcePreview2,
  },
  {
    title: "Tips for Little Talkers",
    subheading: "For Younger Children",
    description:
      "Practical strategies parents can use during everyday routines to help younger children with DLD build communication skills naturally.",
    src: resourcePreview3,
  },
  {
    title: "Language Impact Checklist",
    subheading: "For SLPs",
    description:
      "Look beyond test scores and identify how language challenges affect real participation at home, school, and in social situations.",
    src: resourcePreview4,
  },
  {
    title: "Teacher Strategy Cheat Sheet",
    subheading: "Classroom Support",
    description:
      "Simple classroom strategies teachers can use immediately to support understanding, participation, and language development for students with DLD.",
    src: resourcePreview5,
  },
];

const AnimatedResources = ({
  items,
  autoplay = true,
}: {
  items: ResourceItem[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 8000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const activeItem = items[active];

  return (
    <div className="max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-0">
      <div className="relative isolate grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
        {/* Stacked image carousel */}
        <div className="relative h-72 md:h-[24rem] w-full overflow-visible isolate rounded-3xl">
          {items.map((item, index) => {
            const isActive = index === active;
            const offset = (index - active + items.length) % items.length;
            const cappedOffset = Math.min(offset, 3);

            return (
              <motion.div
                key={item.src}
                animate={{
                  scale: isActive ? 1 : 1 - cappedOffset * 0.04,
                  x: isActive ? 0 : cappedOffset * 18,
                  y: isActive ? 0 : cappedOffset * 4,
                  rotate: isActive ? 0 : cappedOffset * 3,
                  opacity: isActive ? 1 : Math.max(0.15, 0.65 - cappedOffset * 0.2),
                  zIndex: isActive ? 10 : 3 - cappedOffset,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 origin-center"
                style={{ pointerEvents: isActive ? "auto" : "none" }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="h-full w-full rounded-3xl object-contain object-center"
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-center gap-4 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                {activeItem.subheading}
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {activeItem.title}
              </h3>
              <motion.p className="text-lg text-muted-foreground mt-3 leading-relaxed">
                {activeItem.description.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 pt-8 md:pt-0">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group/button"
            >
              <ArrowLeft className="h-5 w-5 text-foreground group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group/button"
            >
              <ArrowRight className="h-5 w-5 text-foreground group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsideDLDResourceHub = () => {
  return (
    <section className="pt-4 md:pt-6 lg:pt-8 pb-10 md:pb-14 lg:pb-16">
      <div className="container px-6 md:px-8 max-w-7xl mx-auto">
        <div className="bg-muted rounded-2xl py-6 md:py-8 border border-border/50 shadow-sm">
          <div className="max-w-[900px] mx-auto text-center mb-0 px-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Featured Resources
            </p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1]">
              What's Inside
            </h2>
          </div>
          <AnimatedResources items={resources} autoplay />
        </div>
      </div>
    </section>
  );
};

export default InsideDLDResourceHub;
