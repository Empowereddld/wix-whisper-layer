import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-lavender">
      {/* Atmospheric depth layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,hsl(258_50%_50%/0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_30%_80%,hsl(266_100%_97%/0.7),transparent)]" />

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-[500px] lg:min-h-[580px] items-center">
          {/* Image side */}
          <div className="order-1 h-[280px] sm:h-[360px] lg:h-full lg:absolute lg:left-0 lg:top-0 lg:w-[58%]">
            <div className="relative w-full h-full">
              <img
                src="/placeholder.svg"
                alt="Children learning and communicating together"
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Soften background so subjects pop */}
              <div className="absolute inset-0 bg-secondary/[0.08]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-secondary/40 lg:to-secondary/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/25 via-transparent to-transparent" />
            </div>
          </div>

          {/* Text side — soft gradient backing for depth */}
          <div className="order-2 lg:col-start-2 relative py-12 lg:py-16 lg:pl-12 text-center lg:text-left">
            <div className="absolute inset-0 hidden lg:block bg-gradient-to-l from-transparent to-secondary/40 rounded-l-3xl -z-[1]" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-4 opacity-80">
              SUPPORT FOR CHILDREN WITH DLD
            </p>
            <h1 className="text-[34px] sm:text-[40px] lg:text-[46px] leading-[1.06] font-extrabold text-foreground mb-5 max-w-[420px] mx-auto lg:mx-0 tracking-[-0.025em]">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[15px] leading-[1.7] text-muted-foreground mb-8 max-w-[400px] mx-auto lg:mx-0">
              We partner with families, educators, clinicians and organizations to bring clear, practical DLD resources into homes, schools and communities.
            </p>
            <Button
              size="lg"
              className="h-[50px] px-9 rounded-lg text-[12px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.25)] hover:shadow-[0_4px_16px_hsl(258_50%_50%/0.3)] hover:brightness-[0.96] transition-all duration-300"
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
