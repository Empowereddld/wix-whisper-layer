import { Button } from "@/components/ui/button";

const books = [
  { title: "The Words I Know", subtitle: "A story about finding confidence" },
  { title: "Brave Voices", subtitle: "Celebrating kids who communicate differently" },
  { title: "My Language Journey", subtitle: "An adventure in words and pictures" },
  { title: "I Can Say It My Way", subtitle: "A tale of perseverance and pride" },
];

const BookShowcase = () => {
  return (
    <section className="py-20 md:py-28" id="books">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[28px] md:text-[34px] font-normal text-foreground mb-4">
              Stories That Celebrate Brave Kids with DLD
            </h2>
            <p className="text-muted-foreground text-base mb-8 leading-[1.75]">
              Our books are written to help children with DLD see themselves as the heroes of their own stories. Each book celebrates courage, resilience, and the unique ways children communicate.
            </p>
            <Button className="h-12 px-7 rounded-lg text-base font-medium hover:brightness-95 transition-all">
              Explore All Books
            </Button>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-2 gap-7">
            {books.map((book) => (
              <div
                key={book.title}
                className="bg-background rounded-xl shadow-sm border border-border/50 overflow-hidden hover:-translate-y-[1px] hover:shadow-md transition-all duration-200"
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
