import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-girls.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px] lg:min-h-[540px] items-center">
          {/* Text side */}
          <div className="order-2 lg:order-1 relative py-12 lg:py-16 text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-5 opacity-80">
              SUPPORTING CHILDREN WITH DLD
            </p>
            <h1 className="text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.05] font-extrabold text-foreground mb-6 max-w-[480px] mx-auto lg:mx-0 tracking-[-0.025em]">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[15px] leading-[1.75] text-muted-foreground mb-8 max-w-[420px] mx-auto lg:mx-0">
              We partner with families, educators, clinicians, and organizations to bring clear, practical DLD resources into homes, schools, and communities.
            </p>
            <Button
              size="lg"
              className="h-[52px] px-10 rounded-sm text-[12px] font-bold uppercase tracking-[0.14em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_2px_8px_hsl(262_49%_30%/0.3)] hover:shadow-[0_4px_16px_hsl(262_49%_30%/0.35)] transition-all duration-300"
            >
              Choose Your Path
            </Button>
          </div>

          {/* Image side */}
          <div className="order-1 lg:order-2 flex items-end justify-center lg:justify-end h-[300px] sm:h-[380px] lg:h-full">
            <img
              src={heroImage}
              alt="Two girls laughing together"
              className="h-full w-auto max-w-full object-contain object-bottom"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
