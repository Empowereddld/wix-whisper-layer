import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-lavender">
      {/* Atmospheric depth layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,hsl(258_50%_50%/0.04),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_30%_80%,hsl(266_100%_97%/0.6),transparent)]" />

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-[540px] lg:min-h-[620px] items-center">
          {/* Image side */}
          <div className="order-1 h-[300px] sm:h-[380px] lg:h-full lg:absolute lg:left-0 lg:top-0 lg:w-[58%]">
            <div className="relative w-full h-full">
              <img
                src="/placeholder.svg"
                alt="Children learning and communicating together"
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Refined warm overlay with stronger edge blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-secondary/30 lg:to-secondary/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 via-transparent to-transparent" />
            </div>
          </div>

          {/* Text side */}
          <div className="order-2 lg:col-start-2 py-14 lg:py-20 lg:pl-14 text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-5 opacity-80">
              SUPPORT FOR CHILDREN WITH DLD
            </p>
            <h1 className="text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.08] font-bold text-foreground mb-6 max-w-[480px] mx-auto lg:mx-0">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground mb-10 max-w-[480px] mx-auto lg:mx-0">
              We partner with families, educators, clinicians and organizations to bring clear, practical DLD resources into homes, schools and communities.
            </p>
            <Button
              size="lg"
              className="h-[52px] px-10 rounded-lg text-[13px] font-bold uppercase tracking-[0.14em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-elevated)] hover:brightness-95 transition-all duration-300"
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
