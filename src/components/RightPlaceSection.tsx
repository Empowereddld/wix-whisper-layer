import familyStudying from "@/assets/family-studying.png";

const RightPlaceSection = () => {
  return (
    <section className="py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={familyStudying}
              alt="Family studying together at a table"
              className="w-full h-full object-cover max-h-[350px] lg:max-h-none"
            />
          </div>

          {/* Right — text content */}
          <div className="flex flex-col justify-start pt-2 max-w-[650px]">
            <h2 className="text-[32px] md:text-[46px] font-black leading-[1.12] mb-6">
              You're in the right<br />place if...
            </h2>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
              you're a parent who:
            </p>

            <ul className="list-disc pl-5 space-y-4 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-8">
              <li>Just received a DLD diagnosis and doesn't know where to start</li>
              <li>Has been journeying with DLD for a while and wants to continue to grow and share</li>
              <li>Suspects your child has language struggles but hasn't gotten answers yet</li>
              <li>Feels alone because no one else seems to understand what you're going through</li>
              <li>Wants practical tools you can use at home, not just medical jargon</li>
              <li>Is looking for a community of parents who truly get it</li>
              <li>Speaks a language other than English and needs resources that work for your family</li>
            </ul>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-8">
              Whether you're just beginning to understand DLD or you've been navigating it for years, you'll find support here.
            </p>

            <a
              href="https://www.facebook.com/groups/empowereddld"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-foreground text-foreground px-10 py-4 text-[13px] font-bold tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors w-fit"
            >
              JOIN OUR FACEBOOK COMMUNITY
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RightPlaceSection;
