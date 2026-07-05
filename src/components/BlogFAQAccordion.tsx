import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQAccordionProps {
  items: FAQItem[];
}

const BlogFAQAccordion = ({ items }: BlogFAQAccordionProps) => {
  if (!items.length) return null;
  return (
    <section className="my-12 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground m-0">
          Frequently Asked Questions
        </h3>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border-b border-border/60 last:border-b-0"
          >
            <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline hover:text-primary transition-colors py-4">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground pb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default BlogFAQAccordion;
