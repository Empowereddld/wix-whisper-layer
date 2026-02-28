const StatBand = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-7 md:py-9">
        <h2 className="text-[22px] md:text-[26px] font-bold leading-[1.1]">
          What affects 1 in 14 people?
        </h2>
        <p className="text-[14px] md:text-[15px] text-background/50 max-w-lg leading-[1.7]">
          Developmental Language Disorder (DLD) is one of the most common childhood conditions — yet most people have never heard of it.
        </p>
      </div>
    </section>
  );
};

export default StatBand;
