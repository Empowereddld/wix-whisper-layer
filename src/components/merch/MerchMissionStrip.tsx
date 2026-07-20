const MerchMissionStrip = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-4">
            WHY THIS MATTERS
          </p>
          <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-black text-foreground leading-[1.15] mb-5">
            More than merch.
            <br />
            A walking conversation about DLD.
          </h2>
          <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.8]">
            Developmental Language Disorder affects about 1 in 14 people, yet most have never heard of it. Every shirt, mug, and tote sparks a question, and every question is a chance to help someone feel seen.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MerchMissionStrip;
