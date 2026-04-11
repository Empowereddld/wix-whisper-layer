import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "What is Developmental Language Disorder?",
    answer:
      "Developmental Language Disorder (DLD) affects how people understand and use language. Individuals with DLD may have difficulty learning new words, following instructions, or expressing ideas clearly. DLD is lifelong, but with the right understanding and support, people with DLD can develop strategies and strengths that help them thrive.",
    link: {
      text: "🎧 Listen to Dan and Daria explain DLD →",
      url: "https://www.youtube.com/watch?v=Zf6PcH4f7rk",
    },
  },
  {
    question: "How common is DLD?",
    answer:
      "Developmental Language Disorder affects approximately 1 in 14 people, making it one of the most common neurodevelopmental conditions. DLD is more common than autism, yet awareness remains far lower. Because many educators, families, and even professionals have never heard the term, individuals with language difficulties are often misunderstood or do not receive the support they need.",
  },
  {
    question: "What does DLD look like?",
    answer:
      "People with DLD may experience challenges with understanding complex instructions, learning new vocabulary, expressing ideas clearly, following conversations in busy environments, and organizing ideas when speaking or writing. These differences can affect learning, friendships, and confidence if the right supports are not in place.",
  },
  {
    question: "Why does awareness matter?",
    answer:
      "Language is the foundation for learning, relationships, and participation in everyday life. When Developmental Language Disorder is misunderstood, individuals may be labeled as inattentive or struggling academically when the underlying challenge is language. Increasing awareness helps people receive the right support earlier.",
  },
  {
    question: "How do we support DLD awareness?",
    answer:
      "At Empowered DLD we create practical resources that help families, educators, and professionals better understand Developmental Language Disorder. Our work includes children's books, free and paid resources, workshops, and awareness initiatives designed to make DLD easier to recognize and support.",
  },
];

const circles = Array.from({ length: 14 }, (_, i) => i);

const DLDFaqSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-[720px] mx-auto border border-foreground/15 rounded-2xl p-8 md:p-12">
          <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground mb-3">
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
                  <AccordionTrigger className="font-sans text-[15px] md:text-[16px] font-bold text-foreground text-left py-5 hover:no-underline tracking-tight">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.8] pb-5">
                    {faq.answer}
                    {faq.link && (
                      <a
                        href={faq.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-primary font-semibold hover:underline transition-colors"
                      >
                        {faq.link.text}
                      </a>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
      </div>
    </section>
  );
};

export default DLDFaqSection;
