const WhoWeServeHero = () => {
  return (
    <section className="bg-deep-purple py-20 md:py-28 lg:py-32">
      <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
          WHO WE SERVE
        </p>
        <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-white leading-[1.1] max-w-[800px]">
          Supporting Every Member of the DLD Community
        </h1>
        <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7] max-w-[620px]">
          Whether you're a parent, therapist/clinician, educator, or organization,
          we provide the tools and resources you need to support children with DLD.
        </p>
        <p className="text-[13px] md:text-[14px] text-white/50 mt-4">
          Trusted by families and professionals
        </p>
      </div>
    </section>
  );
};

export default WhoWeServeHero;
