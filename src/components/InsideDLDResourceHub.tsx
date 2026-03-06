import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import testimonialSarah from "@/assets/testimonial-sarah.png";
import testimonialEmily from "@/assets/testimonial-emily.png";
import testimonialTiffany from "@/assets/testimonial-tiffany.png";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "These resources have been a game-changer for our family. Everything is clear, practical, and easy to use right away.",
    name: "Sarah",
    designation: "Parent",
    src: testimonialSarah,
  },
  {
    quote:
      "I recommend Empowered DLD resources to every family I work with. They're evidence-based and beautifully designed.",
    name: "Emily",
    designation: "Speech Language Pathologist",
    src: testimonialEmily,
  },
  {
    quote:
      "Finally, resources that actually make sense for the classroom. My students benefit every single day.",
    name: "Tiffany",
    designation: "Educator",
    src: testimonialTiffany,
  },
];

const AnimatedTestimonials = ({
  items,
  autoplay = true,
}: {
  items: Testimonial[];
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
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-10">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {/* Image stack */}
        <div className="relative h-80 w-full">
          <AnimatePresence>
            {items.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: index === active ? 1 : 0.7,
                  scale: index === active ? 1 : 0.95,
                  z: index === active ? 0 : -100,
                  rotate: index === active ? 0 : randomRotateY(),
                  zIndex:
                    index === active ? 999 : items.length - Math.abs(index - active),
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom"
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  className="h-full w-full rounded-3xl object-cover object-center"
                  draggable={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-foreground">
              {items[active].name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {items[active].designation}
            </p>
            <motion.p className="text-lg text-muted-foreground mt-8 leading-relaxed">
              {items[active].quote.split(" ").map((word, index) => (
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
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container px-6 md:px-8 max-w-[900px] mx-auto text-center mb-8">
        <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-4">
          Inside the DLD Resource Hub
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] max-w-[700px] mx-auto">
          A growing library of practical tools designed to support children with
          Developmental Language Disorder at home, in therapy, and in the classroom.
          <br /><br />
          Everything is designed to be simple, clear, and ready to use right away.
        </p>
      </div>
      <AnimatedTestimonials items={testimonials} autoplay />
    </section>
  );
};

export default InsideDLDResourceHub;
