import bookMakeFriends from "@/assets/book-dan-daria-make-friends.png";

const BookMakeFriendsSection = () => {
  return (
    <section className="py-10 md:py-[72px]">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Image */}
        <div className="lg:w-[34%] flex-shrink-0 bg-muted">
          <img
            src={bookMakeFriends}
            alt="Dan & Daria Make Friends book cover"
            className="w-full h-full object-cover aspect-[4/3] lg:aspect-auto"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center px-5 md:px-8 lg:px-12 py-7 lg:py-10">
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

export default BookMakeFriendsSection;
