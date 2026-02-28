import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Empowered DLD has been a game-changer for our family. We finally have the tools and confidence to support our daughter's language development.",
    author: "Sarah M.",
    role: "Parent",
  },
  {
    quote: "The classroom resources are incredibly practical. My students with DLD are more engaged and confident than ever before.",
    author: "Jessica T.",
    role: "3rd Grade Teacher",
  },
  {
    quote: "As an SLP, I recommend Empowered DLD to every family I work with. The resources are evidence-based and beautifully designed.",
    author: "Dr. Karen L.",
    role: "Speech-Language Pathologist",
  },
];

const TestimonialBand = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="bg-deep-purple text-deep-purple-foreground py-18 md:py-22">
      <div className="container max-w-[680px] text-center relative">
        <Quote className="w-9 h-9 text-primary-foreground/15 mx-auto mb-5 rotate-180 stroke-[1.2]" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 px-4">
                <blockquote className="text-[17px] md:text-[19px] leading-[1.7] mb-6 font-light tracking-[-0.01em]">
                  "{t.quote}"
                </blockquote>
                <p className="font-semibold text-[14px] tracking-wide">{t.author}</p>
                <p className="text-[12px] text-primary-foreground/40 mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-primary-foreground/25 hover:text-primary-foreground transition-colors duration-200"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-primary-foreground/25 hover:text-primary-foreground transition-colors duration-200"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="flex justify-center gap-2 mt-7">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === selectedIndex ? "bg-primary-foreground w-4" : "bg-primary-foreground/20"
              }`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialBand;
