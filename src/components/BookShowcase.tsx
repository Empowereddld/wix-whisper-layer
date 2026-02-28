import { Button } from "@/components/ui/button";

const books = [
  { title: "The Words I Know", subtitle: "A story about finding confidence" },
  { title: "Brave Voices", subtitle: "Celebrating kids who communicate differently" },
  { title: "My Language Journey", subtitle: "An adventure in words and pictures" },
  { title: "I Can Say It My Way", subtitle: "A tale of perseverance and pride" },
];

const BookShowcase = () => {
  return (
    <section className="py-24 md:py-32" id="books">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-4">
              Stories That Celebrate Brave Kids with DLD
            </h2>
            <p className="text-muted-foreground text-base mb-9 leading-[1.7]">
              Our books are written to help children with DLD see themselves as the heroes of their own stories. Each book celebrates courage, resilience, and the unique ways children communicate.
            </p>
            <Button className="h-12 px-7 rounded-lg text-base font-medium hover:brightness-95 transition-all">
              Explore All Books
            </Button>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-2 gap-8">
            {books.map((book) => (
              <div
                key={book.title}
                className="bg-background rounded-xl shadow-sm border border-border/30 overflow-hidden hover:-translate-y-px hover:shadow-md transition-all duration-200"
              >
                <div className="bg-secondary h-48">
                  <img
                    src="/placeholder.svg"
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-sans font-semibold text-sm text-foreground">{book.title}</h3>
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
