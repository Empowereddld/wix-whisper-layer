import bookDan from "@/assets/book-dan-paper-airplane.png";

const BookDanSection = () => {
  return (
    <section className="py-10 md:py-[72px]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Image */}
          <div className="lg:w-[38%] flex-shrink-0">
            <img
              src={bookDan}
              alt="Dan and the Paper Airplane book cover"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col justify-center py-4 lg:py-8">
            <p className="text-[11px] md:text-[12px] font-semibold text-foreground tracking-wide mb-2">
              <span className="font-bold">Book 1:</span> Living Life with Developmental Language Disorder Series
            </p>
            <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-3">
              Dan and the Paper Airplane
            </h2>
            <div className="w-10 h-[2px] bg-foreground/20 mb-4" />
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              Dan loves making paper airplanes. But at school, the words don't always come and instructions feel too fast to follow. Through Dan's eyes, readers learn to recognize language challenges, implement strategies, and experience what it truly feels like to live with DLD.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-5">
              A conversation starter for families, a mirror for children with DLD, and a window for educators who want to understand their students better.
            </p>
            <div>
              <a
                href="#"
                className="inline-flex items-center justify-center h-10 px-6 bg-deep-purple text-deep-purple-foreground text-[12px] font-semibold rounded-sm hover:bg-deep-purple/90 transition-colors duration-200"
              >
                Buy on Amazon
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDanSection;
