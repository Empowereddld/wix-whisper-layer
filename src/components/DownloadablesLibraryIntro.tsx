import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";
import familyReading from "@/assets/family-reading.png";

const DownloadablesLibraryIntro = () => {
  const fade = useScrollFadeIn();

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div
        ref={fade.ref}
        className={`container px-6 md:px-8 max-w-7xl mx-auto ${fade.className}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left – image */}
          <div>
            <img
              src={familyReading}
              alt="Family reading DLD resources together"
              className="w-full rounded-2xl object-cover aspect-[3/4]"
              loading="lazy"
            />
          </div>

          {/* Right – copy (60%) */}
          <div className="md:col-span-3 flex flex-col gap-6">
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
              to="/hub/preview"
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
