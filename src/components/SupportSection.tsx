import {
  BookOpen,
  Download,
  FolderOpen,
  BookMarked,
  FileText,
  Image,
  UserCog,
  Rocket,
  LayoutGrid,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Core DLD Book Series", description: "Signature books designed to build confidence, language growth, and DLD awareness." },
  { icon: Download, title: "Free Downloadable Resources", description: "Printable tools and guides families and professionals can use right away." },
  { icon: FolderOpen, title: "Documentation Kits", description: "Organized forms and supports for meetings, planning, and student documentation." },
  { icon: BookMarked, title: "Educational DLD Guides", description: "Easy-to-understand guides that explain DLD clearly for home and school settings." },
  { icon: FileText, title: "Family Documents", description: "Ready-to-use family-facing documents that support communication and advocacy." },
  { icon: Image, title: "Infographics", description: "Visual resources that make key DLD concepts simple to share and teach." },
  { icon: UserCog, title: "Professional Development", description: "Training content for educators and clinicians working with children with DLD." },
  { icon: Rocket, title: "New Product Launches", description: "Be first to access newly released tools, workshops, and practical supports." },
  { icon: LayoutGrid, title: "All Resources", description: "Browse the full collection of DLD resources in one place." },
];

const SupportSection = () => {
  return (
    <section className="py-14 md:py-18 bg-muted/25" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-8 lg:gap-14 items-start mb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
              What We Offer
            </p>
            <h2 className="text-[26px] md:text-[30px] font-bold text-foreground leading-[1.1]">
              How we support children with DLD
            </h2>
          </div>
          <p className="text-muted-foreground text-[14px] leading-[1.65] lg:pt-6 max-w-lg">
            Our comprehensive approach addresses every aspect of a child's language journey — from evidence-based tools for families to professional development for educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-primary/[0.04] rounded-xl px-4 py-4 shadow-[0_1px_2px_hsl(258_50%_50%/0.04)] hover:shadow-[0_5px_18px_-4px_hsl(258_50%_50%/0.09)] hover:-translate-y-[1px] transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-lavender flex items-center justify-center mb-2.5">
                <f.icon className="w-[17px] h-[17px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[13px] font-semibold text-foreground mb-0.5">{f.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-[1.55] max-w-[260px]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
