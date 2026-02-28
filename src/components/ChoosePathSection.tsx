import { Button } from "@/components/ui/button";
import iconParents from "@/assets/icon-parents.png";
import iconSlps from "@/assets/icon-slps.png";
import iconEducators from "@/assets/icon-educators.png";
import iconOrganizations from "@/assets/icon-organizations.png";

const paths = [
  {
    icon: iconParents,
    title: "For Parents and Caregivers",
    description: "Find practical, family-friendly tools to support your child's communication at home.",
    cta: "LEARN MORE",
  },
  {
    icon: iconSlps,
    title: "For Providers/Clinicians",
    description: "Access evidence-based tools, printable resources, and intervention supports for DLD.",
    cta: "LEARN MORE",
  },
  {
    icon: iconEducators,
    title: "For Teachers and Support Staff",
    description: "Use clear classroom strategies and accommodations that help students with DLD thrive.",
    cta: "LEARN MORE",
  },
  {
    icon: iconOrganizations,
    title: "For Schools, Clinics, and Organizations",
    description: "Bring DLD training and structured resources to teams, programs, and communities.",
    cta: "LEARN MORE",
  },
];

const ChoosePathSection = () => {
  return (
    <section className="py-14 md:py-18" id="resources">
      <div className="container">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
            Choose Your Path
          </p>
          <h2 className="text-[32px] md:text-[40px] font-bold text-foreground mb-2">Start Here</h2>
          <p className="text-muted-foreground text-[14px] max-w-lg leading-[1.65]">
            Choose the path that fits you best. We have resources tailored for every role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paths.map((path) => (
            <div
              key={path.title}
              className="border border-border rounded-xl px-5 py-6 text-left flex flex-col items-start hover:shadow-[0_6px_20px_-4px_hsl(258_50%_50%/0.1)] hover:-translate-y-[2px] transition-all duration-300"
            >
              <img
                src={path.icon}
                alt={path.title}
                className="w-16 h-16 object-contain mb-4"
              />
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5 leading-[1.3]">{path.title}</h3>
              <p className="text-[12.5px] text-muted-foreground mb-5 flex-1 leading-[1.6]">{path.description}</p>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-[0.12em] border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
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
