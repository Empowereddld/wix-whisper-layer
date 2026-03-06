import kidsPlayingSoccer from "@/assets/kids-playing-soccer.png";

const TherapistsRightPlaceSection = () => {
  return (
    <section className="pt-4 md:pt-6 lg:pt-10 pb-4 md:pb-8 lg:pb-16">
      <div className="container px-6 md:px-8">
        {/* Full-width title */}
        <h2 className="text-[20px] md:text-[28px] lg:text-[38px] font-black leading-[1.12] mb-6 md:mb-8 lg:mb-10">
          You're in the right<br className="hidden md:block" /> place if you're a therapist who...
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden order-2 lg:order-1">
            <img
              src={kidsPlayingSoccer}
              alt="Kids playing soccer together"
              className="w-full h-full object-cover max-h-[220px] md:max-h-[300px] lg:max-h-none lg:h-full aspect-[16/9] lg:aspect-auto"
            />
          </div>

          {/* Right — text content */}
          <div className="flex flex-col justify-start pt-0 md:pt-2 order-1 lg:order-2">
            <ul className="list-disc pl-5 space-y-2 md:space-y-4 text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8">
              <li>Works with children who have DLD and wants engaging, evidence-based materials</li>
              <li>Serves multilingual families and needs resources in languages other than English</li>
              <li>Is tired of spending hours creating or adapting materials for your caseload</li>
              <li>Wants to help parents understand and support their child's language development</li>
              <li>Believes every child deserves to see themselves represented in therapy materials</li>
              <li>Is looking for professional development opportunities focused on DLD</li>
              <li>Wants to connect with other professionals who specialize in language disorders</li>
            </ul>

            <div className="flex justify-center">
              <a
                href="https://www.facebook.com/groups/empowereddld"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-foreground text-foreground px-8 md:px-10 py-3 md:py-4 text-[12px] md:text-[13px] font-bold tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                JOIN OUR FACEBOOK COMMUNITY
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapistsRightPlaceSection;
