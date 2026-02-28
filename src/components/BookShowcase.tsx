import { Button } from "@/components/ui/button";

const books = [
  { title: "Brave Twilight Style", subtitle: "A story about finding confidence" },
  { title: "Words with Tyler Ideas", subtitle: "Celebrating kids who communicate differently" },
  { title: "Brave Youth Style for...", subtitle: "An adventure in words and pictures" },
  { title: "Brave Youth Style...", subtitle: "A tale of perseverance and pride" },
];

const BookShowcase = () => {
  return (
    <section className="py-18 md:py-22" id="books">
      <div className="container">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2.5 opacity-80">
          Our Books
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-10 lg:gap-14 items-start">
          {/* Text + large image */}
          <div>
            <h2 className="text-[26px] md:text-[32px] font-bold text-foreground mb-4 leading-[1.1]">
              Stories that celebrate brave kids with DLD
            </h2>
            <p className="text-muted-foreground text-[15px] mb-7 leading-[1.7] max-w-md">
              Our books are written to help children with DLD see themselves as the heroes of their own stories. Each book celebrates courage, resilience, and the unique ways children communicate.
            </p>
            <Button className="h-[48px] px-8 rounded-lg text-[12px] font-bold uppercase tracking-[0.14em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-elevated)] hover:brightness-95 transition-all duration-300">
              SHOP ALL
            </Button>

            <div className="mt-9 rounded-2xl overflow-hidden h-[200px] lg:h-[260px] bg-gradient-to-br from-secondary to-lavender shadow-[var(--shadow-card)]">
              <img
                src="/placeholder.svg"
                alt="Children reading together"
                className="w-full h-full object-cover mix-blend-multiply"
                loading="lazy"
              />
            </div>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-2 gap-4">
            {books.map((book) => (
              <div
                key={book.title}
                className="bg-background rounded-xl border border-primary/[0.05] overflow-hidden premium-card"
              >
                <div className="bg-gradient-to-br from-secondary to-lavender h-40 lg:h-48">
                  <img
                    src="/placeholder.svg"
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5">
                  <h3 className="font-semibold text-[13px] text-foreground leading-snug">{book.title}</h3>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{book.subtitle}</p>
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
