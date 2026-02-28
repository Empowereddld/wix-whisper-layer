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
    <section className="py-18 md:py-22" id="resources">
      <div className="container">
        <div className="mb-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2.5 opacity-80">
            Select Your Path
          </p>
          <h2 className="text-[26px] md:text-[32px] font-bold text-foreground mb-2.5">Start Here</h2>
          <p className="text-muted-foreground text-[15px] max-w-xl leading-[1.7]">
            Choose the path that fits you best. We have resources tailored for every role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-lavender border border-primary/[0.05] rounded-xl p-5 text-center flex flex-col items-center premium-card"
            >
              <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center mb-3.5 shadow-[0_1px_4px_hsl(258_50%_50%/0.08)]">
                <path.icon className="w-[20px] h-[20px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5 leading-[1.3]">{path.title}</h3>
              <p className="text-[13px] text-muted-foreground mb-5 flex-1 leading-[1.6]">{path.description}</p>
              <Button size="sm" className="w-full h-9 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
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
