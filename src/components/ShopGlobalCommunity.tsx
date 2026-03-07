const stats = [
  { value: "4000", suffix: "+", label: "Community members worldwide" },
  { value: "15", suffix: "+", label: "Countries using our resources" },
  { value: "7", suffix: "", label: "Languages available" },
  { value: "1 in 14", suffix: "", label: "Children affected by DLD" },
];

const ShopGlobalCommunity = () => {
  return (
    <section className="bg-muted py-10 md:py-14 lg:py-16">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10 text-center">
        <h2 className="text-[28px] md:text-[36px] font-bold text-midnight leading-[1.1] mb-3">
          A Growing Global Community
        </h2>
        <p className="text-[14px] md:text-[16px] text-stone-ui leading-relaxed mb-8 md:mb-10">
          Empowered DLD is connecting families, educators, and SLPs around the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              tabIndex={0}
              className="group flex flex-col items-center gap-2 bg-background border border-thistle rounded-2xl px-5 py-5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out cursor-default hover:bg-lavender hover:border-hub-lavender hover:border-2 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(143,121,181,0.15)] focus-visible:bg-lavender focus-visible:border-hub-lavender focus-visible:border-2 focus-visible:-translate-y-1 focus-visible:shadow-[0_8px_24px_rgba(143,121,181,0.15)] focus-visible:outline-none"
            >
              <p className="text-[36px] md:text-[40px] lg:text-[44px] font-bold text-midnight leading-none whitespace-nowrap transition-colors duration-300 group-hover:text-hub-lavender group-focus-visible:text-hub-lavender">
                {stat.value}
                {stat.suffix && (
                  <span className="text-[20px] md:text-[24px] align-top">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="text-[13px] md:text-[14px] font-normal text-stone-ui leading-snug max-w-[180px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopGlobalCommunity;
