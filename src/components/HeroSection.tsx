import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-girls.webp";
import hallwayBg from "@/assets/school-hallway-bg.webp";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)]">
      {/* Layer 1: Blurred school hallway background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
        style={{ backgroundImage: `url(${hallwayBg})` }}
      />

      {/* Layer 2: White-lavender overlay — slightly more transparent to show hallway */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(270_55%_98%/0.78)] via-[hsl(264_48%_96%/0.72)] via-[60%] to-[hsl(258_42%_94%/0.66)]" />

      {/* Layer 3: Content */}
        <div className="relative z-10 md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)]">
        <div className="relative w-full grid grid-cols-1 md:grid-cols-[44%_56%] items-center md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)]">
          {/* Girls image — hidden on mobile (shown below text instead), grid column on desktop */}
          <div className="hidden md:flex md:relative md:w-auto z-0 items-end justify-start md:h-[calc(100vh-70px)] lg:h-[calc(100vh-80px)] overflow-hidden">
            <img
              src={heroImage}
              alt="Two girls laughing together"
              className="h-full w-auto max-w-none object-cover object-top scale-[0.60] lg:scale-[0.82] xl:scale-[0.94] origin-bottom-left className="h-full w-auto max-w-none object-cover object-top scale-[0.60] lg:scale-[0.82] xl:scale-[0.94] origin-bottom-left -translate-x-[14%] lg:-translate-x-[12%] xl:-translate-x-[10%]""
              loading="eager"
            />
          </div>

          {/* Text */}
          <div className="z-10 pt-10 pb-4 md:py-0 px-6 sm:px-7 md:px-10 lg:px-14 xl:px-20 text-left flex flex-col justify-start md:justify-center md:min-h-[calc(100vh-70px)] lg:min-h-[calc(100vh-80px)]">
            <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-primary/85 mb-3 md:mb-5">
              SUPPORTING CHILDREN WITH DLD
            </p>
            <h1 className="text-[42px] sm:text-[48px] md:text-[52px] xl:text-[74px] leading-[1.05] font-black text-foreground mb-4 md:mb-6 max-w-[500px] tracking-[-0.025em]">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[12px] sm:text-[13px] md:text-[15px] leading-[1.6] text-foreground/55 mb-5 md:mb-9 max-w-[340px] sm:max-w-[420px]">
              We partner with families, educators, clinicians, and organizations to bring clear, practical DLD resources into homes, schools, and communities.
            </p>
            <div>
              <a href="/who-we-serve">
                <Button
                  size="lg"
                  className="h-[40px] sm:h-[48px] md:h-[54px] px-6 sm:px-10 md:px-14 rounded-sm text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.14em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_1px_3px_hsl(262_49%_30%/0.12)] hover:shadow-[0_2px_6px_hsl(262_49%_30%/0.16)] transition-all duration-300"
                >
                  CHOOSE YOUR PATH
                </Button>
              </a>
            </div>
          </div>

          {/* Girls image — mobile only, below text */}
          <div className="md:hidden flex justify-end -mr-4 -mt-14 -mb-1">
            <img
              src={heroImage}
              alt="Two girls laughing together"
              className="w-[55%] h-auto object-contain"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
