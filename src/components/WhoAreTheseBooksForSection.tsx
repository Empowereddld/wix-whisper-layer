import charDan from "@/assets/char-dan-block-1.png";
import charDaria from "@/assets/char-daria-block-2.png";
import charEducator from "@/assets/char-educator-block-3.png";

const cards = [
  {
    image: charDan,
    alt: "Dan leaning on block number 1",
    title: "For Families",
    bullets: [
      "Read together at bedtime",
      "Start conversations about DLD",
      "Help your child feel represented",
      "Build confidence and self-advocacy at home",
      "Find the words to explain DLD to your child",
    ],
  },
  {
    image: charDaria,
    alt: "Daria leaning on block number 2",
    title: "For Therapists",
    bullets: [
      "Use in therapy sessions",
      "Pair with animated podcast",
      "Share with families as homework",
      "Support narrative language development",
      "Help children see themselves in the stories you use",
    ],
  },
  {
    image: charEducator,
    alt: "Educator leaning on block number 3",
    title: "For Educators",
    bullets: [
      "Build inclusive classrooms",
      "Use for SEL discussions",
      "Introduce DLD to the whole class",
      "Support students who struggle with language in a relatable way",
      "Spark conversations about neurodiversity and belonging",
    ],
  },
];

const WhoAreTheseBooksForSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-10">
          <h2 className="text-[26px] md:text-[32px] lg:text-[38px] font-black text-foreground leading-[1.1]">
            Who Are These Books For?
          </h2>
          <div className="lg:text-right lg:max-w-[400px]">
            <p className="text-[14px] font-semibold text-foreground mb-1">
              In Homes. In Clinics. In Classrooms.
            </p>
            <p className="text-[13px] text-muted-foreground leading-[1.6]">
              The Living Life with DLD series was designed to work beautifully in every setting.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="border border-border rounded-xl p-6 pt-0"
            >
              <img
                src={card.image}
                alt={card.alt}
                className="h-24 w-auto object-contain -mt-2 mb-4"
                loading="lazy"
              />
              <h3 className="text-[18px] md:text-[20px] font-black text-foreground mb-4">
                {card.title}
              </h3>
              <ul className="space-y-3">
                {card.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-[13px] text-muted-foreground leading-[1.6]"
                  >
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoAreTheseBooksForSection;
