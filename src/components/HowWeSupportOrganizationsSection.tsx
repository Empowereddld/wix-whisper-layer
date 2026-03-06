const cards = [
  {
    title: "Parent Workshops",
    description:
      "Help families understand DLD, recognize the signs, and advocate for their children. Available as single sessions or a series.",
  },
  {
    title: "Staff Training",
    description:
      "Equip your team to recognize DLD in the populations you serve and connect families to support.",
  },
  {
    title: "Resource Packages",
    description:
      "Multilingual books, discussion guides, and printables ready to use with families in your programs.",
  },
  {
    title: "Custom Partnerships",
    description:
      "Comprehensive packages combining training, workshops, and resources tailored to your organization's needs.",
  },
];

const HowWeSupportOrganizationsSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[80px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Your Organization
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            We offer flexible partnerships designed for organizations at any stage of DLD awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-secondary border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col"
            >
              <h3 className="text-[18px] md:text-[20px] font-black text-foreground mb-4 text-center">
                {card.title}
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeSupportOrganizationsSection;
