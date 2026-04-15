import { Link } from "react-router-dom";
import downloadablesHero from "@/assets/downloadables-hero.webp";

const DownloadablesHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
      <div className="container px-6 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] lg:flex-shrink-0 py-10 md:py-14 lg:py-24 px-6 md:px-8 lg:px-16">
            <span className="inline-block bg-deep-purple text-deep-purple-foreground text-[12px] md:text-[14px] lg:text-[16px] font-bold uppercase tracking-[0.14em] px-6 md:px-8 py-2 md:py-2.5 rounded-sm mb-4 md:mb-6">
              Downloadables
            </span>
            <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              Everything You Need to Support a Child With DLD
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              Printable guides, checklists, posters, and activity sheets, ready to use today. These are practical tools that work.
            </p>
            <Link
              to="/hub/preview"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              Browse Resources
            </Link>
          </div>

          {/* Image */}
          <div className="mt-4 lg:mt-0 lg:flex-1 flex items-end justify-end overflow-hidden rounded-xl lg:rounded-2xl">
            <img
              src={downloadablesHero}
              alt="Mother and daughter sitting together with laptop and tablet"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadablesHero;
