import { Button } from "@/components/ui/button";
import { Users, Stethoscope, GraduationCap, Building2 } from "lucide-react";

const paths = [
  {
    icon: Users,
    title: "For Parents and Caregivers",
    description: "Find practical, family-friendly tools to support your child's communication at home.",
    cta: "START HERE",
  },
  {
    icon: Stethoscope,
    title: "For Providers/Clinicians",
    description: "Access evidence-based tools, printable resources, and intervention supports for DLD.",
    cta: "START HERE",
  },
  {
    icon: GraduationCap,
    title: "For Teachers and Support Staff",
    description: "Use clear classroom strategies and accommodations that help students with DLD thrive.",
    cta: "START HERE",
  },
  {
    icon: Building2,
    title: "For Schools, Clinics, and Organizations",
    description: "Bring DLD training and structured resources to teams, programs, and communities.",
    cta: "START HERE",
  },
];

const ChoosePathSection = () => {
  return (
    <section className="py-14 md:py-18" id="resources">
      <div className="container">
        <div className="mb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
            Select Your Path
          </p>
          <h2 className="text-[26px] md:text-[30px] font-bold text-foreground mb-2">Start Here</h2>
          <p className="text-muted-foreground text-[14px] max-w-lg leading-[1.65]">
            Choose the path that fits you best. We have resources tailored for every role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-lavender border border-primary/[0.04] rounded-xl px-4 py-4 text-center flex flex-col items-center shadow-[0_1px_2px_hsl(258_50%_50%/0.04)] hover:shadow-[0_6px_20px_-4px_hsl(258_50%_50%/0.1)] hover:-translate-y-[2px] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mb-2.5 shadow-[0_1px_3px_hsl(258_50%_50%/0.07)]">
                <path.icon className="w-[18px] h-[18px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mb-1 leading-[1.3]">{path.title}</h3>
              <p className="text-[12px] text-muted-foreground mb-4 flex-1 leading-[1.55] max-w-[220px]">{path.description}</p>
              <Button size="sm" className="w-full h-8 rounded-lg text-[10px] font-bold uppercase tracking-[0.12em] shadow-[0_1px_3px_hsl(258_50%_50%/0.15)] hover:shadow-[0_3px_10px_hsl(258_50%_50%/0.2)] transition-all duration-300">
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
