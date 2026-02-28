import { Button } from "@/components/ui/button";
import bookPaperAirplane from "@/assets/book-paper-airplane.png";
import bookMakeFriends from "@/assets/book-make-friends.png";
import bookBirthdayParty from "@/assets/book-birthday-party.png";
import bookTheatreExchange from "@/assets/book-theatre-exchange.png";
import kidsReading from "@/assets/kids-reading.png";

const books = [
  { title: "Dan and the Paper Airplane", subtitle: "Living Life With Developmental Language Disorder", image: bookPaperAirplane },
  { title: "Dan & Daria Make Friends", subtitle: "Living Life With Developmental Language Disorder", image: bookMakeFriends },
  { title: "Dan & Daria Go to a Birthday Party", subtitle: "Living Life With Developmental Language Disorder", image: bookBirthdayParty },
  { title: "Dan & Daria and the Theatre Exchange", subtitle: "Living Life With Developmental Language Disorder", image: bookTheatreExchange },
];

const BookShowcase = () => {
  return (
    <section className="py-14 md:py-18" id="books">
      <div className="container">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
          Our Books
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-8 lg:gap-12 items-start">
          {/* Text + large image */}
          <div>
            <h2 className="text-[26px] md:text-[30px] font-bold text-foreground mb-3.5 leading-[1.1]">
              Stories that celebrate brave kids with DLD
            </h2>
            <p className="text-muted-foreground text-[14px] mb-6 leading-[1.65] max-w-[380px]">
              Our books are written to help children with DLD see themselves as the heroes of their own stories. Each book celebrates courage, resilience, and the unique ways children communicate.
            </p>
            <Button className="h-[46px] px-7 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
              SHOP ALL
            </Button>

            <div className="mt-8 rounded-2xl overflow-hidden h-[200px] lg:h-[240px] shadow-[0_2px_8px_hsl(258_50%_50%/0.06)]">
              <img
                src={kidsReading}
                alt="Children reading together"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-2 gap-3">
            {books.map((book) => (
              <div
                key={book.title}
                className="bg-background rounded-xl border border-primary/[0.04] overflow-hidden shadow-[0_1px_2px_hsl(258_50%_50%/0.04)] hover:shadow-[0_5px_18px_-4px_hsl(258_50%_50%/0.1)] hover:-translate-y-[1px] transition-all duration-300"
              >
                <div className="h-36 lg:h-44 bg-secondary/30">
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-[12px] text-foreground leading-snug">{book.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{book.subtitle}</p>
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
