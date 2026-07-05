const bulletClass = "text-[16px] md:text-[17px] text-foreground/85 leading-[1.8]";

const earlyChildhood = [
  "Starting to talk later than expected",
  "Using fewer words than peers",
  "Having trouble learning new words",
  "Using short or simple sentences",
  "Leaving out grammar markers, such as past tense or plurals",
  "Having difficulty understanding questions",
  "Struggling to follow directions, especially when there is more than one step",
  "Becoming frustrated when they cannot explain what they mean",
];

const schoolAge = [
  "Trouble following classroom instructions",
  "Difficulty retelling stories in order",
  "Trouble explaining ideas clearly",
  "Word-finding difficulties, such as knowing the idea but not finding the word",
  "Grammar errors that continue past the age expected",
  "Difficulty understanding jokes, figurative language, or implied meaning",
  "Weak reading comprehension, even when word reading looks stronger",
  "Short written responses or difficulty organizing written work",
  "Avoiding speaking, asking for help, or participating in group work",
];

const teensAdults = [
  "Difficulty following fast conversations, lectures, or meetings",
  "Needing extra time to process spoken information",
  "Trouble putting thoughts into words under pressure",
  "Difficulty understanding dense reading material",
  "Trouble writing emails, reports, assignments, or explanations clearly",
  "Misunderstandings in friendships, school, post-secondary settings, or work",
  "Feeling anxious, embarrassed, or exhausted by heavy language demands",
];

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-6 space-y-2">
    {items.map((item) => (
      <li key={item} className={bulletClass}>{item}</li>
    ))}
  </ul>
);

const SignsAndSymptomsSection = () => {
  return (
    <section className="py-16 md:py-[80px] bg-muted">
      <div className="container px-6 md:px-8">
        <h2 className="font-sans font-bold text-[28px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-tight text-foreground max-w-[720px] mb-8 md:mb-10">
          What are the signs and symptoms of DLD?
        </h2>
        <div className="max-w-[720px] space-y-6 md:space-y-8">
          <p className={bulletClass}>
            DLD symptoms can look different across ages, languages, and settings. Some people mainly have difficulty understanding language. Others mainly have difficulty using language to express ideas. Many people have both. DLD can also affect reading comprehension, writing, learning, confidence, and participation.
          </p>

          <div>
            <h3 className="font-sans font-bold text-[20px] md:text-[22px] text-foreground mb-4">In early childhood, signs of DLD may include:</h3>
            <List items={earlyChildhood} />
          </div>

          <div>
            <h3 className="font-sans font-bold text-[20px] md:text-[22px] text-foreground mb-4">In school-age years, signs may include:</h3>
            <List items={schoolAge} />
          </div>

          <div>
            <h3 className="font-sans font-bold text-[20px] md:text-[22px] text-foreground mb-4">In teens and adults, signs may include:</h3>
            <List items={teensAdults} />
          </div>

          <p className={bulletClass}>
            Because DLD is hidden, it can be mistaken for inattention, behaviour, low motivation, or lack of confidence. A student may look like they are not listening when the real issue is that the instructions were too long or too fast. A teen may seem quiet while organizing their thoughts. An adult may avoid a meeting, form, or phone call because the language demand is high and the support is low.
          </p>
          <p className={bulletClass}>
            The behaviour we see is often only the surface. When adults look beneath the surface, they often discover that the issue is not willingness. The issue is language demand.
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Sources:{" "}
            <a href="https://radld.org/about/dld/" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">RADLD</a>,{" "}
            <a href="https://www.nidcd.nih.gov/health/developmental-language-disorder" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">NIDCD</a>,{" "}
            <a href="https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/" target="_blank" rel="noopener nofollow" className="underline hover:text-primary">ASHA</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignsAndSymptomsSection;
