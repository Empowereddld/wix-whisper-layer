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
    <section className="py-18 md:py-22 bg-muted/25" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-10 lg:gap-16 items-start mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2.5 opacity-80">
              What We Offer
            </p>
            <h2 className="text-[26px] md:text-[32px] font-bold text-foreground leading-[1.1]">
              How we support children with DLD
            </h2>
          </div>
          <p className="text-muted-foreground text-[15px] leading-[1.7] lg:pt-7 max-w-xl">
            Our comprehensive approach addresses every aspect of a child's language journey — from evidence-based tools for families to professional development for educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-primary/[0.05] rounded-xl p-5 premium-card"
            >
              <div className="w-10 h-10 rounded-lg bg-lavender flex items-center justify-center mb-3">
                <f.icon className="w-[18px] h-[18px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-[1.6]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
