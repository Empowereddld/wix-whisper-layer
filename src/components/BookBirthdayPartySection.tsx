import bookBirthdayParty from "@/assets/book-birthday-party-cover.webp";

const BookBirthdayPartySection = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Text */}
          <div className="flex-1 flex flex-col justify-center py-4 lg:py-8">
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
                href="https://mybook.to/nwINcA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-6 bg-deep-purple text-deep-purple-foreground text-[12px] font-semibold rounded-sm hover:bg-deep-purple/90 transition-colors duration-200"
              >
                Buy on Amazon
              </a>
            </div>
            <p className="mt-3 text-[12px] text-muted-foreground">
              Also available in{" "}
              <a href="https://www.amazon.co.uk/Dan-Daria-Mynd-Barti-Pen-Blwydd/dp/B0FRXSCBZN/ref=sr_1_2?crid=1VN0HAPAN2G3E&dib=eyJ2IjoiMSJ9.LTQoy-0VGe5yMAEBGTNgdWDz9-n8sKJmbU1v2QbUCdY.hXPerJv5p9ofaS4H3_A5ivb7VT6x37e0100eZ7kw5vU&dib_tag=se&keywords=Dan+Daria+Byw+Bywyd+Gydag+Anhwylder+Datblygu+Iaith&qid=1774280656&sprefix=dan+daria+byw+bywyd+gydag+anhwylder+datblygu+iaith%2Caps%2C392&sr=8-2" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Welsh</a>.
            </p>
          </div>

          {/* Image */}
          <div className="lg:w-[38%] flex-shrink-0">
            <img
              src={bookBirthdayParty}
              alt="Dan and Daria Go to a Birthday Party book cover"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookBirthdayPartySection;
