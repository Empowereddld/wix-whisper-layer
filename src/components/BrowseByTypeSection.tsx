import { Link } from "react-router-dom";
import podcastImg from "@/assets/resource-podcast.png";
import courseImg from "@/assets/resource-course.jpg";
import downloadImg from "@/assets/resource-downloadables.png";

const types = [
  {
    tag: "PODCAST",
    title: "Life with DLD Podcast",
    description:
      "Hear directly from children living with DLD. Help your child feel safe opening up as you watch together! Be amazed at the vulnerable way your child shares!",
    cta: "Listen Now",
    href: "/resources/podcasts",
    image: podcastImg,
    imageClass: "scale-[1.15] object-center",
  },
  {
    tag: "FREE COURSE",
    title: "Free DLD Course",
    description:
      "Practical video lessons for parents and educators. Learn how to support a child with DLD at home and in the classroom, completely free.",
    cta: "Start Learning",
    href: "/resources/free-course",
    image: courseImg,
    imageClass: "",
  },
  {
    tag: "DOWNLOADABLE",
    title: "Free Downloadable Resources",
    description:
      "Printable guides, checklists, and posters ready to use today. Everything you need to support a child with DLD right now for families, clinicians and teachers.",
    cta: "Browse Downloads",
    href: "/resources/downloadables",
    image: downloadImg,
    imageClass: "",
  },
];

const BrowseByTypeSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-28">
      <div className="max-w-[1300px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            BROWSE BY TYPE
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-3">
            Find What You Need
          </h2>
          <p className="text-[15px] md:text-[16px] text-muted-foreground leading-relaxed max-w-[500px]">
            Each resource is free and designed specifically for you.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {types.map((item) => (
            <div key={item.tag} className="flex flex-col bg-muted rounded-xl border border-border/40 overflow-hidden pb-8">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover ${item.imageClass}`}
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="px-6 pt-5 flex flex-col flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {item.tag}
                </p>
                <h3 className="text-[20px] md:text-[22px] font-bold text-foreground leading-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                {/* CTA */}
                <Link
                  to={item.href}
                  className="inline-flex items-center justify-center h-11 px-7 bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] rounded-md hover:opacity-90 transition-opacity duration-200 w-fit mt-auto"
                >
                  {item.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByTypeSection;
