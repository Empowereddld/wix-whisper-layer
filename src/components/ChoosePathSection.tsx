import { Button } from "@/components/ui/button";
import iconParents from "@/assets/icon-parents.webp";
import iconEducators from "@/assets/icon-educators.webp";
import iconSlps from "@/assets/icon-slps.png";
import iconOrganizations from "@/assets/icon-organizations.webp";

const paths = [
  {
    icon: iconParents,
    title: "For Parents and Caregivers",
    description: "Help your child understand DLD, build confidence, and feel supported at home and school using stories and strategies, that strengthen communication.",
    cta: "LEARN MORE",
    href: "/for-parents",
  },
  {
    icon: iconSlps,
    title: "For Therapists/ Clinicians",
    description: "Time saving, evidence-based resources you can use right away, plus family friendly materials to share with confidence.",
    cta: "LEARN MORE",
    href: "/for-therapists",
  },
  {
    icon: iconEducators,
    title: "For Teachers and Support Staff",
    description: "Classroom-ready tools that support language, learning, and inclusion. Make DLD visible in your classroom and school community.",
    cta: "LEARN MORE",
    href: "/for-educators",
  },
  {
    icon: iconOrganizations,
    title: "For Schools, Clinics, and Organizations",
    description: "Bulk orders, implementation support, and professional development to equip your team with evidence-based DLD resources.",
    cta: "LEARN MORE",
    href: "/for-organizations",
  },
];

const ChoosePathSection = () => {
  return (
    <section className="py-12 md:py-18" id="resources">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10">
          <p className="text-[14px] font-bold uppercase tracking-[0.18em] text-foreground mb-3">
            CHOOSE YOUR PATH
          </p>
          <h2 className="text-[32px] md:text-[52px] font-black text-foreground mb-3 leading-[1.1]">Start Here</h2>
          <p className="text-muted-foreground text-[15px] leading-[1.65]">
            Each section has resources designed specifically for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {paths.map((path) => (
            <div
              key={path.title}
              className="bg-lavender border border-border rounded-md px-6 py-7 text-left flex flex-col items-start hover:shadow-[0_6px_20px_-4px_hsl(258_50%_50%/0.1)] hover:-translate-y-[2px] transition-all duration-300"
            >
              <div className="w-[108px] h-[108px] mb-5 overflow-hidden">
                <img
                  src={path.icon}
                  alt={path.title}
                  className={`w-full object-contain ${path.href === "/for-therapists" ? "h-[130px] object-top" : "h-full"}`}
                  loading="lazy"
                />
              </div>
              <h3 className="text-[18px] md:text-[20px] font-bold text-foreground mb-2 leading-[1.25]">{path.title}</h3>
              <p className="text-[13px] text-muted-foreground mb-6 flex-1 leading-[1.65]">{path.description}</p>
              <a href={path.href}>
                <Button
                  size="sm"
                  className="h-10 px-6 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_1px_3px_hsl(262_49%_30%/0.2)] transition-all duration-300"
                >
                  {path.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChoosePathSection;
