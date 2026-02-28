import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import foundersPhoto from "@/assets/founders-photo.png";
import boyReading from "@/assets/boy-reading.png";

const TrustSection = () => {
  return (
    <section className="py-14 md:py-18" id="why">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Column 1 – Text */}
          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3 opacity-80">
              Why Empowered DLD?
            </p>
            <h2 className="text-[26px] md:text-[30px] font-bold text-foreground mb-3.5 leading-[1.08]">
              Created by an SLP and teacher
            </h2>
            <p className="text-muted-foreground text-[14px] mb-3.5 leading-[1.65] max-w-[420px]">
              We're Jinean and Camesha. We believe children need to understand how their brain works. A great tool for that is seeing themselves in stories.
            </p>
            <p className="text-muted-foreground text-[14px] mb-5 leading-[1.65] max-w-[420px]">
              When we visited our local library, we found over 600 books on autism, over 100 on ADHD, and zero on DLD. We built Empowered DLD to change that.
            </p>

            <p className="text-[12px] font-bold text-foreground mb-2">What makes us different:</p>
            <ul className="space-y-1 mb-6">
              {[
                "Built from years of clinical and classroom experience",
                "Help children understand how their brains work",
                "Flexible tools for home, school, and therapy",
                "Easy to share with families and school teams",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[12px] text-muted-foreground leading-[1.55]">
                  <Check className="text-primary mt-0.5 w-3.5 h-3.5 shrink-0" strokeWidth={3} />
                  {b}
                </li>
              ))}
            </ul>

            <Button className="w-fit h-[46px] px-7 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
              FIND WHAT WORKS FOR YOU
            </Button>
          </div>

          {/* Column 2 – Founders photo */}
          <div className="rounded-2xl overflow-hidden h-[300px] lg:h-[420px] bg-gradient-to-br from-secondary to-lavender shadow-[0_2px_8px_hsl(258_50%_50%/0.06)]">
            <img
              src={foundersPhoto}
              alt="Jinean and Camesha, founders of Empowered DLD"
              className="w-full h-full object-cover object-[center_10%]"
              loading="lazy"
            />
          </div>

          {/* Column 3 – Boy reading photo */}
          <div className="rounded-2xl overflow-hidden h-[340px] lg:h-full min-h-[340px] bg-gradient-to-br from-lavender to-secondary shadow-[0_2px_8px_hsl(258_50%_50%/0.06)]">
            <img
              src={boyReading}
              alt="Boy reading a book about DLD"
              className="w-full h-full object-cover object-[center_30%]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
