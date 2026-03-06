import orgCommunity from "@/assets/org-community.png";

const IsThisRightForOrgSection = () => {
  return (
    <section className="pt-4 md:pt-6 lg:pt-10 pb-4 md:pb-8 lg:pb-16">
      <div className="container px-6 md:px-8">
        {/* Full-width title */}
        <h2 className="text-[20px] md:text-[28px] lg:text-[38px] font-black leading-[1.12] mb-6 md:mb-8 lg:mb-10">
          Is This Right for<br className="hidden md:block" /> Your Organization?
        </h2>

        <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[650px]">
          This partnership is a great fit if you're looking to:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden order-2 lg:order-1">
            <img
              src={orgCommunity}
              alt="Diverse group of community members collaborating"
              className="w-full h-full object-cover max-h-[220px] md:max-h-[300px] lg:max-h-none lg:h-full aspect-[16/9] lg:aspect-auto"
            />
          </div>

          {/* Right — text content */}
          <div className="flex flex-col justify-start pt-0 md:pt-2 order-1 lg:order-2">
            <ul className="list-disc pl-5 space-y-2 md:space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              <li>Support families who feel lost after a DLD diagnosis or are still trying to figure out what's going on</li>
              <li>Train your staff to recognize and accommodate language differences in the classroom or therapy room</li>
              <li>Bring DLD representation to your school library, clinic waiting room, or community center</li>
              <li>Build a more inclusive environment for children who struggle with language</li>
              <li>Offer parents practical tools they can use at home right away</li>
              <li>Raise awareness about an often-overlooked condition that affects 1 in 14 children</li>
            </ul>

            <div className="flex justify-center">
              <a
                href="#contact"
                className="inline-block border border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-[12px] md:text-[13px] font-bold tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IsThisRightForOrgSection;
