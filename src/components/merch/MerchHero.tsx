import merchHero from "@/assets/merch-hero-family.png.asset.json";

const MerchHero = () => {
  return (
    <section className="bg-deep-purple py-16 md:py-24 lg:py-28">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60 mb-4">
              SHOP MERCH
            </p>
            <h1 className="text-[32px] md:text-[44px] lg:text-[54px] font-black text-white leading-[1.08] mb-5">
              Wear It. Share It.<br />Start the Conversation.
            </h1>
            <p className="text-[15px] md:text-[16px] text-white/80 leading-[1.7] max-w-[520px] mb-8">
              Soft tees, ceramic mugs, and canvas totes that help more people learn about Developmental Language Disorder. Every piece helps raise awareness.
            </p>
            <a
              href="#shop"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-deep-purple text-[13px] font-bold uppercase tracking-[0.12em] rounded-md hover:bg-white/90 transition-colors duration-200"
            >
              Shop the Collection
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[16/10] lg:aspect-[3/2]">
            <img
              src={merchHero.url}
              alt="Empowered DLD merchandise: tee, mug, and tote bag"
              className="w-full h-full object-cover object-[60%_center] md:object-center"
              width={1536}
              height={1024}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchHero;
