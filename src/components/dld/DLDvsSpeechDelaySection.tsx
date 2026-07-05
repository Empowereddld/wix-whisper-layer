import { Link } from "react-router-dom";

const p = "text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]";

const DLDvsSpeechDelaySection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-muted">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          DLD vs speech delay: what's the difference?
        </h2>
        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className={p}>
            Speech and language are connected, but they are not the same thing. Speech is about how sounds are produced. A speech delay may involve difficulty saying certain sounds, being hard to understand, or developing speech sounds later than expected. Some late talkers catch up, especially when the main issue is early expressive language and other language skills are developing well.
          </p>
          <p className={p}>
            DLD is broader and more persistent. It affects how a person understands and uses language. A person with DLD may speak clearly but still have difficulty understanding complex sentences, learning vocabulary, answering questions, telling a story, explaining an idea, or organizing written language. In other words, the sounds may be clear, but the language system is still working harder.
          </p>
          <p className={p}>
            This difference is one reason DLD is missed. Adults may hear clear speech and assume language is fine. A student may read words accurately but struggle to understand the text. A teen may sound conversational but shut down when asked to explain, infer, summarize, debate, or write.
          </p>
          <p className={p}>
            If you are also wondering how DLD compares with autism, we explain that common question here:{" "}
            <Link to="/blog/autism-vs-dld-understand-the-difference" className="text-primary font-semibold underline hover:no-underline">
              Autism vs DLD: Understand the Difference
            </Link>
            .
          </p>
          <p className={p}>
            The short version is this: speech delay is usually about speech sound development or early talking. DLD is about the deeper language skills needed to understand, express, learn, read, write, and connect.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DLDvsSpeechDelaySection;
