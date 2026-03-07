const bullets = [
  {
    bold: "Discounted Pricing.",
    text: "The more you order, the more you save. Pricing available for orders of any size.",
  },
  {
    bold: "Available in 7+ Languages",
    text: "Serve every family in your community with books in their home language.",
  },
  {
    bold: "Implementation Support Included",
    text: "Every bulk order comes with resources to help you put the books to work immediately.",
  },
];

const WhyBulkOrderSection = () => {
  return (
    <section className="bg-lavender py-14 md:py-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <h2 className="text-[26px] md:text-[32px] lg:text-[38px] font-black text-foreground leading-[1.1] mb-3">
          WHY BULK ORDER
        </h2>
        <p className="text-[14px] md:text-[15px] text-foreground font-medium mb-8">
          More Books. More Impact. Less Cost.
        </p>
        <ul className="space-y-5">
          {bullets.map((item) => (
            <li
              key={item.bold}
              className="flex items-start gap-3 text-[14px] md:text-[15px] text-foreground leading-[1.7]"
            >
              <span className="mt-[8px] w-2 h-2 rounded-full bg-foreground/50 flex-shrink-0" />
              <span>
                <strong>{item.bold}</strong> {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyBulkOrderSection;
