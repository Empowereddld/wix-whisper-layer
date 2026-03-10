import { Button } from "@/components/ui/button";
import boyThinking from "@/assets/boy-thinking.webp";

const EveryChildSection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container px-6 md:px-8">
        <div className="relative">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[65%] py-14 lg:py-20 px-8 lg:px-16">
            <h2 className="text-[28px] md:text-[42px] font-black text-foreground mb-5 leading-[1.12] max-w-[480px]">
              Every Child Deserves to Be Understood
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-7 max-w-[480px]">
              Developmental Language Disorder (DLD) affects how people understand and use spoken language. Unlike a speech delay, it doesn't go away on its own. Most people have never heard of it, and that's part of the problem.
            </p>
            <a href="/about-dld">
              <Button
                size="sm"
                className="h-10 px-6 rounded-md text-[13px] font-semibold normal-case tracking-normal bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_1px_3px_hsl(262_49%_30%/0.2)] transition-all duration-300"
              >
                Learn More About DLD
              </Button>
            </a>
          </div>

          {/* Image — overlaps the card on the right */}
          <div className="mt-6 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[36%] rounded-xl overflow-hidden shadow-lg max-h-[300px] lg:max-h-none">
            <img
              src={boyThinking}
              alt="A thoughtful child resting their chin on their hand"
              className="w-full h-auto object-cover aspect-[4/3] lg:aspect-[3/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EveryChildSection;
