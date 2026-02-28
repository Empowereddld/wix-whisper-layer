const StatBand = () => {
  return (
    <section className="bg-foreground text-background">
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-6 md:py-8">
        <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.1]">
          What affects 1 in 14 people?
        </h2>
        <p className="text-[13px] md:text-[14px] text-background/50 max-w-md leading-[1.65]">
          Developmental Language Disorder (DLD) is one of the most common childhood conditions — yet most people have never heard of it.
        </p>
      </div>
    </section>
  );
};

export default StatBand;
