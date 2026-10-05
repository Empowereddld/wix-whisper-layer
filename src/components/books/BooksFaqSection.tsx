import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BOOKS_FAQ } from "./booksFaq";

const BooksFaqSection = () => (
  <section className="py-12 md:py-16">
    <div className="max-w-[1100px] mx-auto px-6 md:px-10">
      <div className="max-w-[760px] border border-foreground/15 rounded-2xl p-6 md:p-10">
        <h2 className="text-[24px] md:text-[30px] font-black text-foreground leading-[1.15] mb-6">
          Frequently asked questions about our DLD books
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {BOOKS_FAQ.map((faq, i) => (
            <AccordionItem key={i} value={`books-faq-${i}`} className="border-border">
              <AccordionTrigger className="text-[15px] md:text-[16px] font-bold text-foreground text-left py-5 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-muted-foreground leading-[1.8] pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default BooksFaqSection;
