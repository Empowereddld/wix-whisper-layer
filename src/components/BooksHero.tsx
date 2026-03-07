import bookCharacters from "@/assets/book-characters.png";

const BooksHero = () => {
  return (
    <section className="bg-background py-16 md:py-20 lg:py-24">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 flex flex-col items-start gap-6">
            <div className="bg-deep-purple px-8 py-3 rounded-sm">
              <span className="text-white text-[24px] md:text-[28px] font-black tracking-wide uppercase">
                BOOKS
              </span>
            </div>
            <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-black text-midnight leading-[1.1]">
              The Living Life with DLD Book Series
            </h1>
            <p className="text-[15px] md:text-[17px] text-stone-ui leading-[1.7] max-w-[500px]">
              Meet Dan, Daria, Ming, and Millen. Four characters. Four stories. One mission: helping children with DLD feel understood, represented, and empowered.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center bg-midnight text-white text-[14px] md:text-[15px] font-semibold px-8 py-3.5 rounded-sm hover:bg-midnight/90 transition-colors duration-200"
            >
              Explore the Series
            </a>
          </div>

          {/* Right image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src={bookCharacters}
              alt="Dan, Daria, Ming, and Millen - Living Life with DLD book characters"
              className="w-full max-w-[500px] lg:max-w-none object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksHero;
