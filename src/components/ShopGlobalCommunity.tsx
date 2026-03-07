const stats = [
  { value: "4000", suffix: "+", label: "4,000+ community members" },
  { value: "15", suffix: "+", label: "Sold in 15+ countries" },
  { value: "7", suffix: "", label: "Available in 7+ languages" },
  { value: "1 in 14", suffix: "", label: "1 in 14 children have DLD" },
];

const ShopGlobalCommunity = () => {
  return (
    <section className="bg-muted py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 text-center">
        <h2 className="text-[36px] md:text-[48px] font-bold text-midnight leading-[1.1] mb-4">
          Join a Global Community
        </h2>
        <p className="text-[16px] md:text-[18px] text-stone-ui leading-relaxed mb-12 md:mb-16">
          Empowered DLD is growing every day. Here's where we are.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              tabIndex={0}
              className="group flex flex-col items-center gap-3 bg-background border border-thistle rounded-2xl px-8 py-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-in-out cursor-default hover:bg-lavender hover:border-hub-lavender hover:border-2 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(143,121,181,0.15)] focus-visible:bg-lavender focus-visible:border-hub-lavender focus-visible:border-2 focus-visible:-translate-y-1 focus-visible:shadow-[0_8px_24px_rgba(143,121,181,0.15)] focus-visible:outline-none"
            >
              <p className="text-[56px] md:text-[64px] lg:text-[72px] font-bold text-midnight leading-none transition-colors duration-300 group-hover:text-hub-lavender group-focus-visible:text-hub-lavender">
                {stat.value}
                {stat.suffix && (
                  <span className="text-[32px] md:text-[40px] align-top">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="text-[15px] md:text-[16px] font-normal text-stone-ui leading-snug max-w-[200px]">
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
