import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <section className="my-10">
      <h3 className="font-display text-2xl font-bold text-foreground mb-4">FAQs</h3>
      <Accordion type="single" collapsible className="w-full border-t border-border">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default BlogFAQAccordion;
