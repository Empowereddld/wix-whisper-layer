import { Button } from "@/components/ui/button";

const books = [
  { title: "Brave Twilight Style", subtitle: "A story about finding confidence" },
  { title: "Words with Tyler Ideas", subtitle: "Celebrating kids who communicate differently" },
  { title: "Brave Youth Style for...", subtitle: "An adventure in words and pictures" },
  { title: "Brave Youth Style...", subtitle: "A tale of perseverance and pride" },
];

const BookShowcase = () => {
  return (
    <section className="py-20 md:py-28" id="books">
      <div className="container">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-3">
          Our Books
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-start">
          {/* Text + large image */}
          <div>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-4 leading-tight">
              Stories that celebrate brave kids with DLD
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-[1.7]">
              Our books are written to help children with DLD see themselves as the heroes of their own stories. Each book celebrates courage, resilience, and the unique ways children communicate.
            </p>
            <Button className="h-11 px-7 rounded-lg text-sm font-semibold uppercase tracking-wider hover:brightness-95 transition-all">
              Shop All
            </Button>

            {/* Large lifestyle image below text on desktop */}
            <div className="mt-10 rounded-2xl overflow-hidden h-[220px] lg:h-[280px] bg-secondary">
              <img
                src="/placeholder.svg"
                alt="Children reading together"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-2 gap-5">
            {books.map((book) => (
              <div
                key={book.title}
                className="bg-background rounded-xl shadow-sm border border-border/20 overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <div className="bg-secondary h-44 lg:h-52">
                  <img
                    src="/placeholder.svg"
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-sans font-semibold text-sm text-foreground leading-snug">{book.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{book.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookShowcase;
