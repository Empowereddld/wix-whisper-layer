import bookTheatreExchange from "@/assets/book-theatre-exchange-cover.png";

const BookTheatreExchangeSection = () => {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Image */}
        <div className="lg:w-[42%] flex-shrink-0 bg-muted">
          <img
            src={bookTheatreExchange}
            alt="Dan & Daria and The Theatre Exchange book cover"
            className="w-full h-full object-cover aspect-square lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 lg:py-16">
          <p className="text-[13px] md:text-[14px] font-semibold text-foreground tracking-wide mb-3">
            <span className="font-bold">Book 5:</span> A story about being brave when words are hard
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.12] mb-5">
            Dan & Daria and The Theatre Exchange
          </h2>
          <div className="w-14 h-[3px] bg-foreground/20 mb-6" />
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            It's Theatre Month and Dan is excited. But Daria is overwhelmed. Then Millen arrives, a confident new student from the UK who knows exactly what it feels like to have DLD, and everything shifts.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            Together, Dan, Daria, and Millen navigate rehearsals, manage anxiety, share strategies, and build real confidence with support from their speech therapist. Because when you find people who truly understand, anything feels possible.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            This book introduces Millen, a real girl from the UK who won our global character contest, and features the theme "You can't see DLD" throughout the book. This is a story about bravery, belonging, and what happens when children with DLD keeping trying even when it's tough!
          </p>
          <div className="mt-3">
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

export default BookTheatreExchangeSection;
