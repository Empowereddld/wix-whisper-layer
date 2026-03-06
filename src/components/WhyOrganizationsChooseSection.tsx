import { Check } from "lucide-react";
import orgWorkshop from "@/assets/org-workshop.png";

const trustPoints = [
  {
    title: "Your families can actually use our materials",
    description: "Resources in 8+ languages (Farsi, Arabic, Spanish, Chinese, French etc) that work for the diverse communities you serve",
  },
  {
    title: "We do the heavy lifting",
    description: "Ready-to-deliver workshops and training so your team doesn't have to become DLD experts or create content from scratch",
  },
  {
    title: "We help you reach the families others miss",
    description: "Specialized training on recognizing DLD in girls, racialized children, and multilingual learners",
  },
  {
    title: "Fits your budget and timeline",
    description: "From one-time workshops to comprehensive year-long partnerships, with everything in between",
  },
  {
    title: "Trusted by organizations like yours",
    description: "Working with family service agencies, newcomer programs, and EarlyON centers across Ontario and beyond",
  },
];

const WhyOrganizationsChooseSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16 items-start">
          {/* Left — heading + checklist */}
          <div>
            <h2 className="text-[24px] md:text-[34px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-6 md:mb-10">
              Why Organizations Choose Empowered DLD
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
              src={orgWorkshop}
              alt="Workshop training session with educators"
              className="w-full h-auto object-cover aspect-[16/9] md:aspect-[4/3] lg:aspect-[4/5] max-h-[250px] md:max-h-[350px] lg:max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyOrganizationsChooseSection;
