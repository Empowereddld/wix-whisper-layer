import bookGuidebook from "@/assets/book-parent-guidebook.png";

const BookGuidebookSection = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Text */}
          <div className="flex-1 flex flex-col justify-center py-4 lg:py-8">
            <p className="text-[11px] md:text-[12px] font-semibold text-foreground tracking-wide mb-2">
              <span className="font-bold">Book 2:</span> A practical companion for support at home
            </p>
            <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-3">
              Dan and the Paper Airplane: Parent Guidebook
            </h2>
            <div className="w-10 h-[2px] bg-foreground/20 mb-4" />
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              You've just received a diagnosis. Or maybe you've suspected something for a while. Either way, you're looking for words, strategies, and somewhere to start discussing DLD with your child.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              This guidebook gives you exactly that. From conversation prompts to confidence-building activities, every section is designed to help you feel less overwhelmed and more equipped to support your child with DLD.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-5">
              Use it alongside Dan and the Paper Airplane.
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

          {/* Image */}
          <div className="lg:w-[38%] flex-shrink-0">
            <img
              src={bookGuidebook}
              alt="Discussing DLD with Your Child – Parent Guidebook cover"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookGuidebookSection;
