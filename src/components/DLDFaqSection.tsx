import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "What is developmental language disorder?",
    answer:
      "Developmental language disorder, or DLD, is a lifelong difficulty with understanding and using language. It can affect speaking, listening, reading, writing, learning, relationships, and daily communication. DLD is not explained by hearing loss, autism, intellectual disability, or lack of language exposure.",
  },
  {
    question: "How common is DLD?",
    answer:
      "DLD affects about 1 in 14 people. In a classroom of 30 students, that means roughly two may have DLD. Even though it is common, many families, educators, and professionals have still never heard of it.",
  },
  {
    question: "Is DLD the same as a speech delay?",
    answer:
      "No. A speech delay usually refers to difficulty producing speech sounds or talking later than expected. DLD is about deeper language skills, including understanding language, learning words, forming sentences, explaining ideas, telling stories, and understanding what others mean.",
  },
  {
    question: "Can bilingual people have DLD?",
    answer:
      "Yes. Bilingual and multilingual people can have DLD, but bilingualism does not cause DLD. A bilingual person with DLD will show language learning difficulties beyond what would be expected based on their language exposure and learning history.",
  },
  {
    question: "Who diagnoses DLD?",
    answer:
      "DLD is typically diagnosed by a speech-language pathologist, also called an SLP or speech pathologist. Assessment usually looks at understanding, expression, vocabulary, grammar, storytelling, listening comprehension, and how language affects everyday life.",
  },
  {
    question: "Can people with DLD succeed at school and work?",
    answer:
      "Yes. DLD is lifelong, but support can make a significant difference. People with DLD can succeed when language demands are recognized, instructions are clear, supports are consistent, and people are taught strategies for communication, learning, literacy, and self-advocacy.",
  },
];

const DLDFaqSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-[720px] mx-auto border border-foreground/15 rounded-2xl p-8 md:p-12">
          <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground mb-3">
            Frequently asked questions about DLD
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
