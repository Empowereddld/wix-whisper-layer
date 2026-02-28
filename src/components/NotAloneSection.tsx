import { Button } from "@/components/ui/button";

const NotAloneSection = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="bg-lavender rounded-2xl p-10 md:p-14 text-center max-w-[760px] mx-auto">
          <h2 className="text-[26px] md:text-[32px] font-semibold text-foreground mb-3">
            You are not alone.
          </h2>
          <p className="text-muted-foreground text-[15px] mb-7 leading-[1.7] max-w-md mx-auto">
            Join a warm, supportive community of families and professionals who understand your journey.
          </p>
          <Button className="h-[46px] px-7 rounded-lg text-[12px] font-semibold hover:brightness-95 transition-all shadow-sm">
            Join Our Community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotAloneSection;
