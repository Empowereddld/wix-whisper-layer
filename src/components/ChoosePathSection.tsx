import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, GraduationCap, Building2 } from "lucide-react";

const paths = [
  {
    icon: Heart,
    title: "Parents & Caregivers",
    description: "Learn how to support your child's language development at home with practical strategies and resources.",
    cta: "Start Here",
  },
  {
    icon: Stethoscope,
    title: "Providers & Clinicians",
    description: "Access clinical tools, research summaries, and therapy resources for your DLD clients.",
    cta: "Start Here",
  },
  {
    icon: GraduationCap,
    title: "Teachers & Support Staff",
    description: "Discover classroom strategies and accommodations to help students with DLD thrive in school.",
    cta: "Start Here",
  },
  {
    icon: Building2,
    title: "Schools & Organizations",
    description: "Find training programs and resources to build DLD awareness across your organization.",
    cta: "Start Here",
  },
];

const ChoosePathSection = () => {
  return (
    <section className="py-16 md:py-24" id="resources">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Start Here</h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Choose the path that fits you best. We have resources tailored for every role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-lavender border border-border rounded-[10px] p-6 text-left min-h-[200px] flex flex-col hover:shadow-md hover:-translate-y-[2px] transition-all duration-200"
            >
              <path.icon className="w-10 h-10 text-primary mb-4 stroke-[1.5]" />
              <h3 className="font-sans text-lg font-semibold text-foreground mb-2">{path.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 flex-1">{path.description}</p>
              <Button size="sm" className="w-fit h-9 rounded-md text-sm font-semibold">
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
