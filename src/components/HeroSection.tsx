import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-girls.png";
import hallwayBg from "@/assets/school-hallway-bg.webp";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[100vh]">
      {/* Layer 1: Blurred school hallway background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
        style={{ backgroundImage: `url(${hallwayBg})` }}
      />

      {/* Layer 2: White-lavender overlay */}
      <div className="absolute inset-0 bg-[hsl(266_100%_97%/0.88)]" />

      {/* Layer 3: Content */}
      <div className="relative z-10 h-full min-h-[100vh] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[55%_45%] items-end lg:items-center min-h-[100vh]">
          {/* Girls image — LEFT side, bleeds to left edge */}
          <div className="order-1 flex items-end justify-start h-[380px] sm:h-[480px] lg:h-[100vh] overflow-hidden">
            <img
              src={heroImage}
              alt="Two girls laughing together"
              className="h-full w-auto max-w-none object-cover object-top scale-110 origin-bottom-left"
              loading="eager"
            />
          </div>

          {/* Text — RIGHT side */}
          <div className="order-2 py-12 lg:py-0 px-8 lg:px-12 xl:px-16 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-5 opacity-80">
              SUPPORTING CHILDREN WITH DLD
            </p>
            <h1 className="text-[42px] sm:text-[52px] lg:text-[64px] xl:text-[72px] leading-[1.05] font-extrabold text-foreground mb-6 max-w-[480px] tracking-[-0.025em]">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[15px] leading-[1.75] text-muted-foreground mb-8 max-w-[420px]">
              We partner with families, educators, clinicians, and organizations to bring clear, practical DLD resources into homes, schools, and communities.
            </p>
            <Button
              size="lg"
              className="h-[52px] px-10 rounded-sm text-[12px] font-bold uppercase tracking-[0.14em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_2px_8px_hsl(262_49%_30%/0.3)] hover:shadow-[0_4px_16px_hsl(262_49%_30%/0.35)] transition-all duration-300"
            >
              Choose Your Path
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
