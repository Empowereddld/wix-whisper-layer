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
    <section className="py-20 md:py-28" id="resources">
      <div className="container">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
            Select Your Path
          </p>
          <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-2">Start Here</h2>
          <p className="text-muted-foreground text-base max-w-xl leading-[1.7]">
            Choose the path that fits you best. We have resources tailored for every role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-lavender border border-border/20 rounded-xl p-6 text-center flex flex-col items-center hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-5 shadow-sm">
                <path.icon className="w-7 h-7 text-primary stroke-[1.5]" />
              </div>
              <h3 className="font-sans text-[15px] font-semibold text-foreground mb-2 leading-snug">{path.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1 leading-[1.7]">{path.description}</p>
              <Button size="sm" className="w-full h-10 rounded-lg text-sm font-semibold uppercase tracking-wider">
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
