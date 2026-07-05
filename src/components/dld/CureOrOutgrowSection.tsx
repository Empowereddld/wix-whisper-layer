const p = "text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]";

const CureOrOutgrowSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-background">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          Can DLD be cured or outgrown?
        </h2>
        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className={p}>
            DLD is not something that is cured or simply outgrown. It is a lifelong neurodevelopmental condition. That can feel heavy at first, especially for families who were hoping the difficulty would disappear with time. But lifelong does not mean hopeless. It means the support should grow with the person.
          </p>
          <p className={p}>
            People with DLD can make meaningful progress. They can build vocabulary, grammar, narrative skills, comprehension, literacy, self-advocacy, and confidence. They can learn strategies that help them understand information, organize ideas, ask for help, and show what they know. They can also learn that needing extra time, visuals, or clearer language is not a personal failure.
          </p>
          <p className={p}>
            The goal is not to erase DLD. The goal is to help people with DLD understand themselves, access support, and thrive with the right tools, relationships, expectations, and opportunities. When support is respectful and consistent, people with DLD can better recognize their strengths, communicate their needs, and participate more fully in everyday life.
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Sources:{" "}
            <a href="https://radld.org/wp-content/uploads/2025/04/DLD-Fact-Sheet-English.pdf" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">RADLD Fact Sheet</a>,{" "}
            <a href="https://www.nidcd.nih.gov/health/developmental-language-disorder" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">NIDCD</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CureOrOutgrowSection;
