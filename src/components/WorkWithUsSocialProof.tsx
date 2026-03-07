import iconParents from "@/assets/icon-parents.png";
import iconEducators from "@/assets/icon-educators.png";
import iconSlps from "@/assets/icon-slps.png";
import iconOrganizations from "@/assets/icon-organizations.png";

const logos = [
  { src: iconParents, alt: "Parents" },
  { src: iconEducators, alt: "Educators" },
  { src: iconSlps, alt: "SLPs" },
  { src: iconOrganizations, alt: "Organizations" },
];

const WorkWithUsSocialProof = () => {
  return (
    <section className="py-28 bg-background text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-12">
          Trusted by families, educators, and therapists worldwide
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12 mb-12">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              className="h-8 grayscale opacity-70"
              alt={logo.alt}
              loading="lazy"
            />
          ))}
        </div>

        <div className="inline-flex items-center gap-3 border border-border rounded-full px-6 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">4.9/5</span>
          <span className="text-amber-500">★★★★★</span>
          <span>From thousands of parents and professionals</span>
        </div>
      </div>
    </section>
  );
};

export default WorkWithUsSocialProof;
