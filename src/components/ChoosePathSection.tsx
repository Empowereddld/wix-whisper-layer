import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, GraduationCap, Building2 } from "lucide-react";

const paths = [
  {
    icon: Heart,
    title: "For Parents and Caregivers",
    description: "Learn how to support your child's language development at home with practical strategies and resources.",
    cta: "Start Here",
  },
  {
    icon: Stethoscope,
    title: "For Providers/ Clinicians",
    description: "Access clinical tools, research summaries, and therapy resources for your DLD clients.",
    cta: "Start Here",
  },
  {
    icon: GraduationCap,
    title: "For Teachers and Support Staff",
    description: "Discover classroom strategies and accommodations to help students with DLD thrive in school.",
    cta: "Start Here",
  },
  {
    icon: Building2,
    title: "For Schools, Clinics, and Organizations",
    description: "Find training programs and resources to build DLD awareness across your organization.",
    cta: "Start Here",
  },
];

const ChoosePathSection = () => {
  return (
    <section className="py-20 md:py-24" id="resources">
      <div className="container">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            Select Your Path
          </p>
          <h2 className="text-[26px] md:text-[32px] font-semibold text-foreground mb-3">Start Here</h2>
          <p className="text-muted-foreground text-[15px] max-w-xl leading-[1.7]">
            Choose the path that fits you best. We have resources tailored for every role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-lavender border border-primary/[0.06] rounded-xl p-6 text-center flex flex-col items-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <path.icon className="w-[22px] h-[22px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-2 leading-[1.3]">{path.title}</h3>
              <p className="text-[13px] text-muted-foreground mb-5 flex-1 leading-[1.65]">{path.description}</p>
              <Button size="sm" className="w-full h-9 rounded-lg text-[12px] font-semibold uppercase tracking-[0.1em]">
                {path.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChoosePathSection;
