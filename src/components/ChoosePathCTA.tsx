import { Button } from "@/components/ui/button";

const paths = [
  { label: "For Parents", href: "#" },
  { label: "For Therapists", href: "#" },
  { label: "For Schools", href: "#" },
  { label: "For Organizations", href: "#" },
];

const ChoosePathCTA = () => {
  return (
    <section className="bg-deep-purple text-deep-purple-foreground py-14 md:py-18">
      <div className="container px-6 md:px-8 text-center flex flex-col items-center gap-6">
        <p className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.22em] text-deep-purple-foreground/70">
          CHOOSE YOUR PATH
        </p>
        <h2 className="text-[26px] md:text-[40px] font-black leading-[1.15] max-w-[560px]">
          Ready to Get Started?<br />
          Find resources made specifically for you.
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {paths.map((p) => (
            <a
              key={p.label}
              href={p.href}
              className="h-10 px-6 inline-flex items-center justify-center rounded-sm border border-deep-purple-foreground/50 text-[12px] font-bold uppercase tracking-[0.12em] text-deep-purple-foreground hover:bg-deep-purple-foreground/10 transition-colors duration-200"
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
