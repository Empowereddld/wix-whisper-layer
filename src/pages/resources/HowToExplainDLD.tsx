import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead, { BASE_URL } from "@/components/SEOHead";
import BlogFAQAccordion from "@/components/BlogFAQAccordion";
import coverDan from "@/assets/book-dan-paper-airplane.webp";
import coverGuide from "@/assets/book-parent-guidebook.webp";

const PATH = "/resources/how-to-explain-dld-to-your-child";
const TITLE = "How to Explain DLD to Your Child";
const DESCRIPTION =
  "Practical ways to explain Developmental Language Disorder to your child, with simple language, conversation examples, and ideas for building understanding and self-advocacy.";
const PUBLISHED = "2026-10-14";
const UPDATED = "2026-10-14";
const ORG_ID = `${BASE_URL}/#organization`;

export const FAQS = [
  {
    question: "Should I tell my child they have DLD?",
    answer:
      "Many children benefit from having a name for what they experience. Knowing about DLD can help a child make sense of why some things feel harder and begin learning how to ask for support. How you explain it should depend on your child's age, language, personality, and what they already understand.",
  },
  {
    question: "What age should I explain DLD to my child?",
    answer:
      "There is no set age. You can begin with simple, concrete language when your child starts noticing differences or asking questions, then add more detail as their understanding grows.",
  },
  {
    question: "How do I explain DLD in simple words?",
    answer:
      "One option is: \"Understanding and using words can take more work for your brain. That is called DLD. There are strategies and supports that can help.\" Adapt the explanation to what your child actually experiences.",
  },
  {
    question: "What if my child does not want to talk about DLD?",
    answer:
      "Respect that and leave the door open. You can return to the topic later. Talking while driving, drawing, playing, reading together, or discussing a character can sometimes feel less pressured than a direct face-to-face conversation.",
  },
  {
    question: "Can books help children understand DLD?",
    answer:
      "Books can give children and families characters and situations to talk about together. A child may find it easier to discuss what a character is experiencing before talking about their own experiences.",
  },
  {
    question: "How can I teach my child to advocate for what they need?",
    answer:
      "Start with a few short phrases such as \"Can you show me?\", \"Can you say that another way?\", or \"I need more time.\" Practise them in low-pressure situations and help your child notice when one of the phrases could be useful.",
  },
];

