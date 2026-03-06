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
            Your clients with DLD need materials that represent their experiences, work for multilingual families, and help explain language challenges in ways kids and parents can understand. But most resources:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <li>Are expensive and time-consuming to create yourself</li>
            <li>Don't reflect the diverse populations on your caseload</li>
            <li>Use language too clinical for families to understand</li>
            <li>Only exist in English</li>
          </ul>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            You're spending hours creating materials that should already exist. Your multilingual families leave empty-handed because nothing works in their language. Parents don't understand the handouts you send home.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
            You need tools that work for the real families sitting in your therapy room.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TherapistsFamiliarSection;
