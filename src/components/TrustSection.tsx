import { Button } from "@/components/ui/button";

const TrustSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
          Why Empowered DLD?
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-4 leading-tight">
              Created by an SLP and teacher
            </h2>
            <p className="text-muted-foreground text-base mb-6 leading-[1.7]">
              Every resource on Empowered DLD is created with deep expertise and genuine care for children with Developmental Language Disorder.
            </p>
            <p className="text-muted-foreground text-base mb-8 leading-[1.7]">
              As a Speech-Language Pathologist and certified teacher with over 15 years of experience, our founder understands the unique challenges families and educators face when supporting children with DLD.
            </p>

            <p className="text-sm font-semibold text-foreground mb-3">What makes us different:</p>
            <ul className="space-y-2 mb-8">
              {[
                "Speech-Language Pathologist with 15+ years of experience",
                "Certified educator and classroom teacher",
                "Published author of children's books about DLD",
                "Trusted by families and professionals across the country",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-[1.7]">
                  <span className="text-primary mt-0.5">•</span>
                  {b}
                </li>
              ))}
            </ul>

            <Button className="h-11 px-7 rounded-lg text-sm font-semibold hover:brightness-95 transition-all">
              Learn More About Us
            </Button>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-2xl overflow-hidden h-[200px] lg:h-[260px]">
              <img src="/placeholder.svg" alt="Founder working with children" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="bg-secondary rounded-2xl overflow-hidden h-[200px] lg:h-[260px] mt-8">
              <img src="/placeholder.svg" alt="Classroom activity" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
