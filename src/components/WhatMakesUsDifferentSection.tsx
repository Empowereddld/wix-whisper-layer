import { Check } from "lucide-react";
import foundersPhoto from "@/assets/founders-photo.webp";

const points = [
  {
    title: "Real world experience",
    description: "Our work is grounded in both classroom and clinical practice.",
  },
  {
    title: "Evidence informed",
    description: "Strategies are aligned with current research on Developmental Language Disorder.",
  },
  {
    title: "Practical and immediately usable",
    description: "Participants leave with tools they can implement the next day in classrooms, therapy sessions, or home support.",
  },
];

const WhatMakesUsDifferentSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[80px]">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16 items-start">
          {/* Left — heading + checklist */}
          <div>
            <h2 className="text-[24px] md:text-[34px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-6 md:mb-10">
              What Makes Our Approach Different
            </h2>

            <div className="flex flex-col gap-4 md:gap-6">
              {points.map((point) => (
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
              src={foundersPhoto}
              alt="Empowered DLD founders"
              className="w-full h-auto object-cover object-[center_30%] aspect-[16/9] md:aspect-[4/3] lg:aspect-[5/4] max-h-[250px] md:max-h-[350px] lg:max-h-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDifferentSection;
