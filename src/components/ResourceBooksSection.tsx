import { ExternalLink } from "lucide-react";
import booksImg from "@/assets/resource-books-collection.png";

const ResourceBooksSection = () => {
  return (
    <section className="pb-16 md:pb-24 lg:pb-28">
      <div className="max-w-[1300px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-background rounded-xl border border-border/40 overflow-hidden">
          {/* Image */}
          <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[380px]">
            <img
              src={booksImg}
              alt="Dan and Daria book collection for children with DLD"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-14 lg:px-14">
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              OUR BOOKS
            </p>
            <h2 className="text-[26px] md:text-[32px] lg:text-[36px] font-black text-foreground leading-[1.1] mb-4">
              Stories That Help Children With DLD Feel Seen
            </h2>
            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-[480px]">
              Meet Dan, Daria, Ming, and Millen — four children with DLD who are learning to understand themselves, navigate challenges, and advocate for what they need.
              <br /><br />
              Trusted by families, therapists, and educators around the world.
            </p>
            <a
              href="https://mybook.to/nwINcA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-7 bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] rounded-md hover:opacity-90 transition-opacity duration-200 w-fit"
            >
              Shop on Amazon
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceBooksSection;
