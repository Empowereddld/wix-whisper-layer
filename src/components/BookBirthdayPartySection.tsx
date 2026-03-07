import bookBirthdayParty from "@/assets/book-birthday-party-cover.png";

const BookBirthdayPartySection = () => {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="flex flex-col lg:flex-row-reverse items-stretch">
        {/* Image */}
        <div className="lg:w-[42%] flex-shrink-0 bg-muted">
          <img
            src={bookBirthdayParty}
            alt="Dan and Daria Go to a Birthday Party book cover"
            className="w-full h-full object-cover aspect-square lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 lg:py-16">
          <p className="text-[13px] md:text-[14px] font-semibold text-foreground tracking-wide mb-3">
            <span className="font-bold">Book 4:</span> Explores what DLD looks like in a social setting
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.12] mb-5">
            Dan and Daria Go to a Birthday Party
          </h2>
          <div className="w-14 h-[3px] bg-foreground/20 mb-6" />
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            Daria is excited for the party. But she's nervous too. What if she doesn't understand the rules to the party games? What if kids laugh at her?
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            With the help of her "Pause Button" strategy, Daria learns that speaking up doesn't just help her. It makes the fun more inclusive for everyone.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            This story explores what DLD looks like in social settings, introduces a younger child with DLD, and shows how simple strategies can help children find their voice when it matters most.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-8">
            Perfect for conversations about anxiety, self-advocacy, and inclusive play.
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

export default BookBirthdayPartySection;
