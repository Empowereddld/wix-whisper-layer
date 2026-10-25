import { Link } from "react-router-dom";
import { ArrowLeft, MessagesSquare } from "lucide-react";
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
const UPDATED = "2026-10-25";
const ORG_ID = `${BASE_URL}/#organization`;

export const FAQS = [
  {
    question: "Should I tell my child they have DLD?",
    answer:
      "In general, helping children understand their DLD can support self-awareness and give them language to describe their experiences and ask for support. The way you introduce DLD should reflect your child's understanding, communication needs, and readiness. You can begin with a simple explanation and build on it over time. If you're unsure how to approach the conversation, your child's speech pathologist can help you find language that is appropriate for them.",
  },
  {
    question: "What age should I explain DLD to my child?",
    answer:
      "There is no single age that is right for every child. Younger children may begin by learning about specific experiences, such as finding words difficult or needing help remembering instructions. As children grow, they can develop a deeper understanding of DLD and how it affects their lives. The important thing is to use explanations they can understand and revisit the conversation as their questions and experiences change.",
  },
  {
    question: "How do I explain DLD in simple words?",
    answer:
      "You could say: \"DLD means that understanding and using language can be harder for you. You might need help with things like following instructions, finding words, or explaining your ideas. There are things we can do to make those easier.\" Adapt the explanation to reflect your child's experiences. You can also use pictures, gestures, stories, or examples from everyday life.",
  },
  {
    question: "What if my child doesn't want to talk about DLD?",
    answer:
      "Respect their feelings and give them time. Some children need opportunities to process new information before they're ready to discuss it. You can let them know you're available whenever they have questions, and continue providing support without making DLD the focus of every conversation. If your child consistently becomes distressed when the topic comes up, consider asking their speech pathologist or another trusted professional for guidance.",
  },
  {
    question: "Can books help children understand DLD?",
    answer:
      "Books can provide opportunities to explore experiences and emotions through characters rather than requiring children to talk directly about themselves. You can use a story to discuss what a character is experiencing, what support might help, or whether your child has ever experienced something similar. Our Living Life with DLD series was created with these kinds of conversations in mind.",
  },
  {
    question: "How can I help my child advocate for what they need?",
    answer:
      "Start by helping your child recognize which situations are difficult and what supports are useful. Then practise a few simple ways to communicate those needs, such as asking for more time, requesting a visual example, or asking someone to repeat an instruction. Children can communicate their needs in different ways, including speech, gestures, writing, pictures, and communication devices. It's equally important that adults recognize their responsibility to provide accessible communication and appropriate accommodations.",
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

const Quote = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <blockquote className={className}>
    <p>{children}</p>
  </blockquote>
);

const SituationCard = ({
  title,
  support,
  children,
}: {
  title: string;
  support: string;
  children: React.ReactNode;
}) => (
  <div className="my-7 md:my-8 rounded-2xl border border-border bg-card p-5 md:p-6">
    <h3 className="!mt-0 !mb-4">{title}</h3>
    <div className="rounded-xl bg-lavender p-4 md:p-5">
      <p className="!mb-2">
        <strong className="!text-primary">You might say:</strong>
      </p>
      <Quote className="!m-0 !bg-transparent !p-0 !pl-3">{children}</Quote>
    </div>
    <div className="mt-4 border-t border-border pt-4">
      <p className="!mb-0">
        <strong className="!text-primary">What you can do:</strong> {support}
      </p>
    </div>
  </div>
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
            <time dateTime={UPDATED}>October 25, 2026</time>
          </p>

          <div className="max-w-[700px] mx-auto blog-content mt-10 md:mt-12">
            <p>
              Maybe your child has recently been diagnosed with Developmental Language Disorder (DLD). Or perhaps
              you've known about their language difficulties for some time but haven't been sure how to explain
              them.
            </p>
            <p>
              You may have watched your child struggle to follow instructions, find the words they want to say, or
              explain an idea to someone who doesn't understand. You might be wondering how to help them make sense
              of these experiences without making them feel discouraged.
            </p>
            <p>
              Talking to your child about DLD is an opportunity to help them better understand themselves, recognize
              their strengths, and learn that support is available.
            </p>
            <p>
              You don't need to explain everything at once. What matters is beginning a conversation that can grow
              with your child.
            </p>
            <p>
              In this guide, we'll share ways to introduce DLD, examples of what you can say in everyday moments,
              and strategies for helping your child feel understood and supported.
            </p>

            <aside
              aria-labelledby="where-to-begin-heading"
              className="my-8 md:my-10 rounded-2xl border border-primary/20 bg-lavender p-5 md:p-7"
            >
              <div className="flex items-center gap-2.5">
                <MessagesSquare
                  size={18}
                  strokeWidth={1.4}
                  className="text-primary shrink-0"
                  aria-hidden="true"
                />
                <h2
                  id="where-to-begin-heading"
                  className="!mt-0 !pt-0 !border-0 !mb-0 !text-[22px] md:!text-[26px] !leading-tight"
                >
                  Not sure where to begin?
                </h2>
              </div>
              <p className="mt-3 md:mt-4 !mb-3 md:!mb-4">Here's one way to introduce DLD to your child:</p>
              <p className="!mb-3 md:!mb-4 rounded-xl border border-border/70 bg-background p-4 md:p-5 text-foreground font-medium">
                "There's a name for some of the language difficulties you've been having. It's called DLD. It means
                that understanding or using language can be harder sometimes. We can find ways to help together."
              </p>
              <p className="!mb-0">
                Start with this, pause, and give your child time to respond. Their questions and experiences can
                guide what comes next.
              </p>
            </aside>

            <h2>How to begin talking about DLD</h2>
            <p>If you're unsure where to begin, you might start with something like this:</p>
            <Quote>
              "There's a name for some of the language difficulties you've been having. It's called Developmental
              Language Disorder, or DLD. It means that understanding what people say or finding the words to explain
              your ideas can sometimes be harder. We can find ways to help together."
            </Quote>
            <p>
              For some children, this may be enough for a first conversation. Others may have questions or want to
              know more.
            </p>
            <p>
              Give your child time to think about what you've said. You can use pictures, examples, or simpler words
              if that helps. Your child may respond with questions, share an experience, or move on to something
              else.
            </p>
            <p>You can return to the conversation another day.</p>

            <h3>Start with what your child already notices</h3>
            <p>
              Children often recognize that certain things are difficult long before they understand why.
            </p>
            <p>
              Your child may have noticed that classmates seem to follow instructions more easily, that they
              sometimes struggle to explain what happened during the day, or that conversations with friends can be
              confusing.
            </p>
            <p>
              Rather than beginning with a detailed definition of DLD, try connecting the conversation to something
              familiar.
            </p>
            <p>You might ask:</p>
            <ul>
              <li>"Have you noticed that it's sometimes hard to remember all the instructions your teacher gives?"</li>
              <li>"Sometimes you know what you want to say, but it's hard to find the words. Does that happen to you?"</li>
              <li>"Is there anything at school that you wish was easier?"</li>
            </ul>
            <p>
              If your child finds these questions difficult to answer, that's okay. Questions about their thoughts,
              feelings, and experiences can require a lot of language.
            </p>
            <p>
              You can offer a specific example, give choices, or invite your child to show you what they mean.
            </p>
            <p>For example:</p>
            <Quote>
              "Is it harder when your teacher gives lots of instructions, or when you have to explain your ideas?"
            </Quote>
            <p>
              Remember, your child may notice things you haven't. Give them opportunities to share their
              perspective, even if it takes time.
            </p>

            <h2>A simple three-step approach to explaining DLD</h2>
            <p>Every child is different, but these three steps can help guide your first conversation.</p>

            <h3>1. Begin with a familiar experience</h3>
            <p>
              Choose something your child has experienced, particularly something you've already discussed together.
            </p>
            <p>For example:</p>
            <Quote>
              "I've noticed that when someone gives you lots of instructions at once, it can be hard to remember
              them all. Have you noticed that too?"
            </Quote>
            <p>
              Starting with something familiar helps connect the explanation to your child's everyday life.
            </p>

            <h3>2. Give the difficulty a name</h3>
            <p>When your child is ready, introduce DLD.</p>
            <Quote>
              "There's a name for the language difficulties you've been having. It's called Developmental Language
              Disorder, or DLD. It can make understanding and using language harder."
            </Quote>
            <p>
              You can explain that language is involved in many things we do, including listening, talking, reading,
              writing, learning, and connecting with other people.
            </p>
            <p>Not every child with DLD will find all these things difficult.</p>
            <p>
              <strong>Focus on what DLD means for your child.</strong>
            </p>

            <h3>3. Talk about what can help</h3>
            <p>Help your child understand that they don't have to manage these difficulties alone.</p>
            <Quote>
              "We can figure out what makes things easier. Maybe it helps when instructions are shorter, when
              someone shows you what to do, or when you have more time to think. We can work on those things
              together."
            </Quote>
            <p>This is an important part of the conversation.</p>
            <p>
              Your child is learning not only that they have DLD, but also that there are people, strategies, and
              supports that can help them.
            </p>

            <h2>What you can say in everyday moments</h2>
            <p>You don't have to wait for a special conversation to talk about DLD.</p>
            <p>
              Everyday experiences can offer opportunities to help children understand their language needs and
              discover what supports them.
            </p>
            <p>Here are some examples you can adapt for your child.</p>

            <SituationCard
              title="When following instructions is difficult"
              support="Break instructions into smaller steps. Use pictures or written reminders when helpful, and check in before adding more information."
            >
              "Sometimes it's hard to remember lots of instructions at once. That happens because understanding and
              remembering language can be tricky with DLD. We can ask for one step at a time, or write the steps down."
            </SituationCard>

            <SituationCard
              title="When your child can't find a word"
              support="Give your child time. Avoid immediately guessing every word or finishing their sentences unless they want that help. Encourage describing, drawing, gesturing, or using another way to communicate."
            >
              "Sometimes you know what you want to say, but you can't think of the word in the moment. You can tell me
              what it looks like, what it does, or show me what you mean. We can figure it out together."
            </SituationCard>

            <SituationCard
              title="When your child needs more time to respond"
              support="Pause after asking questions. Reduce the pressure to respond quickly, especially when your child is being asked to explain something complicated."
            >
              "Sometimes you need extra time to understand a question or think about your answer. That's okay. You can
              ask someone to give you more time."
            </SituationCard>

            <SituationCard
              title="When reading or writing is challenging"
              support="Work with your child's school team to understand which parts of reading and writing are difficult. Supports might include explicit teaching, visual organizers, extra time, or other accommodations based on your child's needs."
            >
              "Reading and writing use language too. That means they might be harder for you sometimes. It doesn't mean
              you aren't smart or that you aren't trying. We can find ways to help you learn."
            </SituationCard>

            <SituationCard
              title="When friendships or conversations feel confusing"
              support="Talk through specific situations without blaming your child. Help them understand unfamiliar expressions, practise joining conversations, and explore ways to handle misunderstandings."
            >
              "Sometimes it's hard to follow everything people say, especially when lots of people are talking. That
              can make conversations confusing. You can ask someone to explain, and we can practise ways to help."
            </SituationCard>

            <SituationCard
              title="When your child is learning to ask for help"
              support="Model these requests yourself. When possible, make sure your child's teachers and other important adults understand their communication needs too."
            >
              "You can tell people what helps you. Maybe you need them to slow down, explain something again, or show
              you what they mean. We can practise how to ask."
            </SituationCard>
            <p>
              These examples are starting points, not scripts your child needs to memorize. Use language that feels
              natural to your family and meaningful to your child.
            </p>

            <h2>What if your child asks difficult questions?</h2>
            <p>
              Some children have lots of questions when they begin learning about DLD. Others may ask very little at
              first, then return to the conversation weeks or months later.
            </p>
            <p>Certain questions can be especially difficult for parents to hear.</p>
            <p>You may want to think about how you'll respond before they come up.</p>

            <h3>"Does having DLD mean I'm stupid?"</h3>
            <p>Hearing your child question their intelligence can be heartbreaking.</p>
            <p>You might respond:</p>
            <Quote>
              "No. Having DLD doesn't tell us how smart you are. It means that understanding and using language can
              be harder for you. I know some things have been frustrating, and I want to help you find ways to make
              them easier."
            </Quote>
            <p>
              If your child has been calling themselves stupid, try to understand what has led them to feel that
              way.
            </p>
            <p>
              Did someone make an unkind comment? Are they comparing themselves with classmates? Have they been
              working hard at something without getting the support they need?
            </p>
            <p>Listening to their experiences matters as much as finding the right words to respond.</p>

            <h3>"Will I always have DLD?"</h3>
            <p>
              DLD is lifelong, but that doesn't mean your child's skills, experiences, and support needs will stay
              the same.
            </p>
            <p>You might say:</p>
            <Quote>
              "DLD is something you'll grow up with, but you can keep learning and developing new skills. Some
              things may become easier with practice and support. You'll also learn more about what helps you."
            </Quote>
            <p>Be honest without making predictions about exactly what your child will or won't be able to do.</p>
            <p>
              Children with DLD grow into teenagers and adults with their own personalities, interests, abilities,
              relationships, and goals.
            </p>
            <p>They may continue to need support in different areas, and that's important to acknowledge too.</p>

            <h3>"Why do I have DLD?"</h3>
            <p>You might say:</p>
            <Quote>
              "DLD happens because language develops differently. Researchers are still learning about why this
              happens. It's not something you caused, and it's not because you didn't try hard enough."
            </Quote>
            <p>Some children may find it helpful to know that other children and adults have DLD too.</p>
            <p>They are not alone in their experiences.</p>

            <h2>What if your child becomes upset?</h2>
            <p>
              Your child might feel relieved to have an explanation for something they've struggled with. They might
              feel sad, angry, embarrassed, worried, or confused.
            </p>
            <p>They may also have very little reaction.</p>
            <p>There is no single way children respond to learning about DLD.</p>
            <p>
              If your child becomes upset, try to make space for their feelings rather than rushing to reassure them
              that everything will be fine.
            </p>
            <p>You might say:</p>
            <Quote>"It sounds like this has been really frustrating."</Quote>
            <p>Or:</p>
            <Quote>"I can see you're upset. Do you want to talk about it, or would you rather take a break?"</Quote>
            <p>Your child may need time to process what you've shared.</p>
            <p>Let them know they can ask questions whenever they're ready.</p>
            <p>
              If your child is experiencing ongoing anxiety, sadness, low self-esteem, or difficulties that are
              affecting daily life, consider reaching out to their speech pathologist, school team, family doctor,
              or another qualified professional for additional support.
            </p>

            <h2>Help your child understand DLD while celebrating who they are</h2>
            <p>
              DLD can affect many parts of daily life, but it is not the whole story of who your child is.
            </p>
            <p>
              Your child has interests, relationships, preferences, abilities, and experiences that deserve just as
              much attention as their language difficulties.
            </p>
            <p>
              Perhaps they enjoy building things, drawing, playing sports, making people laugh, caring for animals,
              or learning everything they can about a favourite topic.
            </p>
            <p>Take time to notice these things together.</p>
            <p>You might say:</p>
            <Quote>"DLD is one part of you. It doesn't change all the things that make you who you are."</Quote>
            <p>
              It's also important to recognize that children with DLD can develop strengths in language-related
              areas. A child who finds explaining ideas difficult may still love storytelling. A child who struggles
              with reading may still enjoy books.
            </p>
            <p>
              We don't want children to feel that they must fit into a particular set of strengths or difficulties
              because they have DLD.
            </p>
            <p>
              <strong>
                Help your child recognize what they enjoy, what they're learning, what they find difficult, and what
                helps them succeed.
              </strong>
            </p>
            <p>All of these things can be part of understanding themselves.</p>

            <h2>Something we've learned from speech pathology and the classroom</h2>
            <p>
              As a speech pathologist and an educator, we think it's important to remember that a child's language
              difficulties are not always visible to the people around them.
            </p>
            <p>A child might nod when a teacher gives instructions, but still be unsure what to do.</p>
            <p>
              They might appear quiet during a group discussion because they're working hard to follow the
              conversation or organize their thoughts.
            </p>
            <p>
              They might tell their parents that school was "fine" because explaining everything that happened
              during the day requires more language and energy than they have available at that moment.
            </p>
            <p>
              From an adult's perspective, it can be easy to assume that a child understands because they're
              listening, or that they aren't interested because they aren't contributing.
            </p>
            <p>
              But what we see on the outside doesn't always tell us how much effort a child is putting into
              communication.
            </p>
            <p>
              <strong>This is one reason conversations about DLD matter so much.</strong>
            </p>
            <p>
              They can help children begin to understand their own experiences. They can also help adults recognize
              when a child needs support, even when the difficulty isn't obvious.
            </p>
            <p>
              Instead of asking only, "Do you understand?" we might ask a child to show us what they plan to do
              next, offer a visual example, or check whether there is another way we can explain something.
            </p>
            <p>Our goal is not simply to teach children to communicate their needs.</p>
            <p>It is also to help the adults around them become better communication partners.</p>

            <h2>Adjust the conversation as your child grows</h2>
            <p>
              Children's understanding of DLD will change with age, experience, and language development.
            </p>
            <p>
              Rather than following strict age rules, consider your child's interests, communication abilities, and
              what they already know about themselves.
            </p>

            <h3>Younger children</h3>
            <p>Keep explanations short and connected to familiar experiences.</p>
            <p>You might say:</p>
            <Quote>
              "Sometimes it's hard to remember all the words people say. That's one of the things DLD can make
              tricky."
            </Quote>
            <p>Use pictures, play, stories, or examples from everyday routines.</p>
            <p>Children don't need to understand every part of DLD to begin learning about it.</p>

            <h3>School-aged children</h3>
            <p>
              As children become more aware of differences between themselves and their peers, they may begin asking
              more questions.
            </p>
            <p>Talk about experiences at school, at home, and with friends.</p>
            <p>
              Help your child understand their specific language needs and introduce strategies they can use.
            </p>
            <p>
              For example, they might learn that written reminders help them remember instructions or that asking
              someone to explain a word can make a lesson easier to follow.
            </p>

            <h3>Older children and teenagers</h3>
            <p>
              Older children and teens may have questions about friendships, schoolwork, independence, or how DLD
              could affect their future.
            </p>
            <p>Invite them to take a more active role in conversations about their support.</p>
            <p>Ask what they find helpful and what they would like others to understand.</p>
            <p>
              Some teens may want to explain DLD to their teachers, friends, or classmates themselves. Others may
              prefer support from a parent, speech pathologist, or another trusted adult.
            </p>
            <p>
              Respect their preferences while making sure they can access the accommodations and support they need.
            </p>
            <p>Where appropriate, involve them in school support planning and meetings about their learning.</p>

            <h2>What if your family speaks more than one language?</h2>
            <p>
              If your family uses more than one language, you can talk about DLD in whichever language or
              combination of languages helps your child understand and express themselves best.
            </p>
            <p>
              <strong>Learning more than one language does not cause DLD.</strong>
            </p>
            <p>
              Children with DLD can grow up learning and using multiple languages, although they may experience
              language difficulties across the languages they use.
            </p>
            <p>You do not need to stop speaking your family's home language because your child has DLD.</p>
            <p>
              Using familiar languages can help children connect with family members, participate in their
              communities, and develop a sense of cultural identity.
            </p>
            <p>
              If your child is learning an additional language at school, it is important that educators and
              professionals consider their experience across languages when identifying language needs and planning
              support.
            </p>
            <p>
              Difficulties learning a new language should not automatically be mistaken for DLD, and genuine
              language difficulties should not be overlooked simply because a child is multilingual.
            </p>

            <h2>Teach self-advocacy alongside understanding</h2>
            <p>
              Understanding DLD is one part of the journey. Learning how to communicate support needs is another.
            </p>
            <p>
              Self-advocacy gives children opportunities to explain what helps them learn, participate, and
              communicate.
            </p>
            <p>You can begin by teaching a few useful phrases:</p>
            <ul>
              <li>"Can you say that another way?"</li>
              <li>"Can you show me?"</li>
              <li>"I need more time."</li>
              <li>"Can you give me one step at a time?"</li>
              <li>"I don't understand that word."</li>
              <li>"Can I write it down?"</li>
            </ul>
            <p>Start with phrases that are meaningful to your child.</p>
            <p>
              Practise them during calm, familiar situations rather than expecting your child to remember them for
              the first time when they're frustrated or overwhelmed.
            </p>
            <p>
              Some children may use gestures, pictures, communication devices, or other methods to express their
              needs. These are important forms of self-advocacy too.
            </p>
            <p>Celebrate their efforts to communicate, whether or not the wording is perfect.</p>

            <h3>Children should not have to advocate for every accommodation</h3>
            <p>
              As children develop self-advocacy skills, the adults around them also have a responsibility to make
              communication more accessible.
            </p>
            <p>Parents, teachers, coaches, family members, and other adults can help by:</p>
            <ul>
              <li>Giving clear, manageable instructions.</li>
              <li>Providing visual supports and written reminders.</li>
              <li>Allowing additional time to process information and respond.</li>
              <li>Explaining unfamiliar vocabulary.</li>
              <li>Checking understanding without putting children on the spot.</li>
              <li>Recognizing when communication demands may be overwhelming.</li>
            </ul>
            <p>
              Children should have opportunities to develop independence, but they shouldn't have to manage every
              communication challenge alone.
            </p>
            <p>
              <strong>Self-advocacy and supportive environments work together.</strong>
            </p>

            <h2>Keep the conversation going</h2>
            <p>You don't need to schedule a formal discussion every time you want to talk about DLD.</p>
            <p>Sometimes the most meaningful conversations happen during everyday life.</p>
            <p>
              Your child might mention that they had trouble understanding a lesson, struggled to explain something
              to a friend, or discovered a strategy that helped.
            </p>
            <p>These moments can open the door to a brief conversation.</p>
            <p>You might ask:</p>
            <Quote>"What do you think made that difficult?"</Quote>
            <p>Or:</p>
            <Quote>"What do you think might help next time?"</Quote>
            <p>If your child doesn't want to talk, respect that too.</p>
            <p>
              You can also revisit DLD when your child changes schools, begins a new activity, meets a new teacher,
              or starts thinking about their future.
            </p>
            <p>As they grow, they may understand their DLD in new ways.</p>
            <p>Keep listening, keep learning together, and make room for their perspective.</p>

            <h2>Stories can make conversations about DLD easier</h2>
            <p>Sometimes it's easier to talk about someone else's experiences before talking about our own.</p>
            <p>
              A child may feel uncomfortable discussing a difficult day at school, but be happy to talk about a
              character who experiences something similar.
            </p>
            <p>
              Stories give children opportunities to explore feelings, misunderstandings, friendships, and
              communication strategies in a way that feels less personal.
            </p>
            <p>They can also help children recognize that other people experience language difficulties too.</p>
            <p>
              This is one of the reasons we created our{" "}
              <Link to="/shop/books">Living Life with DLD book series</Link>.
            </p>

            <h3>Dan and the Paper Airplane</h3>
            <div className="not-prose my-8 md:mx-[calc((700px-940px)/2)] md:max-w-[940px] rounded-xl border border-border bg-secondary/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <img
                src={coverDan}
                alt="Dan and the Paper Airplane book cover"
                className="article-feature-img h-auto shadow-sm shrink-0"
                loading="lazy"
              />
              <div className="flex-1">
                <p className="m-0">
                  In <em>Dan and the Paper Airplane</em>, families meet a character navigating the experiences of
                  living with DLD. The story offers opportunities to talk about communication difficulties, emotions,
                  and strategies that can help.
                </p>
                <Link
                  to="/shop/books"
                  className="inline-flex items-center gap-1.5 mt-4 font-semibold text-primary hover:underline"
                >
                  Explore the Living Life with DLD book series
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <p>You might ask your child:</p>
            <ul>
              <li>"Have you ever felt like Dan?"</li>
              <li>"What do you think Dan was feeling?"</li>
              <li>"What helped Dan?"</li>
              <li>"What would you want someone to do if that happened to you?"</li>
            </ul>
            <p>Your child doesn't need to answer every question. Enjoying the story together is valuable too.</p>

            <h3>Discussing DLD with Your Child: A Guide for Parents</h3>
            <div className="not-prose my-8 md:mx-[calc((700px-940px)/2)] md:max-w-[940px] rounded-xl border border-border bg-secondary/40 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <img
                src={coverGuide}
                alt="Discussing DLD with Your Child parent guidebook cover"
                className="article-feature-img h-auto shadow-sm shrink-0"
                loading="lazy"
              />
              <p className="m-0 flex-1">
                For parents who would like more structured guidance, we created{" "}
                <em>Discussing DLD with Your Child</em>, a companion guidebook to our children's book series. The
                guidebook includes conversation prompts, activities, and practical ideas to help families explore
                DLD together.
              </p>
            </div>
            <p>
              It can be a helpful next step if you're looking for additional ways to support your child's
              understanding and build conversations over time.
            </p>

            <h3>Other ways to explore DLD together</h3>
            <p>
              Every child connects with information differently. Some enjoy books, others prefer listening to music,
              watching videos, or talking through real-life examples.
            </p>
            <p>You can also explore:</p>
            <ul>
              <li>
                <Link to="/music">Our "What Is DLD?" song</Link>: A musical introduction to DLD that families,
                educators, and people with DLD can use to start conversations.
              </li>
              <li>
                <Link to="/resources/podcasts">The Dan &amp; Daria Podcast</Link>: Short stories and conversations
                inspired by the <em>Living Life with DLD</em> series.
              </li>
              <li>
                <Link to="/resources">Our DLD resources</Link>: Practical tools for understanding language needs,
                supporting communication, and building self-advocacy.
              </li>
              <li>
                <Link to="/resources/language-impact-checklist">Our DLD Language Impact Checklist</Link>: A tool to
                help notice patterns in everyday communication and identify topics to discuss with your child's
                speech pathologist or school team.
              </li>
            </ul>
            <p>
              These resources can be used in different ways, depending on your child's age, interests, and
              communication needs.
            </p>

            <BlogFAQAccordion items={FAQS} />

            <h2>One conversation at a time</h2>
            <p>
              Explaining DLD to your child isn't about finding the perfect words or covering everything in a single
              conversation.
            </p>
            <p>
              It's about helping them make sense of their experiences, understand their strengths and needs, and
              recognize that support is available.
            </p>
            <p>Some conversations may be brief. Others may bring up questions you haven't considered before.</p>
            <p>
              Your child may understand their DLD differently as they grow, and you may learn new things about their
              experiences along the way.
            </p>
            <p>Keep listening. Keep making space for their questions. Keep helping them discover what supports them.</p>
            <p>
              <strong>
                Your child deserves to understand their DLD, to have their communication needs recognized, and to
                know that they don't have to navigate those challenges alone.
              </strong>
            </p>

            <div className="blog-sources">
              <h2>Sources and further reading</h2>
              <p>
                This article draws on established research and clinical guidance about Developmental Language
                Disorder and language support.
              </p>
              <ul>
                <li>
                  Bishop, D. V. M., Snowling, M. J., Thompson, P. A., Greenhalgh, T., and the CATALISE-2 Consortium
                  (2017). Phase 2 of CATALISE: A multinational and multidisciplinary Delphi consensus study of
                  problems with language development: Terminology.{" "}
                  <em>Journal of Child Psychology and Psychiatry, 58</em>(10), 1068 to 1080.{" "}
                  <a href="https://doi.org/10.1111/jcpp.12721" target="_blank" rel="noopener noreferrer">
                    doi.org/10.1111/jcpp.12721
                  </a>
                </li>
                <li>
                  American Speech-Language-Hearing Association (ASHA). Spoken Language Disorders, Practice Portal.{" "}
                  <a
                    href="https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    asha.org
                  </a>
                </li>
                <li>
                  National Institute on Deafness and Other Communication Disorders (NIDCD). Developmental Language
                  Disorder.{" "}
                  <a
                    href="https://www.nidcd.nih.gov/health/developmental-language-disorder"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    nidcd.nih.gov
                  </a>
                </li>
                <li>
                  RADLD (Raising Awareness of Developmental Language Disorder). Information and resources about DLD.{" "}
                  <a href="https://radld.org/" target="_blank" rel="noopener noreferrer">
                    radld.org
                  </a>
                </li>
              </ul>
              <p>
                <em>
                  This article provides general information and practical ideas. A speech pathologist who knows your
                  child can help you adapt these conversations and supports to their individual needs.
                </em>
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
    <Footer />
  </div>
);

export default HowToExplainDLD;
