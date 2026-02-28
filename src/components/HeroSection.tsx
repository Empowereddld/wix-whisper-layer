import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-10 lg:gap-12 items-center">
          {/* Hero Image */}
          <div className="order-1 lg:order-1">
            <div className="bg-secondary rounded-lg overflow-hidden h-[320px] sm:h-[420px] lg:h-[540px]">
              <img
                src="/placeholder.svg"
                alt="Children learning and communicating together"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Hero Text */}
          <div className="order-2 lg:order-2 text-center lg:text-left max-w-[520px] mx-auto lg:mx-0">
            <h1 className="text-[36px] sm:text-[42px] lg:text-[46px] leading-[1.15] font-bold text-foreground mb-5">
              Helping Every Child Find Their Voice with DLD Support
            </h1>
            <p className="text-base lg:text-lg leading-[1.6] text-muted-foreground mb-8">
              Empowering families, educators, and clinicians with the resources and community they need to support children with Developmental Language Disorder.
            </p>
            <Button
              size="lg"
              className="h-12 px-6 rounded-md text-base font-semibold hover:brightness-90 transition-all"
            >
              Discover Our Resources
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
