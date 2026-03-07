import bookTheatreExchange from "@/assets/book-theatre-exchange-cover.png";

const BookTheatreExchangeSection = () => {
  return (
    <section className="py-10 md:py-[72px]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Image */}
        <div className="lg:w-[34%] flex-shrink-0 bg-muted">
          <img
            src={bookTheatreExchange}
            alt="Dan & Daria and The Theatre Exchange book cover"
            className="w-full h-full object-cover aspect-[4/3] lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-5 md:px-8 lg:px-12 py-7 lg:py-10">
          <p className="text-[11px] md:text-[12px] font-semibold text-foreground tracking-wide mb-2">
            <span className="font-bold">Book 5:</span> A story about being brave when words are hard
          </p>
          <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-3">
            Dan & Daria and The Theatre Exchange
          </h2>
          <div className="w-10 h-[2px] bg-foreground/20 mb-4" />
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
            It's Theatre Month and Dan is excited. But Daria is overwhelmed. Then Millen arrives, a confident new student from the UK who knows exactly what it feels like to have DLD, and everything shifts.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
            Together, Dan, Daria, and Millen navigate rehearsals, manage anxiety, share strategies, and build real confidence with support from their speech therapist. Because when you find people who truly understand, anything feels possible.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-5">
            This book introduces Millen, a real girl from the UK who won our global character contest, and features the theme "You can't see DLD" throughout the book. This is a story about bravery, belonging, and what happens when children with DLD keeping trying even when it's tough!
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
    </section>
  );
};

export default BookTheatreExchangeSection;
