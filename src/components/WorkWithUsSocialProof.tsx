import logoAsha from "@/assets/logo-asha.png";
import logoRadld from "@/assets/logo-radld.png";
import logoDldSummit from "@/assets/logo-dld-summit.png";
import logoWestern from "@/assets/logo-western.jpg";

const logos = [
  { src: logoAsha, alt: "ASHA – American Speech-Language-Hearing Association", className: "h-10 md:h-12" },
  { src: logoRadld, alt: "RADLD – Raising Awareness of DLD", className: "h-10 md:h-12" },
  { src: logoDldSummit, alt: "DLD Global Summit", className: "h-14 md:h-18" },
  { src: logoWestern, alt: "Western University", className: "h-10 md:h-12" },
];

const WorkWithUsSocialProof = () => {
  return (
    <section className="py-24 bg-background text-center">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-10">
          Trusted by leading organizations
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mb-14">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className="h-10 md:h-12 w-auto object-contain grayscale opacity-60"
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
