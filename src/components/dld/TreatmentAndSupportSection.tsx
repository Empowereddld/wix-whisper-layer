import { Link } from "react-router-dom";

const p = "text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]";

const TreatmentAndSupportSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-muted">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          How is DLD treated and supported?
        </h2>
        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className={p}>
            DLD support should be practical, meaningful, and connected to real life. Speech-language therapy can help people build skills such as vocabulary, sentence structure, narrative language, inferencing, comprehension monitoring, conversation, and explaining ideas. Therapy may also support reading comprehension and writing, because literacy depends heavily on oral language.
          </p>
          <p className={p}>
            In school, people with DLD often need classroom support, not just therapy in a separate room. Helpful supports may include visual schedules, written instructions, chunked directions, extra processing time, vocabulary preview, sentence starters, graphic organizers, repeated instructions, models, and checks for understanding. Educators can also reduce unnecessary language load by making expectations clear and showing examples of finished work.
          </p>
          <p className={p}>
            In the United States, students may receive support through an IEP or 504 plan. In the United Kingdom, some students may have an EHCP. In Canada a child could also get an IEP. In other countries, the names and systems vary, but the principle is the same: language needs should be recognized and supported across learning environments. For practical classroom resources and educator support, visit{" "}
            <Link to="/for-educators" className="text-primary font-semibold underline hover:no-underline">For Educators</Link>.
          </p>
          <p className={p}>
            Parent and caregiver strategies matter too. Families can support individuals with DLD by slowing down, giving one direction at a time, using visuals, checking understanding gently, modelling language, reading and talking about stories, naming emotions, and giving people time to respond. With practice, adults can learn how to find the balance of not turning every conversation into a lesson while also making everyday language more accessible.
          </p>
          <p className={p}>
            As people get older, self-advocacy becomes especially important. Teens and adults with DLD may benefit from learning phrases such as, "Can you say that another way?", "Can I have that in writing?", "I need a minute to think," or "Can you show me an example?" These are not shortcuts. They are communication access tools.
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Sources:{" "}
            <a href="https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">ASHA</a>,{" "}
            <a href="https://www.nidcd.nih.gov/health/developmental-language-disorder" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">NIDCD</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TreatmentAndSupportSection;
