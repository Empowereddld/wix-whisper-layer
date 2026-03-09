import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import resourceGif from "@/assets/resource-library-preview.gif";

const DownloadablesLibraryIntro = () => {
  const fade = useScrollFadeIn();

  return (
    <section className="py-10 md:py-14 lg:py-16">
      <div
        ref={fade.ref}
        className={`container px-6 md:px-8 max-w-7xl mx-auto ${fade.className}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left – image (50%) */}
          <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]">
            <img
              src={resourceGif}
              alt="Preview of DLD resource library materials"
              className="w-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>

          {/* Right – copy (60%) */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1]">
              Your Complete DLD
              <br />
              Resource Library
            </h2>
            <p className="text-[15px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-lg">
              Practical tools for parents, therapists, and educators. From
              starter guides to classroom posters—everything you need is here.
            </p>

            <Link
              to="/hub/coming-soon"
              className="inline-flex items-center gap-2 text-primary font-semibold text-[15px] hover:underline w-fit"
            >
              Sign Up for Free Access
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="text-[13px] text-muted-foreground/70 mt-2">
              Trusted by 4,000+ families and professionals in 15+ countries
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadablesLibraryIntro;
