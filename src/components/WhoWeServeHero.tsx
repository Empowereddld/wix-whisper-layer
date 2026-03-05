const WhoWeServeHero = () => {
  return (
    <section className="bg-deep-purple text-deep-purple-foreground py-20 md:py-28">
      <div className="container px-6 md:px-8 text-center flex flex-col items-center gap-6">
        <p className="text-[12px] md:text-[14px] font-bold uppercase tracking-[0.22em] text-deep-purple-foreground/80">
          WHO WE SERVE
        </p>
        <h1 className="text-[34px] md:text-[56px] font-black leading-[1.12] max-w-[700px]">
          Supporting Every Member of the DLD Community
        </h1>
        <p className="text-[14px] md:text-[17px] text-deep-purple-foreground/75 leading-[1.7] max-w-[600px]">
          Whether you're a parent, therapist/clinician, educator, or organization,
          <br className="hidden md:block" />
          we provide the tools and resources you need to support children with DLD.
        </p>
      </div>
    </section>
  );
};

export default WhoWeServeHero;
