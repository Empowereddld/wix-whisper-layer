const WhatIsDLDSection = () => {
  return (
    <section className="pt-6 md:pt-10 pb-16 md:pb-[80px] bg-muted">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          What is Developmental Language Disorder (DLD)?
        </h2>

        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            DLD, is a lifelong difficulty with understanding and/or using spoken language. People with DLD may have trouble following directions, finding the words they want to say, explaining ideas, understanding stories, answering questions, or keeping up when language is moving quickly. These difficulties are not explained by hearing loss, autism, or intellectual disability.
          </p>
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            DLD is common, but many families, educators, and professionals still do not recognize it. DLD affects about 1 in 14 people, or roughly two students in a classroom of 30. DLD is hidden but common and can affect speaking, listening, reading, and writing.
          </p>
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            DLD begins in childhood, but it is not something people simply outgrow. It can affect learning, relationships, confidence, work, and everyday communication across the lifespan. At the same time, DLD is supportable. With the right tools, people with DLD can build many amazing skills and advocate for what helps.
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Sources:{" "}
            <a href="https://radld.org/about/dld/" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">RADLD</a>,{" "}
            <a href="https://www.nidcd.nih.gov/health/developmental-language-disorder" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">NIDCD</a>, Bishop et al (2017), McGregor 2020
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIsDLDSection;
