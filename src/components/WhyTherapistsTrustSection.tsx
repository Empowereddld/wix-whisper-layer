import { Check } from "lucide-react";
import boyReadingBench from "@/assets/boy-reading-bench.png";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const trustPoints = [
  {
    title: "Designed for real-world practice",
    description: "Created by clinicians and educators who understand school and clinic workflows.",
  },
  {
    title: "Evidence-based approach",
    description: "Partnering with university researchers on DLD intervention programs, including pilot affinity group curriculum. Grounded in speech-language pathology research.",
  },
  {
    title: "Serves diverse populations",
    description: "Resources in 8+ languages (Farsi, Arabic, Spanish, Chinese, French, Czech, Welsh, English) with representation that reflects your real caseload.",
  },
  {
    title: "Saves you prep time",
    description: "Ready-to-use books, guides, and tools. Spend less time creating materials, more time with clients.",
  },
  {
    title: "Families can use them",
    description: "Bridges the gap between clinic and home practice without requiring parent training.",
  },
];

const WhyTherapistsTrustSection = () => {
  const contentFade = useScrollFadeIn();
  const imageFade = useScrollFadeIn({ delay: 200 });

  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16 items-start">
          {/* Left — heading + checklist */}
          <div ref={contentFade.ref} className={contentFade.className}>
            <h2 className="text-[24px] md:text-[34px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-6 md:mb-10">
              Why Therapists Trust Empowered DLD
            </h2>

            <div className="flex flex-col gap-4 md:gap-6">
              {trustPoints.map((point) => (
                <div key={point.title} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 stroke-[2.5]" />
                  <div>
                    <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-foreground mb-1">
                      {point.title}
                    </p>
                    <p className="text-[12px] md:text-[13px] lg:text-[14px] text-muted-foreground leading-[1.7]">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div ref={imageFade.ref} className={`rounded-xl overflow-hidden lg:sticky lg:top-8 ${imageFade.className}`}>
            <img
              src={boyReadingBench}
              alt="A boy reading a book on a bench"
              className="w-full h-auto object-cover object-[center_70%] md:object-[center_35%] aspect-[4/3] md:aspect-[4/3] lg:aspect-[3/4] max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTherapistsTrustSection;
