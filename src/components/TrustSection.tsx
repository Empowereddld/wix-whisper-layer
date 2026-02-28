import { Button } from "@/components/ui/button";

const TrustSection = () => {
  return (
    <section className="py-14 md:py-18">
      <div className="container">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
          Why Empowered DLD?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[26px] md:text-[30px] font-bold text-foreground mb-3.5 leading-[1.08]">
              Created by an SLP and teacher
            </h2>
            <p className="text-muted-foreground text-[14px] mb-3.5 leading-[1.65] max-w-[420px]">
              Every resource on Empowered DLD is created with deep expertise and genuine care for children with Developmental Language Disorder.
            </p>
            <p className="text-muted-foreground text-[14px] mb-5 leading-[1.65] max-w-[420px]">
              As a Speech-Language Pathologist and certified teacher with over 15 years of experience, our founder understands the unique challenges families and educators face when supporting children with DLD.
            </p>

            <p className="text-[12px] font-bold text-foreground mb-2">What makes us different:</p>
            <ul className="space-y-1 mb-6">
              {[
                "Speech-Language Pathologist with 15+ years of experience",
                "Certified educator and classroom teacher",
                "Published author of children's books about DLD",
                "Trusted by families and professionals across the country",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[12px] text-muted-foreground leading-[1.55]">
                  <span className="text-primary mt-0.5 text-[9px]">●</span>
                  {b}
                </li>
              ))}
            </ul>

            <Button className="h-[46px] px-7 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
              READ FULL STORY
            </Button>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden h-[190px] lg:h-[240px] bg-gradient-to-br from-secondary to-lavender shadow-[0_2px_8px_hsl(258_50%_50%/0.06)]">
              <img src="/placeholder.svg" alt="Founder working with children" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[190px] lg:h-[240px] mt-7 bg-gradient-to-br from-lavender to-secondary shadow-[0_2px_8px_hsl(258_50%_50%/0.06)]">
              <img src="/placeholder.svg" alt="Classroom activity" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
