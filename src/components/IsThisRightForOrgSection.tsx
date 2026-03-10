import kidsSoccer from "@/assets/kids-playing-soccer.webp";

const IsThisRightForOrgSection = () => {
  return (
    <section className="pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-12">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden order-2 lg:order-1">
            <img
              src={kidsSoccer}
              alt="Children playing soccer together outdoors"
               className="w-full h-full object-cover max-h-[220px] md:max-h-[300px] lg:max-h-none lg:h-full aspect-[16/9] lg:aspect-auto"
               loading="lazy"
            />
          </div>

          {/* Right — text content */}
          <div className="flex flex-col justify-start pt-0 md:pt-2 order-1 lg:order-2">
            <h2 className="text-[20px] md:text-[28px] lg:text-[38px] font-black leading-[1.12] mb-6 md:mb-8">
              Is This Right for Your<br className="hidden md:block" /> Organization?
            </h2>

            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-5 md:mb-6">
              We partner with organizations committed to supporting underserved families, including:
            </p>

            <ul className="list-disc pl-5 space-y-3 md:space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-8 md:mb-10">
              <li>Family service agencies serving diverse communities</li>
              <li>Newcomer and settlement organizations</li>
              <li>EarlyON centers and family resource programs</li>
              <li>Multicultural community centers</li>
              <li>Community health centers</li>
            </ul>

            <p className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-foreground text-center mb-4 w-full">
              Ready to Bring DLD Support to Your Community?
            </p>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-8 md:mb-10">
              Let's talk about what's possible for your organization. Book a free 30-minute consultation to discuss your needs and how we can work together.
            </p>

            <div className="flex justify-start">
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
