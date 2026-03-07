const WorkWithUsHero = () => {
  return (
    <section className="bg-deep-purple py-20 md:py-28 lg:py-32">
      <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
          WORK WITH US
        </p>
        <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-white leading-[1.1] max-w-[800px]">
          Bring DLD Expertise to Your School, Clinic, or Organization
        </h1>
        <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7] max-w-[620px]">
          Speaking engagements, custom workshops, and consultation services designed by an SLP and an educator who understand what works in real-world settings.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-white text-deep-purple text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-white/90 transition-colors duration-200 mt-2"
        >
          Book a Consultation
        </a>
      </div>
    </section>
  );
};

export default WorkWithUsHero;
