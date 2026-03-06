import { Check } from "lucide-react";
import educatorsTrust from "@/assets/educators-trust.png";

const trustPoints = [
  {
    title: "Supports early identification",
    description: "Our screening tools and teacher training help identify students with DLD earlier, so they can get support before they fall further behind.",
  },
  {
    title: "Saves staff time",
    description: "Ready-to-use materials, goal banks, and implementation guides mean your team spends less time creating resources and more time supporting students.",
  },
  {
    title: "Demonstrates commitment to educational equity",
    description: "Multilingual, culturally responsive resources show families and communities that your school is serious about serving every learner.",
  },
  {
    title: "Inclusive practices that benefit all students",
    description: "The strategies and accommodations that support students with DLD — like visual supports, simplified language, and structured routines — benefit every learner in the classroom.",
  },
];

const WhySchoolsChooseSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8 lg:gap-16 items-start">
          <div>
            <h2 className="text-[24px] md:text-[34px] lg:text-[46px] font-black text-foreground leading-[1.12] mb-6 md:mb-10">
              Why Schools Choose Empowered DLD
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

          <div className="rounded-xl overflow-hidden">
            <img
              src={educatorsTrust}
              alt="An educator working with a student"
              className="w-full h-auto object-cover aspect-[16/9] md:aspect-[4/3] lg:aspect-[4/5] max-h-[250px] md:max-h-[350px] lg:max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySchoolsChooseSection;
