import { Button } from "@/components/ui/button";

const NotAloneSection = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/25">
      <div className="container">
        <div className="bg-background rounded-none md:rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-border/20 shadow-[0_2px_10px_hsl(258_50%_50%/0.05)]">
          <div className="p-7 md:p-10 lg:p-12 flex flex-col justify-center">
            <h2 className="text-[26px] md:text-[32px] font-bold text-foreground mb-2 leading-[1.06]">
              You are not alone.
            </h2>
            <p className="text-muted-foreground text-[14px] mb-5 leading-[1.65] max-w-[320px]">
              Join a warm, supportive community for parents and families.
            </p>
            <Button className="h-[42px] px-6 w-fit rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
              JOIN US
            </Button>
          </div>

          <div className="h-[240px] md:h-full bg-secondary/40">
            <img src="/placeholder.svg" alt="Family reading together" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotAloneSection;
