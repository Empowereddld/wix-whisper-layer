const AboutDLDHero = () => {
  return (
    <section className="bg-deep-purple py-20 md:py-28 lg:py-32">
      <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
          ABOUT DLD
        </p>
        <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-white leading-[1.1] max-w-[800px]">
          Understanding Developmental Language Disorder (DLD)
        </h1>
        <div className="max-w-[620px] flex flex-col gap-4">
          <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7]">
            Developmental Language Disorder affects how people understand and use language.
            It is common, lifelong, and widely misunderstood.
          </p>
          <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7]">
            Yet most people have never heard of it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutDLDHero;
