const TherapistsFamiliarSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      {/* Full-bleed black bar */}
      <div className="bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12">
        <div className="container px-0">
          <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-black leading-[1.15]">
            Have you ever read a children's book about DLD?
          </h2>
        </div>
      </div>

      {/* Constrained text content */}
      <div className="container px-6 md:px-8">
        <div className="max-w-[650px]">
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            Your clients need materials that represent their experience — but most resources about language disorders weren't designed with DLD in mind. You're working with multilingual families, neurodiverse children, and kids who've never seen themselves in a book about communication.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
            Sound familiar?
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <li>Existing materials are expensive and time-consuming to adapt</li>
            <li>Resources don't reflect the diverse populations you serve</li>
            <li>Available books are too clinical for therapy sessions with kids</li>
            <li>Most materials are only available in English</li>
          </ul>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            You've spent hours creating your own materials, searching for the right tools, and adapting resources that weren't built for your caseload.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
            You need real tools — created by clinicians and educators who understand the daily challenges of working with children with DLD.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TherapistsFamiliarSection;
