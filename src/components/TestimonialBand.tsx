import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Finding Empowered DLD Parenting changed everything for our family. Before discovering this group, my son's DLD felt like a mystery I was trying to solve alone. These books, resources, podcast and courses finally gave us language--not just vocabulary, but understanding. You helped me see my son clearly, without shame or confusion, and gave me practical tools that actually work for him. Your work gave me confidence, hope, and a roadmap when I desperately needed both.",
    author: "Becca",
    role: "Parent",
  },
  {
    quote: "It's a lonely world parenting a child with DLD. It's an 'invisible disability' in that most people don't understand or even think it's real. My son looks fine, but he struggles with pretty much every social interaction and all of his learning and processing. His teachers think he's just not paying attention or trying most of the time. I used to think that too. Now I know it's not his fault and I can advocate for him. But it's exhausting. Empowered DLD parenting helps me feel I'm not alone.",
    author: "Stacie",
    role: "Parent",
  },
  {
    quote: "As a US-based SLP who specializes in DLD and literacy disorders, your products and the community you have created have been a tremendous boost to this highly underserved and under-recognized population. One of my goals is to create awareness and community for individuals with DLD in my state and your products have been such a beautiful addition. I have a middle school Black girl starting with me next week and I'm so excited for her to see herself represented in your materials.",
    author: "Brianne",
    role: "Speech Language Pathologist",
  },
];

const TestimonialBand = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);
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
    <section className="bg-deep-purple text-deep-purple-foreground py-14 lg:py-28">
      <div className="container max-w-[900px] text-center relative px-6 lg:px-8">
        <Quote className="w-10 h-10 lg:w-16 lg:h-16 text-primary-foreground/12 mx-auto mb-4 lg:mb-6 rotate-180 stroke-[1]" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 px-4 lg:px-8">
                <blockquote className="text-[14px] lg:text-[17px] leading-[1.75] mb-6 font-light tracking-[-0.01em]">
                  "{t.quote}"
                </blockquote>
                <p className="font-semibold text-[13px] tracking-wide">{t.author}</p>
                <p className="text-[11px] text-primary-foreground/40 mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-primary-foreground/25 hover:text-primary-foreground transition-colors duration-200"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-primary-foreground/25 hover:text-primary-foreground transition-colors duration-200"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-7 h-7 stroke-[1.5]" />
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
