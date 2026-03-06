const stats = [
  { value: "4000+", label: "4,000+ community members" },
  { value: "15+", label: "Sold in 15+ countries" },
  { value: "7", label: "Available in 7+ languages" },
  { value: "1 in 14", label: "1 in 14 children has DLD" },
];

const GlobalCommunitySection = () => {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container px-6 md:px-8 text-center">
        <h2 className="text-[28px] md:text-[42px] font-black text-foreground leading-[1.12] mb-3">
          Join a Global Community
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-12">
          Empowered DLD is growing every day. Here's where we are.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[900px] mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <span className="text-[36px] md:text-[48px] font-black text-foreground leading-none">
                {stat.value}
              </span>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.5]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalCommunitySection;
