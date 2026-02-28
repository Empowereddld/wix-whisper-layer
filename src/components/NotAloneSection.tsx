import { Button } from "@/components/ui/button";
import familyReading from "@/assets/family-reading.png";

const NotAloneSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container">
        <div className="bg-background overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_0.8fr] min-h-[340px] md:min-h-[420px] shadow-[0_2px_12px_hsl(258_50%_50%/0.06)]">
          <div className="p-10 md:p-14 lg:p-16 flex flex-col justify-center">
            <h2 className="text-[32px] md:text-[40px] lg:text-[46px] font-bold text-foreground mb-4 leading-[1.06]">
              You are not alone.
            </h2>
            <p className="text-muted-foreground text-[15px] md:text-[16px] mb-7 leading-[1.7] max-w-[460px]">
              Join thousands of families and professionals learning and supporting children with DLD together.
            </p>
            <Button className="h-[46px] px-7 w-fit rounded-none text-[12px] font-bold uppercase tracking-[0.12em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[var(--shadow-button)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] transition-all duration-300">
              Join The Community
            </Button>
          </div>

          <div className="h-[280px] md:h-full">
            <img
              src={familyReading}
              alt="Family reading together"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotAloneSection;
