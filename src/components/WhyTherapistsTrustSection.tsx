import { Check } from "lucide-react";
import boyReadingBench from "@/assets/boy-reading-bench.png";

const trustPoints = [
  {
    title: "Designed for real-world practice",
    description: "Every resource is built for actual therapy sessions — not just theory. Use them directly with clients from day one.",
  },
  {
    title: "Evidence-based approach",
    description: "Created by a certified SLP and experienced educator, grounded in current research on DLD and language intervention.",
  },
  {
    title: "Serves diverse populations",
    description: "Books and materials featuring characters from different backgrounds, available in 7+ languages to match your caseload.",
  },
  {
    title: "Saves you prep time",
    description: "Stop spending hours creating materials from scratch. Our ready-to-use resources let you focus on what matters — your clients.",
  },
  {
    title: "Families can use them too",
    description: "Share books and guides with parents to reinforce therapy goals at home. Multilingual options ensure every family can participate.",
  },
];

const WhyTherapistsTrustSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16 items-start">
          {/* Left — heading + checklist */}
          <div>
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
          <div className="rounded-xl overflow-hidden">
            <img
              src={boyReadingBench}
              alt="A boy reading a book on a bench"
              className="w-full h-auto object-cover aspect-[16/9] md:aspect-[4/3] lg:aspect-[4/5] max-h-[250px] md:max-h-[350px] lg:max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTherapistsTrustSection;