const AUTHORS = [
  {
    "@type": "Person",
    "@id": `${BASE_URL}/#jinean-whitley`,
    name: "Jinean Whitley",
    honorificSuffix: "M.Sc.A.",
    jobTitle: "Speech-Language Pathologist",
    worksFor: { "@id": ORG_ID },
  },
  {
    "@type": "Person",
    "@id": `${BASE_URL}/#camesha-russell`,
    name: "Camesha Russell",
    jobTitle: "Educator",
    worksFor: { "@id": ORG_ID },
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      url: `${BASE_URL}${PATH}`,
      mainEntityOfPage: `${BASE_URL}${PATH}`,
      image: `${BASE_URL}/og-empowered-dld.png`,
      datePublished: PUBLISHED,
      dateModified: UPDATED,
      inLanguage: "en",
      author: AUTHORS,
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Empowered DLD",
        url: BASE_URL,
        logo: { "@type": "ImageObject", url: `${BASE_URL}/favicon.png` },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

const Quote = ({ children }: { children: React.ReactNode }) => (
  <blockquote>
    <p>{children}</p>
  </blockquote>
);

const HowToExplainDLD = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title={`${TITLE} | Empowered DLD`}
      description={DESCRIPTION}
      path={PATH}
      type="article"
      jsonLd={jsonLd}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: TITLE, path: PATH },
      ]}
    />
    <Header />
    <main className="py-10 md:py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources
        </Link>

        <article>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            {TITLE}
          </h1>
          <p className="text-sm text-muted-foreground">
            Written by Jinean Whitley, M.Sc.A., Speech-Language Pathologist, and Camesha Russell, Educator
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Published <time dateTime={PUBLISHED}>October 14, 2026</time> · Updated{" "}
            <time dateTime={UPDATED}>October 14, 2026</time>
          </p>

          <div className="max-w-[700px] mx-auto blog-content mt-10 md:mt-12">
            <p>
              Maybe your child has just been diagnosed with Developmental Language Disorder. Maybe they have started
              saying things like "I'm not smart" or "Nobody listens to me." Either way, you may be wondering what to
              say, and how much.
            </p>
            <p>
              There is no perfect script. What matters is using honest, simple language and revisiting the
              conversation over time in a way that helps your child feel understood rather than defined by a
              diagnosis.
            </p>
            <aside className="my-8 rounded-xl border border-border bg-secondary/40 p-5 md:p-6 font-medium text-foreground">
              The goal is not to explain everything about DLD in one conversation. It is to help your child
              understand a little more about themselves, one conversation at a time.
            </aside>

            <h2>Start with what your child already notices</h2>
            <p>
              Children often know that some things feel harder long before anyone gives those experiences a name.
              They may notice when classmates follow directions faster, when a story gets stuck halfway, or when
              friends talk too quickly to keep up.
            </p>
            <p>Rather than starting with a definition, start with their experience. You might ask:</p>
            <Quote>"Have you noticed that sometimes it's tricky to find the words you want?"</Quote>
            <p>or</p>
            <Quote>"What feels hardest at school?"</Quote>
            <p>Listen first. Their answers can help you decide where to begin.</p>

            <h2>A simple way to explain DLD</h2>
            <p>Here is one possible example. It is not a script every family must use:</p>
            <Quote>
              "Everyone's brain works a little differently. Your brain is great at lots of things. Understanding and
              using language can take more work for your brain. That might mean understanding what someone says,
              finding the words you want, putting your ideas into sentences, or learning through language. That has a
              name. It's called Developmental Language Disorder, or DLD. Lots of other children have DLD too, and
              there are strategies and supports that can help."
            </Quote>
            <p>
              Keep the explanation short at first. Every child with DLD is different, so talk about what is true for
              your child rather than giving them a list of everything DLD can affect.
            </p>
            <p>
              DLD can affect understanding and using spoken language. It can also affect areas such as reading,
              writing, learning, and social communication, although every person with DLD has a different profile.
            </p>
            <p>
              DLD is lifelong. With understanding, appropriate support, and useful strategies, people with DLD
              continue to learn, grow, build relationships, develop strengths, and advocate for what they need.
            </p>

            <h2>Words you can actually use</h2>
            <h3>When instructions feel hard</h3>
            <Quote>
              "When someone gives lots of steps at once, your brain has to hold all of them. That can be a lot. It's
              okay to ask for one step at a time."
            </Quote>
            <h3>When the right word won't come</h3>
            <Quote>
              "Sometimes you know what you want to say, but the word is hard to find. You can describe it, point to
              it, draw it, or say, 'Give me a second.'"
            </Quote>
            <h3>When they need more time</h3>
            <Quote>
              "Sometimes your brain needs a little more time to work out the words or what someone has said. You're
              allowed to take your time before you answer."
            </Quote>
            <h3>When reading or writing feels hard</h3>
            <Quote>
              "Reading and writing use language too, so they may take extra effort. If they feel hard, that doesn't
              mean you aren't trying or aren't smart."
            </Quote>
            <h3>Talking about strengths</h3>
            <Quote>
              "DLD is only one part of you. You have lots of strengths too. Maybe you're a great builder, artist,
              helper, athlete, friend, or something completely different. And when words are hard, you can also draw,
              show, point, or act something out."
            </Quote>

            <h2>Adjust the conversation for your child</h2>
            <p>
              There are no strict age rules. Think about your child's language level, personality, experiences, and
              what they already understand.
            </p>
            <h3>Younger children</h3>
            <p>
              Keep explanations concrete and brief. Talk about experiences such as "Sometimes words get stuck" or
              "Sometimes it is hard to remember all the steps." Use pictures, play, stories, and examples from
              everyday life.
            </p>
            <h3>School-aged children</h3>
            <p>
              Connect DLD to real moments at school, at home, and with friends. Introduce the name DLD and begin
              teaching a few strategies they can use when something is difficult.
            </p>
            <h3>Older children and teens</h3>
            <p>
              Talk more openly about how DLD may affect learning, friendships, communication, and independence. Help
              them notice what makes things easier or harder, and involve them in decisions about their supports,
              including IEP meetings where appropriate.
            </p>

            <h2>Give DLD a name without making it their whole identity</h2>
            <p>
              For some children, having a name for what they experience can feel like a relief. It can help make
              sense of things that have felt confusing or unfair and give them words to ask for what they need. Others
              may need time before the name feels comfortable, and that is okay too.
            </p>
            <p>At the same time, DLD is only one part of who your child is.</p>
            <p>Talk about their interests, humour, personality, relationships, and strengths too.</p>
            <p>
              "You have DLD" can sit alongside "You're funny," "You're brave," "You love basketball," "You're
              creative," or "You're a great friend."
            </p>

            <h2>What if my child becomes upset?</h2>
            <p>
              Your child might feel sad, embarrassed, angry, worried, or may not want to talk about DLD at all. These
              reactions are understandable.
            </p>
            <ul>
              <li>Name what you notice: "It sounds like this feels frustrating."</li>
              <li>Do not rush to fix the feeling or insist that everything is fine.</li>
              <li>Let your child know they do not have to finish the conversation right now.</li>
              <li>Let them know they can ask questions or return to the topic later.</li>
              <li>Keep listening as their understanding changes over time.</li>
            </ul>
            <p>
              If worries persist or begin affecting daily life, your child's speech pathologist, school team, family
              doctor, or another trusted professional can help you think about what support may be needed.
            </p>

            <h2>Teach self-advocacy alongside understanding</h2>
            <p>
              Understanding DLD becomes more useful when children also learn what they can do when communication
              becomes difficult. Practise a few short phrases at home:
            </p>
            <ul>
              <li>"Can you say that another way?"</li>
              <li>"Can you show me?"</li>
              <li>"I need more time."</li>
              <li>"Can you give me one step at a time?"</li>
            </ul>
            <p>
              When your child tries one of these phrases, notice it and encourage them, even when the wording is not
              perfect.
            </p>

            <h2>Keep the conversation going</h2>
            <p>This is not one big conversation.</p>
            <p>
              You can return to DLD naturally after a difficult day at school, before a new activity, when a
              friendship becomes complicated, or as your child gets older and wants to understand more.
            </p>
            <p>Each conversation can add another piece to their understanding.</p>

            <h2>Stories can make the conversation easier</h2>
            <p>Sometimes it is easier to talk about a character than to talk directly about yourself.</p>
            <p>
              When children see characters finding words difficult, asking for help, navigating friendships, or
              learning ways to advocate for themselves, families can talk about those experiences without putting the
              child immediately in the spotlight.
            </p>
            <p>
              That is one reason we created the <Link to="/shop/books">Living Life with DLD book series</Link>.
            </p>
            <div className="not-prose my-6 flex gap-4 items-start">
              <img
                src={coverDan}
                alt="Dan and the Paper Airplane book cover"
                className="w-20 md:w-24 h-auto rounded-md shadow-sm shrink-0"
                loading="lazy"
              />
              <p className="m-0">
                <em>Dan and the Paper Airplane</em> gives families a story through which they can talk about
                communication challenges, strategies, and what it can feel like when words do not come easily.
              </p>
            </div>
            <div className="not-prose my-6 flex gap-4 items-start">
              <img
                src={coverGuide}
                alt="Discussing DLD with Your Child parent guidebook cover"
                className="w-20 md:w-24 h-auto rounded-md shadow-sm shrink-0"
                loading="lazy"
              />
              <p className="m-0">
                The companion parent guidebook, <em>Discussing DLD with Your Child</em>, offers conversation prompts,
                practical ideas, and activities to help families talk about DLD together.
              </p>
            </div>

            <h2>Other ways to continue the conversation</h2>
            <ul>
              <li>
                Watch or listen together to <Link to="/resources/podcasts">the Dan &amp; Daria podcast</Link>.
              </li>
              <li>
                Listen to <Link to="/music">our "What Is DLD?" song</Link> as another child-friendly way to introduce
                the topic.
              </li>
              <li>
                Explore more practical tools in our <Link to="/resources">DLD resources</Link>.
              </li>
              <li>
                Use <Link to="/resources/language-impact-checklist">the DLD Language Impact Checklist</Link> to
                notice patterns that may be helpful to discuss with your child's speech pathologist or school team.
              </li>
              <li>
                For a broader overview, read <Link to="/about-dld">what Developmental Language Disorder is</Link>.
              </li>
            </ul>

            <BlogFAQAccordion items={FAQS} />

            <div className="blog-sources">
              <h2>Sources and further reading</h2>
              <ul>
                <li>
                  Bishop, D. V. M., Snowling, M. J., Thompson, P. A., Greenhalgh, T., and the CATALISE-2 consortium
                  (2017). Phase 2 of CATALISE: a multinational and multidisciplinary Delphi consensus study of
                  problems with language development. <em>Journal of Child Psychology and Psychiatry, 58</em>(10),
                  1068 to 1080.{" "}
                  <a href="https://doi.org/10.1111/jcpp.12721" target="_blank" rel="noopener noreferrer">
                    doi.org/10.1111/jcpp.12721
                  </a>
                </li>
                <li>
                  RADLD (Raising Awareness of Developmental Language Disorder).{" "}
                  <a href="https://radld.org/" target="_blank" rel="noopener noreferrer">
                    radld.org
                  </a>
                </li>
                <li>
                  American Speech-Language-Hearing Association. Spoken Language Disorders (Practice Portal).{" "}
                  <a
                    href="https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    asha.org
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </main>
    <Footer />
  </div>
);

export default HowToExplainDLD;
