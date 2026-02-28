const StatBand = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-10 md:py-12">
        <h2 className="text-[24px] md:text-[28px] font-semibold leading-tight">
          What affects 1 in 14 people?
        </h2>
        <p className="text-sm md:text-base text-background/60 max-w-lg leading-[1.7]">
          Developmental Language Disorder (DLD) is one of the most common childhood conditions — yet most people have never heard of it.
        </p>
      </div>
    </section>
  );
};

export default StatBand;
