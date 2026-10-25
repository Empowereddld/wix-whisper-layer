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
    "question": "Should I tell my child they have DLD?",
    "answer": "Helping children understand their DLD can support self-awareness and give them language to describe their experiences and needs. Introduce the topic in a way that reflects your child's understanding and communication abilities."
  },
  {
    "question": "What if my child doesn't want to talk about DLD?",
    "answer": "Respect their feelings and give them time. Let them know you're available whenever they have questions. You can continue providing support without making DLD the focus of every conversation."
  },
  {
    "question": "How do I know if my child understands my explanation?",
    "answer": "Keep your explanation short and use familiar examples. Rather than relying only on \"Do you understand?\", invite your child to share what they're thinking through words, pictures, gestures, or another way that works for them. Their understanding can develop over time."
  },
  {
    "question": "Can books help children understand DLD?",
    "answer": "Books can help children explore communication difficulties and emotions through characters. They offer opportunities for conversation while allowing children to decide how much of their own experience they'd like to share."
  }
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

          <div className="max-w-[700px] mx-auto blog-content explain-dld-article mt-10 md:mt-12">
            <p>Maybe your child has recently been diagnosed with Developmental Language Disorder (DLD). Or perhaps you've known about their language difficulties for some time but haven't been sure how to explain them.</p>
            <p>You may have watched your child struggle to follow instructions, find the words they want to say, or explain an idea to someone who doesn't understand. You might be wondering how to help them make sense of these experiences without making them feel discouraged.</p>
            <p>Talking to your child about DLD is an opportunity to help them better understand themselves, recognize their strengths, and learn that support is available.</p>
            <p>You don't need to explain everything at once. What matters is beginning a conversation that can grow with your child.</p>
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
                "There's a name for some of the language difficulties you've been having. It's called Developmental Language Disorder, or DLD. It means that understanding what people say or finding the words to explain your ideas can sometimes be harder. We can find ways to help together."
              </p>
              <p className="!mb-0">
                Start with this, pause, and give your child time to respond. Their questions and experiences can
                guide what comes next.
              </p>
            </aside>
            <h2>Start with what your child already notices</h2>
            <p>Children often recognize that certain things are difficult long before they understand why.</p>
            <p>Your child might notice that classmates seem to follow instructions more easily, that explaining their ideas takes extra effort, or that conversations with friends can sometimes be confusing.</p>
            <p>Rather than beginning with a detailed definition of DLD, connect the conversation to something familiar.</p>
            <p>You might ask:</p>
            <ul><li>"Have you noticed that remembering lots of instructions can be hard sometimes?"</li><li>"Sometimes you know what you want to say, but it's hard to find the words. Does that happen to you?"</li><li>"Is there anything at school that you wish was easier?"</li></ul>
            <p>Questions about thoughts and experiences can be difficult for children with DLD to answer. Try offering choices, giving examples, or inviting your child to draw or show you what they mean.</p>
            <p><strong>Listen to what your child notices. Their experiences can help you decide where to begin.</strong></p>
            <h2>Three simple steps to explaining DLD</h2>
            <p>You can use these steps to guide the conversation, adapting the language to your child's needs.</p>
            <p><strong>1. Begin with something familiar.</strong></p>
            <p>"I've noticed that when someone gives you lots of instructions, it can be hard to remember them all. Have you noticed that too?"</p>
            <p><strong>2. Give the difficulty a name.</strong></p>
            <p>"That's something that can happen when you have DLD. It can make understanding and using language harder."</p>
            <p><strong>3. Talk about what can help.</strong></p>
            <p>"We can figure out what makes things easier. Maybe it helps when someone gives you one instruction at a time or shows you what to do."</p>
            <p>Keep your explanation short and focus on what is meaningful to your child.</p>
            <p>DLD can affect understanding and using spoken language. It can also affect reading, writing, learning, and social communication. However, every person with DLD has their own combination of strengths and challenges.</p>
            <p>Your child doesn't need to learn everything about DLD in one conversation.</p>
            <h2>What you can say in everyday moments</h2>
            <p>Everyday experiences can help children make connections between their DLD and the things they find difficult.</p>
            <p>Here are four examples you can adapt for your child.</p>
            <SituationCard title="When your child can't find a word" support="Give your child time. Encourage different ways to communicate, and avoid finishing their sentences unless they want that help.">"Sometimes you know what you want to say, but you can't think of the word in the moment. You can describe it, draw it, or show me what you mean."</SituationCard>
            <SituationCard title="When following instructions is difficult" support="Break instructions into smaller steps, use visual reminders, and allow extra time to process information.">"Sometimes remembering lots of instructions can be hard. It might help to hear one step at a time or see the steps written down."</SituationCard>
            <SituationCard title="When reading or writing is challenging" support="Work with your child's school team to understand their needs and identify appropriate teaching strategies and accommodations.">"Reading and writing use language too, so they might take more effort. That doesn't mean you aren't smart or aren't trying. We can find ways to help you learn."</SituationCard>
            <SituationCard title="When friendships or conversations feel confusing" support="Talk through specific situations, explain unfamiliar expressions, and help your child explore ways to handle misunderstandings.">"Sometimes it's hard to follow everything people say, especially when lots of people are talking. You can ask someone to explain, and we can practise ways to help."</SituationCard>
            <p>These are starting points, not scripts to memorize. Use words that feel natural to your family and reflect your child's experiences.</p>
            <h2>What if your child asks difficult questions?</h2>
            <p>Some children have lots of questions about DLD. Others may ask very little at first and return to the conversation later.</p>
            <p>Certain questions can be especially difficult for parents to hear.</p>
            <h3>"Does having DLD mean I'm stupid?"</h3>
            <p>You might respond:</p>
            <Quote>"No. Having DLD doesn't tell us how smart you are. It means that understanding and using language can be harder for you. I know some things have been frustrating, and I want to help you find ways to make them easier."</Quote>
            <p>If your child has been questioning their intelligence, try to understand what has contributed to those feelings.</p>
            <p>Have they been comparing themselves with classmates? Has someone made an unkind comment? Are they struggling with something despite working hard?</p>
            <p>Listening to their experiences matters as much as finding the right words to respond.</p>
            <h3>"Will I always have DLD?"</h3>
            <p>DLD is lifelong, but that doesn't mean your child's skills, experiences, and support needs will stay the same.</p>
            <p>You might say:</p>
            <Quote>"DLD is something you'll grow up with, but you can keep learning and developing new skills. Some things may become easier with practice and support. You'll also learn more about what helps you."</Quote>
            <p>Be honest without making predictions about exactly what your child will or won't be able to do.</p>
            <h3>What if my child becomes upset?</h3>
            <p>Your child might feel relieved to have an explanation, or they might feel sad, angry, embarrassed, or confused. They may also have very little reaction.</p>
            <p>Make space for their feelings rather than rushing to reassure them.</p>
            <p>You could say, "It sounds like this has been really frustrating," or, "Would you like to talk about it, or would you rather take a break?"</p>
            <p>Let your child know they can return to the conversation whenever they're ready.</p>
            <p>If worries or emotional difficulties persist and affect daily life, consider seeking additional support from your child's speech pathologist, school team, family doctor, or another qualified professional.</p>
            <section aria-labelledby="classroom-perspective-heading" className="my-10 rounded-2xl border border-primary/20 bg-lavender p-5 md:p-7"><h2 id="classroom-perspective-heading" className="!mt-0 !pt-0 !border-0">Something we've learned from speech pathology and the classroom</h2><p>As a speech pathologist and an educator, we know that children's language difficulties aren't always obvious to the people around them.</p><p>A child might nod when a teacher gives instructions but still be unsure what to do.</p><p>They might appear quiet during a group discussion because they're working hard to follow the conversation or organize their thoughts.</p><p>They might tell their parents that school was "fine" because explaining everything that happened during the day requires more language and energy than they have available.</p><p><strong>What we see on the outside doesn't always tell us how much effort a child is putting into communication.</strong></p><p>This is one reason conversations about DLD matter so much.</p><p>They can help children understand their experiences while helping adults recognize when support is needed, even when the difficulty isn't immediately visible.</p><p>Instead of simply asking, "Do you understand?" we can show children what we mean, break information into smaller steps, or invite them to demonstrate what they plan to do next.</p><p>Our goal isn't simply to teach children to communicate their needs. It's also to help the adults around them become better communication partners.</p></section>
            <h2>Help your child recognize their strengths and needs</h2>
            <p>DLD can affect many aspects of daily life, but it doesn't define everything about your child.</p>
            <p>Your child has interests, abilities, relationships, and experiences that deserve just as much attention as their language difficulties.</p>
            <p>Perhaps they love storytelling, building things, drawing, playing sports, making people laugh, or learning about a favourite topic.</p>
            <p>You might say:</p>
            <Quote>"DLD is one part of you. It doesn't change all the things that make you who you are."</Quote>
            <p>We also don't want children to feel they must fit into a particular set of strengths or difficulties because they have DLD.</p>
            <p>Help your child recognize what they enjoy, what they're learning, what they find challenging, and what helps them succeed.</p>
            <p>All of these things contribute to understanding themselves.</p>
            <h2>Adjust the conversation as your child grows</h2>
            <p>Children's understanding of DLD changes with age, experience, and language development. There are no strict rules about when or how much to explain.</p>
            <p><strong>Younger children:</strong> Keep explanations short and concrete. Use pictures, play, stories, and familiar examples.</p>
            <p><strong>School-aged children:</strong> Connect DLD to experiences at school, at home, and with friends. Help your child understand their needs and introduce strategies they can use.</p>
            <p><strong>Older children and teens:</strong> Talk more openly about learning, friendships, independence, and self-advocacy. Invite them to participate in decisions about their supports, including school planning meetings when appropriate.</p>
            <p>Some children and teens may want to explain DLD to others themselves. Others may prefer support from a parent or another trusted adult. Respect their preferences while ensuring their needs are understood.</p>
            <h3>What if your family speaks more than one language?</h3>
            <p>You can explain DLD in whichever language or combination of languages helps your child understand best.</p>
            <p><strong>Learning more than one language does not cause DLD.</strong> Children with DLD can continue learning and using multiple languages.</p>
            <p>You don't need to stop speaking your family's home language because your child has DLD.</p>
            <p>If your child is multilingual, it's important that educators and professionals consider their experiences across languages when understanding their communication needs.</p>
            <h2>Teach self-advocacy alongside understanding</h2>
            <p>Understanding DLD is one part of the journey. Learning how to communicate support needs is another.</p>
            <p>You can help your child practise phrases such as:</p>
            <ul><li>"Can you say that another way?"</li><li>"Can you show me?"</li><li>"I need more time."</li><li>"Can you give me one step at a time?"</li><li>"I don't understand that word."</li></ul>
            <p>Start with phrases that are meaningful to your child, and practise them during calm, familiar situations.</p>
            <p>Children can also advocate for themselves using gestures, pictures, writing, communication devices, or other ways of expressing their needs.</p>
            <p>Celebrate their efforts to communicate, even when the wording isn't perfect.</p>
            <h3>Children shouldn't have to advocate for every accommodation</h3>
            <p>Self-advocacy is important, but children shouldn't be responsible for making every communication environment accessible.</p>
            <p>Adults can help by giving clear instructions, providing visual supports, allowing additional processing time, explaining unfamiliar vocabulary, and checking understanding without putting children on the spot.</p>
            <p><strong>Self-advocacy and supportive environments work together.</strong></p>
            <p>Our responsibility is to help create environments where children can participate, learn, and communicate with confidence.</p>
            <h2>Stories can make conversations about DLD easier</h2>
            <p>Sometimes it's easier to talk about a character's experiences before talking about our own.</p>
            <p>Stories give children opportunities to explore feelings, misunderstandings, friendships, and communication strategies without putting them directly in the spotlight.</p>
            <p>This is one reason we created our <strong>Living Life with DLD</strong> children's book series.</p>
            <h3>Dan and the Paper Airplane</h3><div className="not-prose my-8 lg:mx-[calc((700px-940px)/2)] lg:max-w-[940px] rounded-xl border border-border bg-secondary/40 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"><img src={coverDan} alt="Dan and the Paper Airplane book cover" className="article-feature-img !w-full !max-w-[260px] lg:!w-[30%] lg:!max-w-none h-auto shadow-sm shrink-0" loading="lazy" /><div className="flex-1 min-w-0"><p><em>Dan and the Paper Airplane</em> gives families a story through which they can explore communication challenges, emotions, and helpful strategies.</p><p>You might ask your child, "Have you ever felt like Dan?" or "What do you think helped him?"</p><p>There's no pressure to answer every question. Simply enjoying the story together can be meaningful too.</p><Link to="/shop/books" className="inline-flex items-center gap-1.5 mt-4 font-semibold text-primary hover:underline">Explore the Living Life with DLD book series.</Link></div></div>
            <h3>Discussing DLD with Your Child: A Parent Guidebook</h3><div className="not-prose my-8 lg:mx-[calc((700px-940px)/2)] lg:max-w-[940px] rounded-xl border border-border bg-secondary/40 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10"><img src={coverGuide} alt="Discussing DLD with Your Child parent guidebook cover" className="article-feature-img !w-full !max-w-[260px] lg:!w-[30%] lg:!max-w-none h-auto shadow-sm shrink-0" loading="lazy" /><div className="flex-1 min-w-0"><p>For parents who would like more structured support, our companion guidebook, <em>Discussing DLD with Your Child</em>, offers conversation prompts, activities, and practical ideas to help families explore DLD together.</p><p>It's designed to support ongoing conversations as children develop a deeper understanding of themselves and their communication needs.</p><Link to="/shop/parent-guidebook" className="inline-flex items-center gap-1.5 mt-4 font-semibold text-primary hover:underline">Explore the parent guidebook | $9.99 USD</Link></div></div>
            <h3>Other ways to continue the conversation</h3>
            <p>Different children connect with information in different ways. You might also explore:</p>
            <ul><li><strong><Link to="/music">Our "What Is DLD?" song:</Link></strong> A musical way to introduce DLD and start conversations.</li><li><strong><Link to="/resources/podcasts">The Dan &amp; Daria Podcast:</Link></strong> Short stories that families can listen to together.</li><li><strong><Link to="/resources">Our free DLD resources:</Link></strong> Practical tools for understanding language needs and building self-advocacy.</li><li><strong><Link to="/resources/language-impact-checklist">Our DLD Language Impact Checklist:</Link></strong> A resource to help identify everyday communication challenges and topics to discuss with your child's school team or speech pathologist.</li></ul>
            <BlogFAQAccordion items={FAQS} />
            <h2>One conversation at a time</h2>
            <p>Explaining DLD to your child isn't about finding the perfect words or covering everything in one conversation.</p>
            <p>It's about helping them make sense of their experiences, understand their strengths and needs, and recognize that support is available.</p>
            <p>Some conversations may be brief. Others may bring up questions you haven't considered before.</p>
            <p>Keep listening, keep learning together, and make room for your child's perspective.</p>
            <p><strong>Your child deserves to understand their DLD, to have their communication needs recognized, and to know they don't have to navigate those challenges alone.</strong></p>
            <hr />
            <div className="blog-sources"><h2>Sources and further reading</h2><ul><li>Bishop, D. V. M., Snowling, M. J., Thompson, P. A., Greenhalgh, T., &amp; the CATALISE-2 Consortium (2017). Phase 2 of CATALISE: A multinational and multidisciplinary Delphi consensus study of problems with language development: Terminology. <em>Journal of Child Psychology and Psychiatry, 58</em>(10), 1068–1080. <a href="https://doi.org/10.1111/jcpp.12721" target="_blank" rel="noopener noreferrer">https://doi.org/10.1111/jcpp.12721</a></li><li>American Speech-Language-Hearing Association (ASHA). Spoken Language Disorders, Practice Portal. <a href="https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/" target="_blank" rel="noopener noreferrer">https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/</a></li><li>National Institute on Deafness and Other Communication Disorders (NIDCD). Developmental Language Disorder. <a href="https://www.nidcd.nih.gov/health/developmental-language-disorder" target="_blank" rel="noopener noreferrer">https://www.nidcd.nih.gov/health/developmental-language-disorder</a></li><li>RADLD (Raising Awareness of Developmental Language Disorder). <a href="https://radld.org/" target="_blank" rel="noopener noreferrer">https://radld.org/</a></li></ul><p><em>This article provides general information and practical guidance. A speech pathologist who knows your child can help you adapt these conversations and supports to their individual needs.</em></p></div>
          </div>
        </article>
      </div>
    </main>
    <Footer />
  </div>
);

export default HowToExplainDLD;
