import { Button } from "@/components/ui/button";

const paths = [
  { label: "For Parents", href: "/for-parents" },
  { label: "For Therapists", href: "/for-therapists" },
  { label: "For Schools", href: "/for-educators" },
  { label: "For Organizations", href: "/for-organizations" },
];

interface ChoosePathCTAProps {
  label?: string;
  heading?: string;
  subheading?: string;
}

const ChoosePathCTA = ({
  label = "CHOOSE YOUR PATH",
  heading = "Ready to Get Started?",
  subheading = "Find resources made specifically for you.",
}: ChoosePathCTAProps) => {
  return (
    <section className="bg-black text-white py-20 md:py-32">
      <div className="container px-6 md:px-8 flex flex-col gap-6 items-center">
        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60 text-center">
          {label}
        </p>
        <h2 className="text-[28px] md:text-[46px] font-black leading-[1.15] max-w-[700px] mx-auto text-center">
          {heading}
        </h2>
        <p className="text-[15px] md:text-[18px] text-white/70 text-center max-w-[500px] mx-auto -mt-2">
          {subheading}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {paths.map((p) => (
            <a
              key={p.label}
              href={p.href}
              className="h-11 px-7 inline-flex items-center justify-center bg-white text-black text-[13px] md:text-[14px] font-semibold rounded-sm hover:bg-white/90 transition-colors duration-200"
            >
              {p.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChoosePathCTA;
