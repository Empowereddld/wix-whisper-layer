import { Button } from "@/components/ui/button";

const TrustSection = () => {
  return (
    <section className="py-18 md:py-22">
      <div className="container">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2.5 opacity-80">
          Why Empowered DLD?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[26px] md:text-[32px] font-bold text-foreground mb-4 leading-[1.1]">
              Created by an SLP and teacher
            </h2>
            <p className="text-muted-foreground text-[15px] mb-4 leading-[1.7] max-w-lg">
              Every resource on Empowered DLD is created with deep expertise and genuine care for children with Developmental Language Disorder.
            </p>
            <p className="text-muted-foreground text-[15px] mb-6 leading-[1.7] max-w-lg">
              As a Speech-Language Pathologist and certified teacher with over 15 years of experience, our founder understands the unique challenges families and educators face when supporting children with DLD.
            </p>

            <p className="text-[13px] font-bold text-foreground mb-2.5">What makes us different:</p>
            <ul className="space-y-1.5 mb-7">
              {[
                "Speech-Language Pathologist with 15+ years of experience",
                "Certified educator and classroom teacher",
                "Published author of children's books about DLD",
                "Trusted by families and professionals across the country",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[13px] text-muted-foreground leading-[1.6]">
                  <span className="text-primary mt-0.5 text-[10px]">●</span>
                  {b}
                </li>
              ))}
            </ul>

            <Button className="h-[48px] px-8 rounded-lg text-[12px] font-bold uppercase tracking-[0.14em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-elevated)] hover:brightness-95 transition-all duration-300">
              READ FULL STORY
            </Button>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden h-[200px] lg:h-[260px] bg-gradient-to-br from-secondary to-lavender shadow-[var(--shadow-card)]">
              <img src="/placeholder.svg" alt="Founder working with children" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[200px] lg:h-[260px] mt-8 bg-gradient-to-br from-lavender to-secondary shadow-[var(--shadow-card)]">
              <img src="/placeholder.svg" alt="Classroom activity" className="w-full h-full object-cover mix-blend-multiply" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
