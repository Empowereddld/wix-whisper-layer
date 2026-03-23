import bookDan from "@/assets/book-dan-paper-airplane.webp";

const BookDanSection = () => {
  return (
    <section id="book-dan" className="py-6 md:py-10 scroll-mt-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Image */}
          <div className="lg:w-[38%] flex-shrink-0">
            <img
              src={bookDan}
              alt="Dan and the Paper Airplane book cover"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col justify-center py-4 lg:py-8">
            <p className="text-[11px] md:text-[12px] font-semibold text-foreground tracking-wide mb-2">
              <span className="font-bold">Book 1:</span> Living Life with Developmental Language Disorder Series
            </p>
            <h2 className="text-[22px] md:text-[28px] lg:text-[32px] font-black text-foreground leading-[1.12] mb-3">
              Dan and the Paper Airplane
            </h2>
            <div className="w-10 h-[2px] bg-foreground/20 mb-4" />
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-3">
              Dan loves making paper airplanes. But at school, the words don't always come and instructions feel too fast to follow. Through Dan's eyes, readers learn to recognize language challenges, implement strategies, and experience what it truly feels like to live with DLD.
            </p>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7] max-w-[500px] mb-5">
              A conversation starter for families, a mirror for children with DLD, and a window for educators who want to understand their students better.
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
              <a href="https://www.amazon.ca/Dan-LAvion-En-Papier-D%C3%A9veloppemental/dp/B0DZCNPK9J/ref=asc_df_B0DZCNPK9J?mcid=08eb745d2bb83556b1d423c6b8863395&tag=googleshopc0c-20&linkCode=df0&hvadid=751937625983&hvpos=&hvnetw=g&hvrand=4307501379961356780&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9000789&hvtargid=pla-2421744917454&psc=1&hvocijid=4307501379961356780-B0DZCNPK9J-&hvexpln=0&gad_source=1" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">French</a>,{" "}
              <a href="https://www.amazon.com/-/es/Dan-Avi%C3%B3n-Papel-Trastorno-Desarrollo/dp/B0F12L8T4S" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Spanish</a>,{" "}
              <a href="https://www.barnesandnoble.com/w/dan-and-the-paper-airplane-camesha-russell/1148482396" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Czech</a>,{" "}
              <a href="https://www.amazon.co.uk/Dan-Awyren-Bapur-Anhwylder-Datblygu/dp/B0FR8Y17HG/ref=sr_1_1?crid=DFQWOE2BGPZX&dib=eyJ2IjoiMSJ9.tJFbtuAaVpz6uTWV_WQRkA.tnkabk_Yi1bJA3eVR92gJoziisxXlPI3c9gn3-nmhHQ&dib_tag=se&keywords=Dan+A%27r+Awyren+Bapur+Byw+Bywyd+Gydag+Anhwylder+Datblygu+Iaith&qid=1774280466&sprefix=dan+a%27r+awyren+bapur+byw+bywyd+gydag+anhwylder+datblygu+iaith%2Caps%2C363&sr=8-1" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Welsh</a> and{" "}
              <a href="https://www.amazon.com/Paper-Airplane-Persian-Camesha-Russell/dp/1069763616" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Persian</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDanSection;
