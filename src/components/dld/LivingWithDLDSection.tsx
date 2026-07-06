import { Link } from "react-router-dom";

const p = "text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]";

const LivingWithDLDSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-background">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          Living with DLD: what does support look like at home and school?
        </h2>
        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className={p}>
            Support for DLD works best when it is woven into everyday life. At home, this may look like giving a child time to answer, breaking chores into smaller steps, using pictures or written reminders, reading books together, and talking about what characters think, feel, and do. It may also look like validating frustration when words get stuck. A simple response such as, "I can see you know what you mean. Take your time," can protect confidence.
          </p>
          <p className={p}>
            At school, support may look like clear routines, previewed vocabulary, visual instructions, story maps, supported discussion, and more than one way to show learning. A student with DLD may know the answer but need choices, sentence frames, drawing, pointing, rehearsal, or extra time to express it. This is not lowering expectations. It is giving access to the language demands hidden inside the task.
          </p>
          <p className={p}>
            Representation also matters. When people with DLD see characters, stories, and resources that reflect their experiences, they are more likely to understand that they are not alone. Stories can give language to hard moments, such as feeling overwhelmed by too many directions, needing more time, or feeling embarrassed when words do not come out clearly.
          </p>
          <p className={p}>
            To explore books that help people understand DLD through relatable stories, visit{" "}
            <Link to="/shop/books" className="text-primary font-semibold underline hover:no-underline">Our Books</Link>.
            {" "}For practical tools, guides, and supports, visit the{" "}
            <Link to="/hub" className="text-primary font-semibold underline hover:no-underline">Empowered DLD Resource Library</Link>.
            {" "}For adults who are learning about DLD later in life, you may also find this helpful:{" "}
            <Link to="/blog/dld-as-an-adult" className="text-primary font-semibold underline hover:no-underline">DLD as an Adult</Link>.
          </p>
          <p className={p}>
            DLD is hidden, but the support should not be. When families, educators, speech-language professionals, and people with DLD share the same language, it becomes easier to notice needs, celebrate strengths, and build communication access into daily life.
          </p>
          <p className={p}>
            Understanding DLD is the first step. The next step is making support clear, practical, and available in the moments that matter most. Explore the{" "}
            <Link to="/hub" className="text-primary font-semibold underline hover:no-underline">Empowered DLD Resource Hub</Link>{" "}
            for tools, stories, and educational resources designed to help people with DLD and the adults who care about them.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LivingWithDLDSection;
