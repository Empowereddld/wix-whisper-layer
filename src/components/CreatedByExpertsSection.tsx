import { Button } from "@/components/ui/button";
import courseDiscover from "@/assets/course-discover.webp";

const CreatedByExpertsSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14">
          {/* Left – Text */}
          <div>
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-3">
              CREATED BY EXPERTS
            </p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.08] mb-6">
              Built by an SLP and a Teacher Who Understand What Families Need
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] mb-4 max-w-[550px]">
              The Communicate with Confidence course was created by two moms, Camesha Russell, an elementary teacher and co-founder of Empowered DLD, and Jinean Cheng, a Speech-Language Pathologist with 17+ years of experience.
            </p>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] mb-8 max-w-[550px]">
              Together, they bring real-world classroom experience and clinical expertise to help you support children with DLD in ways that actually work.
            </p>
            <a href="/who-we-serve">
              <Button className="h-[50px] px-8 rounded-md bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
                Find What Works For You
              </Button>
            </a>
          </div>

          {/* Right – Discover card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="rounded-xl overflow-hidden shadow-lg w-[280px] md:w-[340px] lg:w-[380px]">
              <img
                src={courseDiscover}
                alt="Inside Communicate with Confidence — course highlights"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatedByExpertsSection;
