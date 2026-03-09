const DoesSoundFamiliarSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      {/* Full-bleed black bar */}
      <div className="bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12">
        <div className="container px-0">
          <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-black leading-[1.15]">Who We Work With

          </h2>
        </div>
      </div>

      {/* Constrained text content */}
      <div className="container px-6 md:px-8">
        <div className="max-w-[650px]">
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
              Your child struggles to follow directions, even simple ones. They can't seem to find the right words. They get frustrated easily and you don't know why.
            </p>

            <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
              You're noticing:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
              <li>Trouble following multi-step instructions</li>
              <li>Difficulty retelling what happened at school</li>
              <li>They use simpler sentences than other kids their age</li>
              <li>Explosive meltdowns or withdrawal when they can't communicate</li>
              <li>Your child is falling further behind each year</li>
            </ul>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
              You've been told "give it time," "they're shy," or "it's just a speech delay." But what if it's something more?
            </p>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
              What if your child has Developmental Language Disorder (DLD) - a condition that affects 1 in 14 people, yet most parents and teachers have never heard of it?
            </p>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
              Understanding DLD changes everything. You can finally get answers, find the right support, and help your child thrive.
            </p>
        </div>
      </div>
    </section>);

};

export default DoesSoundFamiliarSection;