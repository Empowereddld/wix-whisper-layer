import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <section className="bg-deep-purple text-deep-purple-foreground py-20 md:py-[120px]">
      <div className="container max-w-[800px] text-center relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 px-4">
                <blockquote className="text-lg md:text-xl leading-relaxed mb-6 italic">
                  "{t.quote}"
                </blockquote>
                <p className="font-semibold text-base">{t.author}</p>
                <p className="text-sm text-white/60">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === selectedIndex ? "bg-white" : "bg-white/30"
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
