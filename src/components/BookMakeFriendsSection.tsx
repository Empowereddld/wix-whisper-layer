import bookMakeFriends from "@/assets/book-dan-daria-make-friends.png";

const BookMakeFriendsSection = () => {
  return (
    <section className="py-16 md:py-[120px]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Image */}
        <div className="lg:w-[42%] flex-shrink-0 bg-muted">
          <img
            src={bookMakeFriends}
            alt="Dan & Daria Make Friends book cover"
            className="w-full h-full object-cover aspect-square lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 lg:py-16">
          <p className="text-[13px] md:text-[14px] font-semibold text-foreground tracking-wide mb-3">
            <span className="font-bold">Book 3:</span> A story about friendship, self-advocacy, and being brave
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.12] mb-5">
            Dan & Daria Make Friends
          </h2>
          <div className="w-14 h-[3px] bg-foreground/20 mb-6" />
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            Dan and Daria don't just share a love for creativity. They both have DLD. And together, they discover something powerful: you don't have to figure it out alone.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            Watch as these two friends grow in confidence, learn to ask for help, speak up for what they need, and eventually lead their own DLD support group and organize a DLD Awareness Day at their school.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-5">
            A story about friendship, self-advocacy, and what's possible when children with DLD find their people.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[550px] mb-8">
            Perfect for inclusive classrooms, SEL discussions, and speech therapy sessions.
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

export default BookMakeFriendsSection;
