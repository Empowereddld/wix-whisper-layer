import { Button } from "@/components/ui/button";

const NotAloneSection = () => {
  return (
    <section className="py-14 md:py-18 bg-muted/25">
      <div className="container">
        <div className="bg-background rounded-none md:rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-border/30 shadow-[var(--shadow-card)]">
          <div className="p-8 md:p-11 lg:p-14 flex flex-col justify-center">
            <h2 className="text-[28px] md:text-[34px] font-bold text-foreground mb-2.5 leading-[1.08]">
              You are not alone.
            </h2>
            <p className="text-muted-foreground text-[15px] mb-6 leading-[1.7] max-w-sm">
              Join a warm, supportive community for parents and families.
            </p>
            <Button className="h-[44px] px-7 w-fit rounded-lg text-[12px] font-bold uppercase tracking-[0.14em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-card-hover)] hover:brightness-95 transition-all duration-300">
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
