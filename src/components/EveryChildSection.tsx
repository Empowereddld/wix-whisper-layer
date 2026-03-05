import { Button } from "@/components/ui/button";
import boyThinking from "@/assets/boy-thinking.png";

const EveryChildSection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-14 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[28px] md:text-[42px] font-black text-foreground mb-5 leading-[1.12]">
              Every Child Deserves<br />to Be Understood
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-7 max-w-[480px]">
              Developmental Language Disorder (DLD) affects how people understand and use spoken language. Unlike a speech delay, it doesn't go away on its own. Most people have never heard of it, and that's part of the problem.
            </p>
            <Button
              size="sm"
              className="h-10 px-6 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 shadow-[0_1px_3px_hsl(262_49%_30%/0.2)] transition-all duration-300"
            >
              Learn More About DLD
            </Button>
          </div>

          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={boyThinking}
              alt="A thoughtful child resting their chin on their hand"
              className="w-full h-auto object-cover aspect-[4/3] md:aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EveryChildSection;
