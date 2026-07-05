const WhatCausesDLDSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-background">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          What causes DLD?
        </h2>
        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            DLD is a neurodevelopmental condition. This means it is connected to how the brain develops and processes language. Researchers do not point to one single cause. Instead, DLD appears to involve complex interactions between genes, brain development, and language learning systems. NIDCD explains that neurodevelopmental disorders are shaped by genes and environment, and that the exact causes of the brain differences linked to DLD are still not fully known.
          </p>
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            DLD often runs in families. A person with DLD may have a parent, sibling, or other family member who also had language, literacy, or communication difficulties. This does not mean anyone caused it. It means language development, like many parts of learning and development, can be influenced by inherited factors.
          </p>
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            It is also important to name what does not cause DLD, because families are too often handed guilt when what they really need is understanding. DLD is not caused by poor parenting. It is not caused by laziness, stubbornness, or not trying hard enough. It is not caused by bilingualism or multilingualism. Current DLD research points to neurodevelopmental and genetic factors, not blame.
          </p>
          <p className="text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]">
            People who are learning more than one language can have DLD, but speaking more than one language does not create DLD. A bilingual person with DLD will show language learning difficulties beyond what would be expected for their language exposure and learning history. This matters because bilingual families are sometimes told to drop a home language, even though home languages carry culture, identity, connection, and belonging. People with DLD deserve support for language learning, not the loss of a language that connects them to family.
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Sources:{" "}
            <a href="https://www.nidcd.nih.gov/health/developmental-language-disorder" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">NIDCD</a>,{" "}
            <a href="https://radld.org/wp-content/uploads/2025/04/DLD-Fact-Sheet-English.pdf" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">RADLD Fact Sheet</a>,{" "}
            <a href="https://www.dldandme.org/all-articles/bilingualism-developmental-language-disorder-dld" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">DLDandMe</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatCausesDLDSection;
