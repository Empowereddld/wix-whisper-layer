import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Who prints and ships my order?",
    a: "Our merch is produced on demand by our print partner, with print facilities in over 30 countries. Your order is printed at the facility closest to your shipping address to cut delivery time and emissions.",
  },
  {
    q: "How long does shipping take?",
    a: "Most orders arrive within 5 to 10 business days. You will get a tracking number by email as soon as your order ships.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship worldwide. Duties and taxes for international orders are calculated at checkout where applicable.",
  },
  {
    q: "What is your return policy?",
    a: "Because every item is printed on demand, we do not accept change-of-mind returns. If your order arrives damaged or with a print defect, email us within 14 days and we will replace it at no cost.",
  },
  {
    q: "Where does the money go?",
    a: "Proceeds support Empowered DLD's awareness work, including free resources for families, educators, and therapists.",
  },
];

const MerchFaq = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/40">
      <div className="container px-6 md:px-8">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 text-center">
            GOOD TO KNOW
          </p>
          <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-black text-foreground leading-[1.15] mb-10 text-center">
            Shipping, Returns, and the Small Print
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-background rounded-xl border border-border/50 px-5 md:px-6"
              >
                <AccordionTrigger className="text-left text-[15px] md:text-[16px] font-semibold text-foreground hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default MerchFaq;
