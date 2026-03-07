import bookDan from "@/assets/book-dan-paper-airplane.png";

const BookDanSection = () => {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Image */}
        <div className="lg:w-[42%] flex-shrink-0 bg-muted">
          <img
            src={bookDan}
            alt="Dan and the Paper Airplane book cover"
            className="w-full h-full object-cover aspect-square lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 lg:py-16">
          <p className="text-[13px] md:text-[14px] font-semibold text-foreground tracking-wide mb-3">
            <span className="font-bold">Book 1:</span> Living Life with Developmental Language Disorder Series
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.12] mb-5">
            Dan and the Paper Airplane
          </h2>
          <div className="w-14 h-[3px] bg-foreground/20 mb-6" />
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            Dan loves making paper airplanes. But at school, the words don't always come and instructions feel too fast to follow. Through Dan's eyes, readers learn to recognize language challenges, implement strategies, and experience what it truly feels like to live with DLD.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-8">
            A conversation starter for families, a mirror for children with DLD, and a window for educators who want to understand their students better.
          </p>
          <div>
            <a
              href="#"
              className="inline-flex items-center justify-center h-12 px-8 bg-deep-purple text-deep-purple-foreground text-[13px] font-semibold rounded-sm hover:bg-deep-purple/90 transition-colors duration-200"
            >
              Buy on Amazon
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDanSection;
