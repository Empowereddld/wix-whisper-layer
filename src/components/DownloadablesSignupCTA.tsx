import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DotBackground } from "@/components/ui/dot-background";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const DownloadablesSignupCTA = () => {
  const fade = useScrollFadeIn();

  return (
    <section className="bg-muted py-10 md:py-14 lg:py-20">
      <div className="container">
        <div
          ref={fade.ref}
          className={`relative overflow-hidden bg-foreground text-background rounded-2xl px-10 md:px-20 py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 ${fade.className}`}
        >
          <DotBackground />
          {/* Text */}
          <div className="relative z-10 flex-1 max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-background/50 mb-4">
              Resource Library
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black leading-[1.1] tracking-[-0.02em] mb-4">
              Ready to Access Everything?
            </h2>
            <p className="text-background/70 text-[15px] leading-relaxed max-w-md">
              Create a free account and get instant, lifetime access to our full
              resource library.
              <span className="block mt-1 text-background/50 text-sm">
                Trusted by 4,000+ families and professionals.
              </span>
            </p>
          </div>

          {/* Button */}
          <div className="relative z-10 shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 px-10 text-base font-semibold"
            >
              <Link to="/hub/preview">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadablesSignupCTA;
