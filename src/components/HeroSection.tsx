import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-lavender">
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
              {/* Warm overlay for photographic depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-secondary/20 lg:to-secondary/40" />
            </div>
          </div>

          {/* Text side */}
          <div className="order-2 lg:col-start-2 py-14 lg:py-20 lg:pl-14 text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-6">
              Support for Children with DLD
            </p>
            <h1 className="text-[34px] sm:text-[40px] lg:text-[46px] leading-[1.1] font-semibold text-foreground mb-7">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-[15px] lg:text-[16px] leading-[1.75] text-muted-foreground mb-10 max-w-[400px] mx-auto lg:mx-0">
              We provide families, educators, and clinicians with the resources and community they need to support children with Developmental Language Disorder.
            </p>
            <Button
              size="lg"
              className="h-[50px] px-9 rounded-lg text-[13px] font-semibold uppercase tracking-[0.12em] hover:brightness-95 transition-all shadow-sm"
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
