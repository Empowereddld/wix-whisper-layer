import bookBirthdayParty from "@/assets/book-birthday-party-cover.png";

const BookBirthdayPartySection = () => {
  return (
    <section className="py-10 md:py-[72px]">
      <div className="flex flex-col lg:flex-row-reverse items-stretch">
        {/* Image */}
        <div className="lg:w-[34%] flex-shrink-0 bg-muted">
          <img
            src={bookBirthdayParty}
            alt="Dan and Daria Go to a Birthday Party book cover"
            className="w-full h-full object-cover aspect-[4/3] lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-5 md:px-8 lg:px-12 py-7 lg:py-10">
          <p className="text-[11px] md:text-[12px] font-semibold text-foreground tracking-wide mb-2">
            <span className="font-bold">Book 4:</span> Explores what DLD looks like in a social setting
          </p>
          <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-3">
            Dan and Daria Go to a Birthday Party
          </h2>
          <div className="w-10 h-[2px] bg-foreground/20 mb-4" />
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
            Daria is excited for the party. But she's nervous too. What if she doesn't understand the rules to the party games? What if kids laugh at her?
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
            With the help of her "Pause Button" strategy, Daria learns that speaking up doesn't just help her. It makes the fun more inclusive for everyone.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
            This story explores what DLD looks like in social settings, introduces a younger child with DLD, and shows how simple strategies can help children find their voice when it matters most.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-5">
            Perfect for conversations about anxiety, self-advocacy, and inclusive play.
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

export default BookBirthdayPartySection;
