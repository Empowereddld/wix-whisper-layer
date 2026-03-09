const WhatIsDLDSection = () => {
  return (
    <section className="pt-6 md:pt-10 pb-10 md:pb-[80px] bg-muted">
      <div className="container px-6 md:px-8">
        <h2 className="font-serif text-[32px] md:text-[44px] lg:text-[48px] leading-[1.15] text-primary max-w-[700px] mb-12 md:mb-16">
          "DLD affects how the brain processes language — not intelligence, not effort, not potential."
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.8]">
              Developmental Language Disorder (DLD) is a neurodevelopmental condition that affects a person's ability to understand and use spoken language. Children with DLD may have difficulty learning new words, following instructions, expressing ideas clearly, or understanding complex language.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.8]">
              DLD is not caused by hearing loss, autism, or intellectual disability. It affects how the brain processes language.
            </p>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.8]">
              DLD often continues into adolescence and adulthood, although many individuals develop effective strategies and strengths over time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsDLDSection;
