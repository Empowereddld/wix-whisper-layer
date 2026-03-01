import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const StatBand = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="container flex flex-col md:flex-row md:items-start md:justify-between gap-6 py-10 md:py-16 px-6 md:px-8">
        <h2 className="text-[28px] md:text-[42px] font-bold leading-[1.15] max-w-[320px]">
          What affects 1 in 14 people?
        </h2>
        <div className="max-w-md flex flex-col gap-6">
          <p className="text-[15px] md:text-[16px] text-background/80 leading-[1.65]">
            Developmental Language Disorder (DLD) affects 1 in 14 people. It's 7x more common than autism, yet most people have never heard of it.
          </p>
          <div>
            <Button
              variant="outline"
              className="border-background/60 text-background bg-transparent hover:bg-background/10 rounded-none uppercase text-[11px] tracking-[0.14em] font-bold px-6 h-[44px] gap-2"
            >
              Learn More About DLD
              <ChevronRight className="!size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatBand;
