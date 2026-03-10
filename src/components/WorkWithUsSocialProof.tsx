import logoAsha from "@/assets/logo-asha.png";
import logoRadld from "@/assets/logo-radld.png";
import logoDldSummit from "@/assets/logo-dld-summit.png";
import logoWestern from "@/assets/logo-western.jpg";
import logoDldProject from "@/assets/logo-dld-project.png";
import logoDld from "@/assets/logo-dld.webp";

const logos = [
  { src: logoAsha, alt: "ASHA – American Speech-Language-Hearing Association", className: "h-10 md:h-12" },
  { src: logoRadld, alt: "RADLD – Raising Awareness of DLD", className: "h-10 md:h-12" },
  { src: logoDldSummit, alt: "DLD Global Summit", className: "h-28 md:h-32" },
  { src: logoWestern, alt: "Western University", className: "h-10 md:h-12" },
  { src: logoDldProject, alt: "The DLD Project", className: "h-14 md:h-16" },
  { src: logoDld, alt: "DLD", className: "h-10 md:h-12" },
];

const WorkWithUsSocialProof = () => {
  return (
    <section className="py-12 bg-background text-center">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
          Partnered with leading organizations
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 mb-14">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className={`${logo.className} w-auto object-contain grayscale opacity-60`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkWithUsSocialProof;
