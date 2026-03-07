const stats = [
  { value: "4000", suffix: "+", label: "4,000+ community members" },
  { value: "15", suffix: "+", label: "Sold in 15+ countries" },
  { value: "7", suffix: "", label: "Available in 7+ languages" },
  { value: "1 in 14", suffix: "", label: "1 in 14 children have DLD" },
];

const ShopGlobalCommunity = () => {
  return (
    <section className="bg-muted py-16 md:py-20 lg:py-24">
      <div className="max-w-[1300px] mx-auto px-6 md:px-8 text-center">
        <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-3">
          Join a Global Community
        </h2>
        <p className="text-[14px] md:text-[16px] text-muted-foreground leading-relaxed mb-12 md:mb-16">
          Empowered DLD is growing every day. Here's where we are.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-3">
              <p className="text-[36px] md:text-[48px] lg:text-[56px] font-black text-foreground leading-none">
                {stat.value}
                {stat.suffix && (
                  <span className="text-[24px] md:text-[32px] font-bold align-top">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="text-[13px] md:text-[14px] font-semibold text-foreground leading-snug">
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
