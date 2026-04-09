import { Button } from "@/components/ui/button";
import foundersPhoto from "@/assets/founders-circle.webp";
import boyReading from "@/assets/boy-reading-bench.webp";

const TrustSection = () => {
  return (
    <section className="py-12 md:py-18" id="why">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[2fr_1fr] gap-8 items-stretch">
          {/* Images column — visible on md only (tablet sidebar) */}
          <div className="hidden md:flex lg:hidden flex-col items-center justify-center gap-6">
            <img
              src={foundersPhoto}
              alt="Jinean and Camesha, founders of Empowered DLD"
              className="w-[180px] h-[180px] object-cover rounded-2xl"
              loading="lazy"
            />
            <div className="rounded-2xl overflow-hidden w-[180px] h-[180px]">
              <img
                src={boyReading}
                alt="Boy reading a book about DLD"
                className="w-full h-full object-cover object-[center_45%]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Column 1 – Text (spans wide on lg) */}
          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3 opacity-80">
              Why Empowered DLD?
            </p>
            <h2 className="text-[26px] md:text-[30px] font-bold text-foreground mb-3.5 leading-[1.08]">
              Changing how the world understands DLD
            </h2>
            <p className="text-muted-foreground text-[14px] mb-2.5 leading-[1.65]">
              We created Empowered DLD to change how the world understands children with Developmental Language Disorder.
            </p>
            <p className="text-muted-foreground text-[14px] mb-2.5 leading-[1.65]">
              We are Jinean and Camesha, an SLP and a teacher.
            </p>
            <p className="text-muted-foreground text-[14px] mb-3.5 leading-[1.65]">
              Too many children with DLD go unseen, misunderstood, or unsupported.
            </p>

            <div className="pl-3 border-l-2 border-primary/30 mb-3.5 max-w-[520px]">
              <p className="text-muted-foreground text-[14px] leading-[1.65]">Children need to understand how their brain works.</p>
              <p className="text-muted-foreground text-[14px] leading-[1.65]">They need to know that they are not alone.</p>
              <p className="text-muted-foreground text-[14px] leading-[1.65]">They deserve to see themselves reflected in stories.</p>
            </div>

            <div className="pl-3 border-l-2 border-primary/30 mb-3.5 max-w-[520px]">
              <p className="text-muted-foreground text-[14px] leading-[1.65]">Adults need clear, practical ways to understand and support those children.</p>
              <p className="text-muted-foreground text-[14px] leading-[1.65]">They need tools that translate knowledge into real everyday interactions.</p>
              <p className="text-muted-foreground text-[14px] leading-[1.65]">They need guidance that builds confidence, not confusion.</p>
            </div>

            <p className="text-muted-foreground text-[14px] mb-6 leading-[1.65] max-w-[520px]">
              That is why we create tools that go beyond awareness. Our resources help adults understand DLD and support children in building confidence, communication, and self-advocacy in everyday life.
            </p>

            <a href="/who-we-serve">
              <Button className="w-fit h-[46px] px-7 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
                FIND WHAT WORKS FOR YOU
              </Button>
            </a>
          </div>

          {/* Mobile images (below text) */}
          <div className="flex flex-col items-center gap-4 md:hidden">
            <img
              src={foundersPhoto}
              alt="Jinean and Camesha, founders of Empowered DLD"
              className="w-full max-w-[260px] h-auto"
              loading="lazy"
            />
            <div className="rounded-2xl overflow-hidden w-full max-w-[260px] h-[200px]">
              <img
                src={boyReading}
                alt="Boy reading a book about DLD"
                className="w-full h-full object-cover object-[center_45%]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Column 2 – Stacked images (lg only) */}
          <div className="hidden lg:flex flex-col gap-4">
            <img
              src={foundersPhoto}
              alt="Jinean and Camesha, founders of Empowered DLD"
              className="w-full max-w-[280px] h-auto mx-auto"
              loading="lazy"
            />
            <div className="rounded-2xl overflow-hidden flex-1 min-h-[200px]">
              <img
                src={boyReading}
                alt="Boy reading a book about DLD"
                className="w-full h-full object-cover object-[center_45%]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
