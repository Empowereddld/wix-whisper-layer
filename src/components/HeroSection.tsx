import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-girls.png";
import hallwayBg from "@/assets/school-hallway-bg.webp";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden lg:min-h-[calc(100vh-90px)]">
      {/* Layer 1: Blurred school hallway background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
        style={{ backgroundImage: `url(${hallwayBg})` }}
      />

      {/* Layer 2: White-lavender overlay — slightly more transparent to show hallway */}
      <div className="absolute inset-0 bg-[hsl(270_60%_98%/0.72)]" />

      {/* Layer 3: Content */}
        <div className="relative z-10 h-full lg:min-h-[calc(100vh-90px)] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[52%_48%] items-end lg:items-center lg:min-h-[calc(100vh-90px)]">
          {/* Girls image — LEFT side, bleeds to left edge */}
          <div className="hidden lg:flex order-1 items-end justify-start h-[calc(100vh-90px)] overflow-hidden">
            <img
              src={heroImage}
              alt="Two girls laughing together"
              className="h-full w-auto max-w-none object-cover object-top scale-[1.15] origin-bottom-left"
              loading="eager"
            />
          </div>

          {/* Text — RIGHT side, vertically centered */}
          <div className="order-2 py-10 md:py-0 px-6 md:px-14 xl:px-20 text-left flex flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/70 mb-4 md:mb-5">
              SUPPORTING CHILDREN WITH DLD
            </p>
            <h1 className="text-[34px] sm:text-[44px] md:text-[52px] xl:text-[74px] leading-[1.05] font-black text-foreground mb-5 md:mb-6 max-w-[500px] tracking-[-0.02em]">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[14px] md:text-[15px] leading-[1.7] text-foreground/55 mb-8 md:mb-9 max-w-[420px]">
              We partner with families, educators, clinicians, and organizations to bring clear, practical DLD resources into homes, schools, and communities.
            </p>
            <div>
              <Button
                size="lg"
                className="h-[48px] md:h-[54px] px-10 md:px-14 rounded-sm text-[12px] font-bold uppercase tracking-[0.14em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_2px_8px_hsl(262_49%_30%/0.3)] hover:shadow-[0_4px_16px_hsl(262_49%_30%/0.35)] transition-all duration-300"
              >
                CHOOSE YOUR PATH
              </Button>
            </div>

            {/* Girls image — mobile/tablet only, below CTA */}
            <div className="lg:hidden mt-10 -mx-6 md:-mx-14">
              <img
                src={heroImage}
                alt="Two girls laughing together"
                className="w-full h-auto object-cover object-top"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
