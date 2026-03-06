import { Check } from "lucide-react";
import educatorsTrust from "@/assets/educators-trust.png";

const trustPoints = [
  {
    title: "Supports early identification and intervention",
    description: "Evidence-based training helps your staff recognize DLD before students fall years behind. Early intervention = better long-term outcomes and reduced need for intensive support.",
  },
  {
    title: "Saves staff time and resources",
    description: "Ready-to-implement materials eliminate hours of prep work. Learning plan goal bank, lesson plans, and plug and play resources your team can use immediately.",
  },
  {
    title: "Demonstrates commitment to educational equity",
    description: "Multilingual resources and culturally responsive materials show your school's dedication to serving ALL students, particularly those from underrepresented communities.",
  },
  {
    title: "Inclusive practices",
    description: "Teaching strategies for DLD improve outcomes for all learners. Clear language instruction, visual supports, and structured activities strengthen communication skills across your entire student population.",
  },
];

const WhySchoolsChooseSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-lavender">
      <div className="container px-6 md:px-8">
        <h2 className="text-[24px] md:text-[34px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-6 md:mb-10">
          Why Schools Choose Empowered DLD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-8 md:gap-16 items-stretch">
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

          <div className="rounded-lg overflow-hidden">
            <img
              src={educatorsTrust}
              alt="An educator working with a student"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySchoolsChooseSection;
