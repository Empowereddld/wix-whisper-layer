import { Button } from "@/components/ui/button";
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
  },
  {
    tag: "FREE COURSE",
    title: "Free DLD Course",
    description:
      "Practical video lessons for parents and educators. Learn how to support a child with DLD at home and in the classroom, completely free.",
    cta: "Start Learning",
    href: "/resources/free-course",
    image: courseImg,
  },
  {
    tag: "DOWNLOADABLE",
    title: "Free Downloadable Resources",
    description:
      "Printable guides, checklists, and posters ready to use today. Everything you need to support a child with DLD right now for families, clinicians and teachers.",
    cta: "Browse Downloads",
    href: "/resources/downloadables",
    image: downloadImg,
  },
];

const BrowseByTypeSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-6 md:px-8">
        <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/50 mb-3">
          BROWSE BY TYPE
        </p>
        <h2 className="text-[28px] md:text-[42px] font-black text-foreground leading-[1.12] mb-2">
          Find What You Need
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.7] mb-10">
          Each resource is free and designed specifically for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {types.map((item) => (
            <div key={item.tag} className="flex flex-col">
              {/* Image */}
              <div className="rounded-lg overflow-hidden mb-5 aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tag */}
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/50 mb-2">
                {item.tag}
              </p>

              {/* Title */}
              <h3 className="text-[20px] md:text-[22px] font-bold text-foreground leading-[1.2] mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-muted-foreground leading-[1.7] mb-6 flex-1">
                {item.description}
              </p>

              {/* CTA */}
              <a href={item.href}>
                <Button
                  size="sm"
                  className="h-11 px-7 rounded-md text-[13px] font-semibold bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 transition-all duration-200"
                >
                  {item.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByTypeSection;
