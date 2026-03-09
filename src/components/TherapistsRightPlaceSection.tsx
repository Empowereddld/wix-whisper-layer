import kidsPlayingSoccer from "@/assets/kids-playing-soccer.png";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const TherapistsRightPlaceSection = () => {
  const headingFade = useScrollFadeIn();
  const imageFade = useScrollFadeIn({ delay: 100 });
  const textFade = useScrollFadeIn({ delay: 150 });

  return (
    <section className="pt-4 md:pt-6 lg:pt-10 pb-4 md:pb-8 lg:pb-16">
      <div className="container px-6 md:px-8">
        {/* Full-width title */}
        <div ref={headingFade.ref} className={headingFade.className}>
          <h2 className="text-[20px] md:text-[28px] lg:text-[38px] font-black leading-[1.12] mb-6 md:mb-8 lg:mb-10">
            You're in the right<br className="hidden md:block" /> place if...
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
          {/* Left — image */}
          <div ref={imageFade.ref} className={`rounded-xl overflow-hidden order-2 lg:order-1 ${imageFade.className}`}>
            <img
              src={kidsPlayingSoccer}
              alt="Kids playing soccer together"
               className="w-full h-full object-cover max-h-[220px] md:max-h-[300px] lg:max-h-none lg:h-full aspect-[16/9] lg:aspect-auto"
               loading="lazy"
            />
          </div>

          {/* Right — text content */}
          <div ref={textFade.ref} className={`flex flex-col justify-start pt-0 md:pt-2 order-1 lg:order-2 ${textFade.className}`}>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-foreground mb-3 md:mb-4">
              You're a therapist who:
            </p>

            <ul className="list-disc pl-5 space-y-2 md:space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              <li>Works with children with DLD and struggles to find resources that represent the diverse families on your caseload</li>
              <li>Spends hours creating materials from scratch that should already exist</li>
              <li>Has multilingual clients and needs resources that work across languages</li>
              <li>Wants practical tools to bridge therapy and home, not just clinical handouts parents don't understand</li>
              <li>Is looking for evidence-based books and resources you can use directly in sessions or recommend with confidence</li>
              <li>Wants to stay connected to a growing global community of DLD-informed professionals</li>
            </ul>

            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              Whether you're newly learning about DLD or have been supporting these children for years, you'll find tools here that make your work easier and your impact greater.
            </p>

            <div className="flex justify-center">
              <a
                href="/hub/coming-soon"
                className="inline-block border border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-[12px] md:text-[13px] font-bold tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                Explore Therapist Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapistsRightPlaceSection;
