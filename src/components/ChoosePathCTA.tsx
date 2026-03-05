import { Button } from "@/components/ui/button";

const paths = [
  { label: "For Parents", href: "#" },
  { label: "For Therapists", href: "#" },
  { label: "For Schools", href: "#" },
  { label: "For Organizations", href: "#" },
];

const ChoosePathCTA = () => {
  return (
    <section className="bg-black text-white py-16 md:py-24">
      <div className="container px-6 md:px-8 flex flex-col gap-8">
        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
          CHOOSE YOUR PATH
        </p>
        <h2 className="text-[28px] md:text-[46px] font-black leading-[1.15] max-w-[700px] mx-auto text-center">
          Ready to Get Started?<br />
          Find resources made specifically for you.
        </h2>
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
