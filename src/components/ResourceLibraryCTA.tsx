import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DotBackground } from "@/components/ui/dot-background";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const ResourceLibraryCTA = () => {
  const ctaFade = useScrollFadeIn();

  return (
    <section className="bg-muted py-10 md:py-14 lg:py-20">
      <div className="container">
        <div
          ref={ctaFade.ref}
          className={`relative overflow-hidden bg-black text-white rounded-2xl px-10 md:px-20 py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 ${ctaFade.className}`}
        >
          <DotBackground />
          {/* Text */}
          <div className="relative z-10 flex-1 max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/50 mb-4">
              Resource Library
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-black leading-[1.1] tracking-[-0.02em] mb-4">
              Access the Empowered DLD
              <br />
              Resource Library
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-md">
              Guides, posters, and tools to support children with DLD at home, in therapy, and in the classroom.
              <span className="block mt-1 text-white/50 text-sm">All free. All in one place.</span>
            </p>
          </div>

          {/* Button */}
          <div className="relative z-10 shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 px-10 text-base font-semibold"
            >
              <Link to="/hub/preview">Get Free Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceLibraryCTA;
