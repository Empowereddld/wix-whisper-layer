import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-secondary overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] min-h-[520px] lg:min-h-[600px] items-center">
          {/* Image side */}
          <div className="order-1 lg:order-1 h-[320px] sm:h-[400px] lg:h-full lg:absolute lg:left-0 lg:top-0 lg:w-[58%]">
            <img
              src="/placeholder.svg"
              alt="Children learning and communicating together"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Text side */}
          <div className="order-2 lg:order-2 lg:col-start-2 py-16 lg:py-24 lg:pl-12 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-5">
              Support for Children with DLD
            </p>
            <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.15] font-semibold text-foreground mb-6">
              Every child with DLD deserves to feel seen.
            </h1>
            <p className="text-base lg:text-[17px] leading-[1.7] text-muted-foreground mb-10 max-w-[420px] mx-auto lg:mx-0">
              We provide families, educators, and clinicians with the resources and community they need to support children with Developmental Language Disorder.
            </p>
            <Button
              size="lg"
              className="h-12 px-8 rounded-lg text-sm font-semibold uppercase tracking-wider hover:brightness-95 transition-all"
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
