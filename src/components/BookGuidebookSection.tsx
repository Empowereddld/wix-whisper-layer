import bookGuidebook from "@/assets/book-parent-guidebook.png";

const BookGuidebookSection = () => {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="flex flex-col lg:flex-row-reverse items-stretch">
        {/* Image */}
        <div className="lg:w-[42%] flex-shrink-0 bg-muted">
          <img
            src={bookGuidebook}
            alt="Discussing DLD with Your Child – Parent Guidebook cover"
            className="w-full h-full object-cover aspect-square lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 lg:py-16">
          <p className="text-[13px] md:text-[14px] font-semibold text-foreground tracking-wide mb-3">
            <span className="font-bold">Book 2:</span> A practical companion for support at home
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.12] mb-5">
            Dan and the Paper Airplane: Parent Guidebook
          </h2>
          <div className="w-14 h-[3px] bg-foreground/20 mb-6" />
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            You've just received a diagnosis. Or maybe you've suspected something for a while. Either way, you're looking for words, strategies, and somewhere to start discussing DLD with your child.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            This guidebook gives you exactly that. From conversation prompts to confidence-building activities, every section is designed to help you feel less overwhelmed and more equipped to support your child with DLD.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-8">
            Use it alongside Dan and the Paper Airplane.
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

export default BookGuidebookSection;
