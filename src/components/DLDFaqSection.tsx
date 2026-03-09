import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Developmental Language Disorder?",
    answer:
      "Developmental Language Disorder (DLD) affects how people understand and use language. Children with DLD may have difficulty learning new words, following instructions, or expressing ideas clearly. DLD is lifelong, but with the right understanding and support, children can develop strategies and strengths that help them thrive.",
  },
  {
    question: "How common is DLD?",
    answer:
      "Developmental Language Disorder affects approximately 1 in 14 children, making it one of the most common neurodevelopmental conditions. DLD is more common than autism, yet awareness remains far lower. Because many educators, families, and even professionals have never heard the term, children with language difficulties are often misunderstood or do not receive the support they need.",
  },
  {
    question: "What does DLD look like?",
    answer:
      "Children with DLD may experience challenges with understanding complex instructions, learning new vocabulary, expressing ideas clearly, following conversations in busy environments, and organizing ideas when speaking or writing. These differences can affect learning, friendships, and confidence if the right supports are not in place.",
  },
  {
    question: "Why does awareness matter?",
    answer:
      "Language is the foundation for learning, relationships, and participation in everyday life. When Developmental Language Disorder is misunderstood, children may be labeled as inattentive or struggling academically when the underlying challenge is language. Increasing awareness helps children receive the right support earlier.",
  },
  {
    question: "How do we support DLD awareness?",
    answer:
      "At Empowered DLD we create practical resources that help families, educators, and professionals better understand Developmental Language Disorder. Our work includes children's books, free resources, workshops, and awareness initiatives designed to make DLD easier to recognize and support.",
  },
];

const circles = Array.from({ length: 14 }, (_, i) => i);

const DLDFaqSection = () => {
  return (
    <section className="py-16 md:py-[120px] bg-background">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left — dot grid */}
          <div className="flex flex-col items-center justify-center lg:sticky lg:top-24 pt-4 md:pt-8">
            <div className="grid grid-cols-7 gap-4 md:gap-5">
              {circles.map((i) => (
                <div
                  key={i}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    i === 6 ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-[13px] md:text-[14px] mt-6 tracking-wide">
              1 in 14 children have DLD
            </p>
          </div>

          {/* Right — FAQ accordion */}
          <div>
            <h2 className="font-serif text-[28px] md:text-[38px] lg:text-[42px] leading-[1.15] text-foreground mb-3">
              Understanding Developmental Language Disorder
            </h2>
            <p className="text-muted-foreground text-[14px] md:text-[15px] leading-[1.7] mb-8 md:mb-10 max-w-[520px]">
              Common questions about Developmental Language Disorder and why
              awareness matters.
            </p>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-[15px] md:text-[17px] font-semibold text-foreground text-left py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.8] pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DLDFaqSection;
