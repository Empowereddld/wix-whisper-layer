import { Button } from "@/components/ui/button";

const NotAloneSection = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="max-w-[480px]">
            <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-4">
              You Are Not Alone
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-[1.7]">
              Navigating DLD can feel overwhelming, but you don't have to do it by yourself. Join a warm, supportive community of families and professionals who understand your journey.
            </p>
            <Button className="h-12 px-7 rounded-lg text-base font-medium hover:brightness-95 transition-all">
              Join Our Community
            </Button>
          </div>

          {/* Image */}
          <div>
            <div className="bg-secondary rounded-2xl overflow-hidden h-[300px] lg:h-[400px]">
              <img
                src="/placeholder.svg"
                alt="A family reading and learning together"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotAloneSection;
