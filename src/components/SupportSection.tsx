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
    <section className="py-20 md:py-24 bg-muted/30" id="about">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-10 lg:gap-16 items-start mb-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
              What We Offer
            </p>
            <h2 className="text-[26px] md:text-[32px] font-semibold text-foreground leading-[1.12]">
              How we support children with DLD
            </h2>
          </div>
          <p className="text-muted-foreground text-[15px] leading-[1.7] lg:pt-7">
            Our comprehensive approach addresses every aspect of a child's language journey — from evidence-based tools for families to professional development for educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-background border border-primary/[0.06] rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-lg bg-lavender flex items-center justify-center mb-4">
                <f.icon className="w-[20px] h-[20px] text-primary stroke-[1.4]" />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-[1.65]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
