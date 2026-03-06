const EducatorsFamiliarSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px] bg-muted">
      <div className="bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12">
        <div className="container px-0">
          <h2 className="text-[20px] md:text-[26px] lg:text-[32px] font-black leading-[1.15]">
            Your students with language disorders are falling through the cracks.
          </h2>
        </div>
      </div>

      <div className="container px-6 md:px-8">
        <div className="max-w-[650px]">
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            Students with Developmental Language Disorder (DLD) are often identified late — or not at all. Teachers may not recognize the signs. Behavior issues get addressed, but the underlying language difficulties don't.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground font-semibold mb-3">
            In your school, you may be seeing:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            <li>Students who struggle academically but don't qualify for traditional support</li>
            <li>Teachers unsure how to differentiate for language needs</li>
            <li>SLPs stretched thin without school-wide resources</li>
            <li>Families who don't understand their child's diagnosis</li>
            <li>A lack of culturally and linguistically diverse materials</li>
          </ul>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-6">
            DLD affects 1 in 14 people — that means in every classroom, there are likely students who need more support than they're getting.
          </p>

          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7]">
            Empowered DLD gives your school the tools, training, and resources to identify and support these students — across every classroom and every language.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EducatorsFamiliarSection;
