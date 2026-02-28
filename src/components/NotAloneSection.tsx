import { Button } from "@/components/ui/button";

const NotAloneSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/25">
      <div className="container">
        <div className="bg-background rounded-none md:rounded-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-border/40">
          <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
            <h2 className="text-[30px] md:text-[34px] font-semibold text-foreground mb-3 leading-[1.12]">
              You are not alone.
            </h2>
            <p className="text-muted-foreground text-[15px] mb-7 leading-[1.7] max-w-md">
              Join a warm, supportive community of families and professionals who understand your journey.
            </p>
            <Button className="h-[44px] px-7 w-fit rounded-sm text-[12px] font-semibold uppercase tracking-[0.12em] hover:brightness-95 transition-all shadow-sm">
              JOIN US
            </Button>
          </div>

          <div className="h-[260px] md:h-full bg-secondary/40">
            <img src="/placeholder.svg" alt="Family reading together" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotAloneSection;
