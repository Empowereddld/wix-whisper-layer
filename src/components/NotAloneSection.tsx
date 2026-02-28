import { Button } from "@/components/ui/button";

const NotAloneSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="bg-muted/50 rounded-3xl p-10 md:p-16 text-center max-w-[800px] mx-auto">
          <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-4">
            You are not alone.
          </h2>
          <p className="text-muted-foreground text-base mb-8 leading-[1.7] max-w-lg mx-auto">
            Join a warm, supportive community of families and professionals who understand your journey.
          </p>
          <Button className="h-11 px-7 rounded-lg text-sm font-semibold hover:brightness-95 transition-all">
            Join Our Community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotAloneSection;
