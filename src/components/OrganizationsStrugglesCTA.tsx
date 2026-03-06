const OrganizationsStrugglesCTA = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-stretch">
          {/* Left — Black card */}
          <div className="bg-foreground rounded-xl lg:rounded-2xl flex flex-col justify-center items-center text-center px-10 py-16 lg:py-20 lg:px-14">
            <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-black text-background leading-[1.15] mb-6">
              You're Seeing the Struggles.
            </h2>
            <p className="text-[22px] md:text-[26px] lg:text-[30px] font-bold text-background/80 leading-[1.3]">
              We can help you understand why.
            </p>
          </div>

          {/* Right — Text content */}
          <div className="flex flex-col justify-center py-10 lg:py-8">
            <div className="mb-6 lg:mb-8">
              <p className="text-[14px] lg:text-[15px] font-bold text-foreground mb-3">
                You're noticing patterns:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[13px] lg:text-[14px] text-muted-foreground leading-[1.7]">
                <li>Children who can't seem to follow instructions</li>
                <li>Explosive behavior when traditional strategies don't work</li>
                <li>Families told their child is "slow" or "lazy"</li>
                <li>Language barriers blamed for ongoing struggles</li>
              </ul>
            </div>

            <div className="mb-6 lg:mb-8">
              <p className="text-[14px] lg:text-[15px] font-bold text-foreground mb-3">
                You're serving the very populations where DLD gets missed:
              </p>
              <p className="text-[13px] lg:text-[14px] text-muted-foreground leading-[1.7]">
                Girls who withdraw instead of acting out. Racialized children whose struggles are dismissed. Newcomer families told "give it time, they're still learning English."
              </p>
            </div>

            <p className="text-[13px] lg:text-[14px] text-muted-foreground leading-[1.7] mb-4">
              What if it's not behaviour, shyness, or English language learning?
            </p>

            <p className="text-[13px] lg:text-[14px] text-muted-foreground leading-[1.7] mb-4">
              What if it's Developmental Language Disorder - and your team doesn't have the tools to spot it?
            </p>

            <p className="text-[13px] lg:text-[14px] text-foreground font-semibold leading-[1.7]">
              Understanding DLD changes outcomes for the families you serve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsStrugglesCTA;
