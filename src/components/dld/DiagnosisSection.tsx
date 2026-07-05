const p = "text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]";

const DiagnosisSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-background">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          How is DLD diagnosed?
        </h2>
        <div className="max-w-[720px] space-y-5 md:space-y-6">
          <p className={p}>
            DLD is typically diagnosed by a speech-language pathologist, also called an SLP or speech pathologist in some countries. An SLP looks at how a person understands and uses language across different tasks and contexts. Assessment may include standardized language tests, language samples, story retell tasks, vocabulary and grammar tasks, listening comprehension tasks, observation, case history, and information from parents, educators, or the person themselves.
          </p>
          <p className={p}>
            A strong DLD assessment does not only ask, "What score did this person get?" It also asks, "How does language affect daily life?" For a student, that might include following lessons, understanding classroom directions, joining conversations, reading, writing, and showing what they know. For an adult, it may include workplace communication, post-secondary learning, relationships, forms, appointments, and self-advocacy.
          </p>
          <p className={p}>
            DLD can often be identified in the preschool or early school years, but many people are missed. Some are told they have a language delay without anyone explaining that the difficulty may be persistent. Others have clear speech sounds or strong word reading, so their deeper language needs are overlooked.
          </p>
          <p className={p}>
            Diagnosis matters because it gives a name to the pattern. It can help families, educators, and the person with DLD understand that the difficulty is real, common, and supportable. For many families, the diagnosis is not the end of the story. It is the moment things finally start to make sense.
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

export default DiagnosisSection;
