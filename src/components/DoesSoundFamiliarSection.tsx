const DoesSoundFamiliarSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12">
        <div className="container px-0">
          <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-black leading-[1.15]">
            Does this sound familiar?
          </h2>
        </div>
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-[650px]">
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            You know something isn't quite right with your child's language — but no one seems to have the answers. Maybe you've been told they'll "grow out of it," or that they're "just a late talker." Meanwhile, you're watching them fall behind.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
            You may be experiencing:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <li>Your child struggles to express what they're thinking or feeling</li>
            <li>Teachers say they're "just shy" or "will catch up"</li>
            <li>You've searched online but nothing quite fits</li>
            <li>Homework battles that end in tears — for both of you</li>
            <li>Feeling alone and unsure where to get help</li>
          </ul>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            DLD affects 1 in 14 people — which means it's more common than autism, yet most parents have never heard of it.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
            You're not imagining it. And you're not alone. Empowered DLD was created to give families like yours the resources, language, and support to understand your child — and help them thrive.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DoesSoundFamiliarSection;
