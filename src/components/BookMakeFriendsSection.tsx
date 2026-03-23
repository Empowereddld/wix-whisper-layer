import bookMakeFriends from "@/assets/book-dan-daria-make-friends.webp";

const BookMakeFriendsSection = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Image */}
          <div className="lg:w-[38%] flex-shrink-0">
            <img
              src={bookMakeFriends}
              alt="Dan & Daria Make Friends book cover"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col justify-center py-4 lg:py-8">
            <p className="text-[11px] md:text-[12px] font-semibold text-foreground tracking-wide mb-2">
              <span className="font-bold">Book 3:</span> A story about friendship, self-advocacy, and being brave
            </p>
            <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-3">
              Dan & Daria Make Friends
            </h2>
            <div className="w-10 h-[2px] bg-foreground/20 mb-4" />
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              Dan and Daria don't just share a love for creativity. They both have DLD. And together, they discover something powerful: you don't have to figure it out alone.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              Watch as these two friends grow in confidence, learn to ask for help, speak up for what they need, and eventually lead their own DLD support group and organize a DLD Awareness Day at their school.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              A story about friendship, self-advocacy, and what's possible when children with DLD find their people.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-5">
              Perfect for inclusive classrooms, SEL discussions, and speech therapy sessions.
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
              <a href="https://www.amazon.ca/Dan-Daria-Deviennent-Amis-d%C3%A9veloppemental/dp/B0G4DGGN5V/ref=sr_1_1?crid=W0OMSGQXMAAD&dib=eyJ2IjoiMSJ9.NfrlOBmyLaEPz9mzEsRvtw._mpkkkLj8kbld0YyZC5tHwTTJTnglgjYGrgN19jVLkM&dib_tag=se&keywords=Dan+et+Daria+Deviennet+Amis+Vivre+avec+un+trouble&qid=1774280603&s=books&sprefix=dan+et+daria+deviennet+amis+vivre+avec+un+trouble%2Cstripbooks%2C96&sr=1-1" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">French</a> and{" "}
              <a href="https://www.amazon.co.uk/Dan-Daria-Gwneud-Ffrindiau-Anhwylder/dp/B0FR9K8JJT/ref=sr_1_1?crid=1VN0HAPAN2G3E&dib=eyJ2IjoiMSJ9.LTQoy-0VGe5yMAEBGTNgdWDz9-n8sKJmbU1v2QbUCdY.hXPerJv5p9ofaS4H3_A5ivb7VT6x37e0100eZ7kw5vU&dib_tag=se&keywords=Dan+Daria+Byw+Bywyd+Gydag+Anhwylder+Datblygu+Iaith&qid=1774280656&sprefix=dan+daria+byw+bywyd+gydag+anhwylder+datblygu+iaith%2Caps%2C392&sr=8-1" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Welsh</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookMakeFriendsSection;
