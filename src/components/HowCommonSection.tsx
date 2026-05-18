const HowCommonSection = () => {
  const circles = Array.from({ length: 14 }, (_, i) => i);

  return (
    <section className="py-16 md:py-[120px] bg-background">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — dot grid */}
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground mb-8 md:mb-10">
              How common is DLD?
            </h2>
            <div className="grid grid-cols-7 gap-4 md:gap-5">
              {circles.map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md ${
                    i === 6 ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right — text */}
          <div className="space-y-6">
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.8]">
              Developmental Language Disorder affects approximately 1 in 14 children, making it one of the most common neurodevelopmental conditions. DLD is more common than autism, yet awareness remains far lower.
            </p>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.8]">
              Because many educators, families, and even professionals have never heard the term, children with language difficulties are often misunderstood or do not receive the support they need.
            </p>
            <p className="text-[12px] text-muted-foreground/70 leading-[1.5] pt-2">
              Source: Norbury et al. (2016). The impact of nonverbal ability on prevalence and clinical presentation of language disorder. <em>Journal of Child Psychology and Psychiatry</em>, 57(11).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowCommonSection;
