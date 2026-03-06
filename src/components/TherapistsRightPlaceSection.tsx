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
            />
          </div>

          {/* Right — text content */}
          <div ref={textFade.ref} className={`flex flex-col justify-start pt-0 md:pt-2 order-1 lg:order-2 ${textFade.className}`}>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-foreground mb-3 md:mb-4">
              You're a parent who:
            </p>

            <ul className="list-disc pl-5 space-y-2 md:space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              <li>Just received a DLD diagnosis and doesn't know where to start</li>
              <li>Suspects your child has language struggles but hasn't gotten answers yet</li>
              <li>Feels alone because no one else seems to understand what you're going through</li>
              <li>Wants practical tools you can use at home, not just medical jargon</li>
              <li>Is looking for a community of parents who truly get it</li>
              <li>Speaks a language other than English and needs resources that work for your family</li>
            </ul>

            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              Whether you're just beginning to understand DLD or you've been navigating it for years, you'll find support here.
            </p>

            <div className="flex justify-center">
              <a
                href="https://www.facebook.com/groups/empowereddld"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-[12px] md:text-[13px] font-bold tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                JOIN OUR FACEBOOK COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapistsRightPlaceSection;
