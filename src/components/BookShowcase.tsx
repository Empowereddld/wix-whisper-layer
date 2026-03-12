import { Button } from "@/components/ui/button";
import bookPaperAirplane from "@/assets/book-paper-airplane.webp";
import bookMakeFriends from "@/assets/book-make-friends.webp";
import bookBirthdayParty from "@/assets/book-birthday-party.webp";
import bookTheatreExchange from "@/assets/book-theatre-exchange.webp";
import kidsReading from "@/assets/3-kids-reading.webp";

const books = [
  { title: "Dan and the Paper Airplane", subtitle: "Dan discovers DLD is why he struggles and starts helpful speech therapy.", image: bookPaperAirplane },
  { title: "Dan and Daria Make Friends", subtitle: "Two kids with DLD discover they're not alone anymore.", image: bookMakeFriends },
  { title: "Dan and Daria Go To a Birthday Party", subtitle: "Daria learns speaking up makes the party better for everyone.", image: bookBirthdayParty },
  { title: "Dan and Daria and The Theatre Exchange", subtitle: "Three DLD kids stop masking and navigate a school play confidently.", image: bookTheatreExchange },
];

const BookShowcase = () => {
  return (
    <section className="py-12 md:py-18" id="books">
      <div className="container px-6 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2 opacity-80">
          Our Books
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-6 md:gap-8 lg:gap-12 items-stretch">
          {/* Text + large image */}
          <div className="flex flex-col">
            <h2 className="text-[26px] md:text-[30px] font-bold text-foreground mb-3.5 leading-[1.1]">
              Stories that celebrate brave kids with DLD
            </h2>
            <p className="text-muted-foreground text-[14px] mb-1 leading-[1.65] max-w-[380px]">
              Meet Dan, Daria, Ming, and Millen!
            </p>
            <p className="text-muted-foreground text-[14px] mb-6 leading-[1.65] max-w-[380px]">
              Four characters impacted by DLD in different ways who learn to understand DLD, what supports work for them, and how to self-advocate with confidence.
            </p>
            <a href="https://mybook.to/nwINcA" target="_blank" rel="noopener noreferrer">
              <Button className="w-fit h-[46px] px-7 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_2px_8px_hsl(258_50%_50%/0.2)] hover:shadow-[0_4px_14px_hsl(258_50%_50%/0.25)] hover:brightness-[0.96] transition-all duration-300">
                SHOP ALL
              </Button>
            </a>

            <div className="mt-8 rounded-2xl overflow-hidden flex-1 min-h-[200px] max-h-[300px] md:max-h-[280px] lg:max-h-none shadow-[0_2px_8px_hsl(258_50%_50%/0.06)]">
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
                <div className="h-36 sm:h-44 lg:h-56 bg-secondary/30 flex items-center justify-center p-3">
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-[11px] sm:text-[12px] text-foreground leading-snug">{book.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">{book.subtitle}</p>
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
