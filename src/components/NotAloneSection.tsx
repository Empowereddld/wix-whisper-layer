import { Button } from "@/components/ui/button";
import familyReading from "@/assets/family-reading.webp";

const NotAloneSection = () => {
  return (
    <section className="bg-[#E8E6E6] p-5 md:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-background overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] min-h-[300px] lg:min-h-[420px] shadow-[0_2px_12px_hsl(258_50%_50%/0.06)]">
          <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
            <h2 className="text-[26px] md:text-[40px] lg:text-[46px] font-bold text-foreground mb-4 leading-[1.06]">
              You are not alone.
            </h2>
            <p className="text-muted-foreground text-[15px] md:text-[16px] mb-7 leading-[1.7] max-w-[460px]">
              Join thousands of families and professionals learning and supporting children with DLD together.
            </p>
            <Button className="h-[46px] px-7 w-fit rounded-none text-[12px] font-bold uppercase tracking-[0.12em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[var(--shadow-button)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] transition-all duration-300">
              Join The Community
            </Button>
          </div>

          <div className="h-[280px] lg:h-full">
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
