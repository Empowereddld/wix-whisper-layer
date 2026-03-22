import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface StatBandProps {
  description?: string;
  hideButton?: boolean;
}

const StatBand = ({ description, hideButton }: StatBandProps = {}) => {
  return (
    <section className="bg-foreground text-background">
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-10 md:py-12 px-6 md:px-8">
        <h2 className="text-[22px] sm:text-[32px] md:text-[52px] font-bold leading-[1.1] max-w-[480px]">You know your child struggles with language...
        </h2>
        <div className="max-w-md flex flex-col gap-6">
          <p className="text-[13px] md:text-[17px] text-background/85 leading-[1.65]">
            {description || "Developmental Language Disorder (DLD) affects 1 in 14 people. It's 7x more common than autism, yet most people have never heard of it."}
          </p>
          {!hideButton && (
            <div>
              <a href="/about-dld">
                <Button
                  variant="outline"
                  className="border-background/60 text-background bg-transparent hover:bg-background/10 rounded-none uppercase text-[11px] tracking-[0.14em] font-bold px-6 h-[44px] gap-2">
                  
                  Learn More About DLD
                  <ChevronRight className="!size-4" />
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default StatBand;