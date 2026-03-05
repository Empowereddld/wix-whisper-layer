import familyGroup from "@/assets/family-dinner-new.png";

const RightPlaceSection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left — image */}
          <div className="aspect-[4/5] md:aspect-auto md:h-full overflow-hidden rounded-lg">
            <img
              src={familyGroup}
              alt="Family enjoying dinner together"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right — text content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[28px] md:text-[36px] font-black leading-[1.15] mb-6">
              You're in the right<br />place if...
            </h2>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-4">
              you're a parent who:
            </p>

            <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
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
              className="inline-block bg-foreground text-background px-8 py-3 text-[13px] font-bold tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity w-fit"
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
