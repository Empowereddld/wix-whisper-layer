import guidebookWorkspace from "@/assets/parent-guidebook-workspace.webp";

const ForParentsHero = () => {
  return (
    <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
      <div className="container px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-6">
          {/* Gray card background */}
          <div className="bg-muted rounded-xl lg:rounded-2xl md:w-1/2 md:flex-shrink-0 pt-0 pb-10 md:pb-12 lg:pb-14 px-6 md:px-8 lg:px-12">
            <div className="bg-[hsl(270,60%,22%)] rounded-t-xl lg:rounded-t-2xl -mx-6 md:-mx-8 lg:-mx-12 px-8 md:px-10 lg:px-12 py-5 md:py-6 lg:py-7 mb-10 md:mb-10 lg:mb-[40px] border-b-[3px] border-white/10">
              <span className="text-white text-[20px] md:text-[22px] lg:text-[24px] font-bold uppercase tracking-[0.18em]">
                PARENT GUIDEBOOK
              </span>
            </div>
            <h1 className="text-[30px] md:text-[34px] lg:text-[44px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
              How Do I Explain DLD To My Child?
            </h1>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
              Find the words to talk about DLD together.
            </p>
            <a
              href="https://www.facebook.com/share/g/1GCdxhWtfB/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-center min-h-12 md:min-h-14 py-3 px-6 md:px-8 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
            >
              GET THE PARENT GUIDEBOOK - $9.99 USD
            </a>
          </div>

          {/* Image */}
          <div className="mt-4 md:mt-0 md:flex-1 rounded-xl overflow-hidden shadow-lg">
            <img
              src={guidebookWorkspace}
              alt="The Parent Guidebook displayed on a tablet beside printed activity sheets, a notebook and a cup of coffee on a sunlit desk"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForParentsHero;
