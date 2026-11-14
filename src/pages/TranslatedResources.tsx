import { useRef, useState } from "react";
import { BookOpen, ChevronDown, Download, ExternalLink, FileText, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

type Item = { title: string; description: string; image: string; href: string };
type Language = { id: string; native: string; english: string; dir?: "rtl"; books: Item[]; resources: Item[] };

// Resources are connected in a later phase. Only add real, verified items here.
const languages: Language[] = [
  { id: "french", native: "Français", english: "French", books: [], resources: [] },
  { id: "spanish", native: "Español", english: "Spanish", books: [], resources: [] },
  { id: "italian", native: "Italiano", english: "Italian", books: [], resources: [] },
  { id: "catalan", native: "Català", english: "Catalan", books: [], resources: [] },
  { id: "welsh", native: "Cymraeg", english: "Welsh", books: [], resources: [] },
  { id: "persian", native: "فارسی", english: "Persian", dir: "rtl", books: [], resources: [] },
  { id: "arabic", native: "العربية", english: "Arabic", dir: "rtl", books: [], resources: [] },
  { id: "chinese", native: "中文", english: "Chinese", books: [], resources: [] },
  { id: "czech", native: "Čeština", english: "Czech", books: [], resources: [] },
  { id: "jamaican-creole", native: "Patwa", english: "Jamaican Creole", books: [], resources: [] },
];

const btn =
  "inline-flex w-fit items-center justify-center gap-2 h-11 px-6 bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] rounded-md hover:opacity-90 transition-opacity duration-200 mt-auto";

const Card = ({ item, cta, external }: { item: Item; cta: string; external?: boolean }) => (
  <div className="flex flex-col bg-muted rounded-xl border border-border/40 overflow-hidden pb-6">
    <div className="aspect-[3/4] overflow-hidden"><img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover" /></div>
    <div className="px-5 pt-4 flex flex-col flex-1">
      <h4 className="text-[17px] font-bold text-foreground leading-tight mb-2">{item.title}</h4>
      <p className="text-[14px] text-muted-foreground leading-relaxed mb-5 flex-1">{item.description}</p>
      <a href={item.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={btn}>
        {external ? <ExternalLink size={16} /> : <Download size={16} />} {cta}
      </a>
    </div>
  </div>
);

const Category = ({ icon: Icon, title, items, cta, external }: { icon: typeof BookOpen; title: string; items: Item[]; cta: string; external?: boolean }) => (
  <div>
    <div className="inline-flex items-center gap-2 bg-primary/10 text-foreground rounded-full px-4 py-2 mb-6">
      <Icon size={18} strokeWidth={1.6} className="text-primary" />
      <h3 className="text-[15px] md:text-[16px] font-bold">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {items.map((i) => <Card key={i.title} item={i} cta={cta} external={external} />)}
    </div>
  </div>
);

const TranslatedResources = () => {
  const [open, setOpen] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const select = (id: string) => {
    setOpen(id);
    setTimeout(() => refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Translated Resources | DLD Resources in Your Native Language | Empowered DLD"
        description="Explore translated children's books, strategy posters, and educational resources about Developmental Language Disorder (DLD) in many languages."
        path="/translated-resources"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Translated Resources", path: "/translated-resources" }]}
      />
      <Header />
      <main>
        <section className="py-16 md:py-20">
          <div className="container px-6 md:px-8 max-w-[900px]">
            <div>
              <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-primary mb-3">Translated Resources</p>
              <h1 className="text-[32px] md:text-[44px] font-black text-foreground leading-[1.1] mb-5">DLD Resources in Your Native Language</h1>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-foreground/80 mb-3 max-w-[680px]">
                Everyone deserves access to information about Developmental Language Disorder (DLD) in a language they understand.
              </p>
              <p className="text-[15px] md:text-[16px] leading-[1.8] text-foreground/80 mb-8 max-w-[680px]">
                Explore our growing collection of translated children's books, strategy posters, and educational resources, made possible through collaborations with generous volunteers and partners around the world.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => select(l.id)}
                    aria-pressed={open === l.id}
                    className={`min-h-[64px] rounded-lg border px-3 py-2 flex flex-col items-center justify-center transition-colors ${
                      open === l.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border/40 text-foreground hover:border-primary"
                    }`}
                  >
                    <span lang={l.id} dir={l.dir} className="text-[16px] font-bold leading-tight">{l.native}</span>
                    <span className={`text-[12px] ${open === l.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{l.english}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 md:pb-[120px]">
          <div className="container px-6 md:px-8 flex flex-col gap-3">
            {languages.map((l) => {
              const isOpen = open === l.id;
              const empty = l.books.length === 0 && l.resources.length === 0;
              return (
                <div key={l.id} ref={(el) => (refs.current[l.id] = el)} className="scroll-mt-28 rounded-xl border border-border/40 overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : l.id)}
                    aria-expanded={isOpen}
                    className={`w-full flex items-center justify-between gap-4 px-5 md:px-8 py-4 md:py-5 text-left transition-colors ${
                      isOpen ? "bg-deep-purple text-white" : "bg-muted text-foreground hover:bg-primary/10"
                    }`}
                  >
                    <span className="text-[18px] md:text-[24px] font-bold">
                      <span dir={l.dir}>{l.native}</span> | {l.english}
                    </span>
                    <ChevronDown size={22} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="bg-background px-5 md:px-8 py-8">
                      {empty ? (
                        <p className="text-[15px] text-muted-foreground leading-relaxed">
                          {l.english} resources are being prepared and will be added here soon.
                        </p>
                      ) : (
                        <div className={`grid gap-10 ${l.books.length && l.resources.length ? "lg:grid-cols-2" : ""}`}>
                          {l.books.length > 0 && <Category icon={BookOpen} title="Children's Books" items={l.books} cta="View / Buy Book" external />}
                          {l.resources.length > 0 && <Category icon={FileText} title="Free Posters & Educational Resources" items={l.resources} cta="Get Free Resource" />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-deep-purple py-16 md:py-24">
          <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-5">
            <h2 className="text-[28px] md:text-[40px] font-black text-white leading-[1.15]">Help Us Translate More Resources</h2>
            <p className="text-[15px] md:text-[16px] text-white/80 leading-[1.7] max-w-[640px]">
              Thank you to the volunteers and collaborators who have helped make our resources accessible in more languages. If you would like to help translate our educational materials, we would love to hear from you.
            </p>
            <a href="mailto:hello@empowereddld.com" className="inline-flex items-center gap-2 h-12 px-7 bg-background text-foreground text-[14px] font-semibold rounded-md hover:opacity-90 transition-opacity">
              <Mail size={18} /> Email Us at hello@empowereddld.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TranslatedResources;
