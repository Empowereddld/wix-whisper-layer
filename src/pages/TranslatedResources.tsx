import { useRef, useState } from "react";
import { BookOpen, ChevronDown, ArrowRight, ExternalLink, FileText, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useResources } from "@/hooks/useResources";
import { translationsForLanguage, translatedResourcePath } from "@/lib/translatedResources";
import { TRANSLATED_BOOKS } from "@/lib/translatedBooks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import danAndDaria from "@/assets/dan-and-daria.webp";

type Item = { id?: string; title: string; description: string; image?: string | null; href: string };
type Language = { id: string; native: string; english: string; dir?: "rtl" };
const languageLabels: Language[] = [
  { id: "french", native: "Français", english: "French" },
  { id: "spanish", native: "Español", english: "Spanish" },
  { id: "italian", native: "Italiano", english: "Italian" },
  { id: "catalan", native: "Català", english: "Catalan" },
  { id: "welsh", native: "Cymraeg", english: "Welsh" },
  { id: "persian", native: "فارسی", english: "Persian", dir: "rtl" },
  { id: "arabic", native: "العربية", english: "Arabic", dir: "rtl" },
  { id: "chinese", native: "中文", english: "Chinese" },
  { id: "czech", native: "Čeština", english: "Czech" },
  { id: "jamaican-creole", native: "Patwa", english: "Jamaican Creole" },
];

const btn =
  "inline-flex w-full sm:w-fit whitespace-normal items-center justify-center gap-2 h-auto min-h-11 px-2 py-2 bg-foreground text-background text-[12px] font-semibold rounded-md hover:opacity-90 transition-opacity duration-200 mt-auto";

const Card = ({ item, cta, external }: { item: Item; cta: string; external?: boolean }) => (
  <div className="flex flex-col bg-muted rounded-xl border border-border/40 overflow-hidden pb-4">
    {item.image && <div className="aspect-[4/5] overflow-hidden"><img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-contain object-top" /></div>}
    <div className="px-3 pt-3 flex flex-col flex-1">
      <h4 className="text-[14px] font-bold text-foreground leading-tight mb-1">{item.title}</h4>
      <p className="text-[12px] text-muted-foreground leading-snug mb-3 flex-1 line-clamp-3">{item.description}</p>
      <Button asChild className={btn}>
        {external ? <a href={item.href} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> {cta}</a> : <Link to={item.href}><ArrowRight size={16} /> {cta}</Link>}
      </Button>
    </div>
  </div>
);

const Category = ({ icon: Icon, title, items, cta, external }: { icon: typeof BookOpen; title: string; items: Item[]; cta: string; external?: boolean }) => (
  <div>
    <div className="inline-flex items-center gap-2 bg-primary/10 text-foreground rounded-full px-4 py-2 mb-6">
      <Icon size={18} strokeWidth={1.6} className="text-primary" />
      <h3 className="text-[15px] md:text-[16px] font-bold">{title}</h3>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((i) => <Card key={i.id || i.href} item={i} cta={cta} external={external} />)}
    </div>
  </div>
);

const TranslatedResources = () => {
  const { allResources, loading } = useResources();
  const languages = languageLabels.map((language) => ({
    ...language,
    books: TRANSLATED_BOOKS[language.english] || [],
    resources: translationsForLanguage(allResources, language.english).map((resource) => ({
      id: resource.id, title: resource.title, description: resource.description || "", image: resource.thumbnail_url, href: translatedResourcePath(resource),
    })),
  }));
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
        <section className="pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="container px-6 md:px-8">
            <div className="grid lg:grid-cols-[minmax(0,400px)_1fr] gap-8 lg:gap-14 items-center">
              <div className="order-1 flex justify-center">
                <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[400px]">
                  <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] aspect-square bg-primary/10 rounded-full" />
                  <img src={danAndDaria} alt="Dan and Daria, the Empowered DLD characters" className="relative w-full h-auto" />
                </div>
              </div>
              <div className="order-2">
                <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-primary mb-3">Translated Resources</p>
                <h1 className="text-[30px] md:text-[40px] lg:text-[44px] font-black text-foreground leading-[1.1] mb-5 max-w-[620px]">DLD Resources in Your Native Language</h1>
                <p className="text-[15px] md:text-[16px] leading-[1.8] text-foreground/80 mb-3 max-w-[680px]">
                  Everyone deserves access to information about Developmental Language Disorder (DLD) in a language they understand.
                </p>
                <p className="text-[15px] md:text-[16px] leading-[1.8] text-foreground/80 max-w-[680px]">
                  Explore our growing collection of translated children's books, strategy posters, and educational resources, made possible through collaborations with generous volunteers and partners around the world.
                </p>
              </div>
            </div>
            <div className="mt-10 md:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {languages.map((l) => (
                  <Button
                    variant="ghost"
                    key={l.id}
                    onClick={() => select(l.id)}
                    aria-pressed={open === l.id}
                    className={`h-auto min-h-[64px] whitespace-normal rounded-lg border px-3 py-2 flex flex-col items-center justify-center transition-colors ${
                      open === l.id ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border/40 text-foreground hover:border-primary"
                    }`}
                  >
                    <span lang={l.id} dir={l.dir} className="text-[16px] font-bold leading-tight">{l.native}</span>
                    <span className={`text-[12px] ${open === l.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{l.english}</span>
                  </Button>
                ))}
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
                  <Button
                    variant="ghost"
                    onClick={() => setOpen(isOpen ? null : l.id)}
                    aria-expanded={isOpen}
                    className={`h-auto min-h-14 whitespace-normal w-full flex items-center justify-between gap-4 px-5 md:px-8 py-4 md:py-5 text-left transition-colors ${
                      isOpen ? "bg-deep-purple text-deep-purple-foreground" : "bg-muted text-foreground hover:bg-primary/10"
                    }`}
                  >
                    <span className="text-[18px] md:text-[24px] font-bold">
                      <span dir={l.dir}>{l.native}</span> | {l.english}
                    </span>
                    <ChevronDown size={22} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </Button>
                  {isOpen && (
                    <div className="bg-background px-5 md:px-8 py-8">
                      {loading ? <p role="status" className="text-muted-foreground">Loading resources...</p> : empty ? (
                        <p className="text-[15px] text-muted-foreground leading-relaxed">
                          {l.english} resources are being prepared and will be added here soon.
                        </p>
                      ) : (
                        <div className="grid gap-10">
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
            <h2 className="text-[28px] md:text-[40px] font-black text-white leading-[1.15]">Want to Help Us Translate More Resources?</h2>
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
