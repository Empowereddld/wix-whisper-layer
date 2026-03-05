const DoesSoundFamiliarSection = () => {
  return (
    <section className="py-0">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — black card with heading at bottom */}
        <div className="bg-black text-white flex items-end p-10 md:p-16 min-h-[300px] md:min-h-[520px]">
          <h2 className="text-[26px] md:text-[36px] font-black leading-[1.15]">
            Does this sound familiar?
          </h2>
        </div>

        {/* Right — text content */}
        <div className="flex flex-col justify-start py-10 md:py-16 px-8 md:px-16">
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            Your child struggles to follow directions, even simple ones. They can't seem to find the right words. They get frustrated easily and you don't know why.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
            You're noticing:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
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
    </section>
  );
};

export default DoesSoundFamiliarSection;
