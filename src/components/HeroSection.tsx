import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 lg:py-36">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] gap-12 lg:gap-16 items-center">
          {/* Hero Image */}
          <div className="order-1 lg:order-1">
            <div className="bg-secondary rounded-2xl overflow-hidden h-[300px] sm:h-[400px] lg:h-[520px]">
              <img
                src="/placeholder.svg"
                alt="Children learning and communicating together"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Hero Text */}
          <div className="order-2 lg:order-2 text-center lg:text-left max-w-[480px] mx-auto lg:mx-0">
            <h1 className="text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.2] font-normal text-foreground mb-6">
              Helping Every Child Find Their Voice with DLD Support
            </h1>
            <p className="text-base lg:text-[17px] leading-[1.75] text-muted-foreground mb-10">
              Empowering families, educators, and clinicians with the resources and community they need to support children with Developmental Language Disorder.
            </p>
            <Button
              size="lg"
              className="h-12 px-7 rounded-lg text-base font-medium hover:brightness-95 transition-all"
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
