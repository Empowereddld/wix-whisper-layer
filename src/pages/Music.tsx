import { Headphones, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackStreamingClick } from "@/lib/streaming-clicks";
import whatIsDld from "@/assets/song-what-is-dld.webp";
import wordsStuck from "@/assets/song-when-words-get-stuck.webp";
import askNeed from "@/assets/song-ask-for-what-i-need.webp";
import whyCreated from "@/assets/music-why-we-created.webp";

const songs = [
  {
    title: "What Is DLD?",
    image: whatIsDld,
    href: "https://release.landr.com/what-is-dld",
    description:
      "DLD affects approximately 1 in 14 people, yet many have never heard of it. This song introduces DLD in a fun, memorable way and helps listeners understand how it can affect everyday life.",
  },
  {
    title: "When Words Get Stuck",
    image: wordsStuck,
    href: "https://release.landr.com/when-words-get-stuck",
    description:
      "Sometimes you know what you want to say, but you can't find the words. This song explores word-finding difficulties and encourages patience, understanding, and supportive communication.",
  },
  {
    title: "Ask For What I Need",
    image: askNeed,
    href: "https://release.landr.com/ask-for-what-i-need",
    description:
      "Everyone deserves to feel comfortable asking for support. This song encourages self-advocacy and reminds listeners that asking for help is an important part of learning and communicating.",
  },
];

const p = "text-[15px] md:text-[16px] leading-[1.8] text-foreground/80";

const Music = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Music | Living Life with DLD Through Music | Empowered DLD"
      description="Listen to What Is DLD?, When Words Get Stuck, and Ask For What I Need, songs from Empowered DLD that help people understand Developmental Language Disorder."
      path="/music"
      breadcrumbs={[{ name: "Home", path: "/" }, { name: "Music", path: "/music" }]}
    />
    <Header />
    <main>
      <section className="bg-deep-purple py-20 md:py-28 lg:py-32">
        <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">Our Music</p>
          <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-white leading-[1.1] max-w-[800px]">
            Living Life with DLD Through Music
          </h1>
          <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7] max-w-[620px]">
            Our songs help people understand Developmental Language Disorder (DLD), one song at a time.
          </p>
        </div>
      </section>

      <section id="songs" className="py-20 md:py-[120px]">
        <div className="container px-6 md:px-8">
          <h2 className="mb-12 text-[28px] md:text-[36px] font-bold text-foreground leading-[1.15]">Listen to Our Music</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {songs.map((s) => (
              <article key={s.title} className="flex flex-col rounded-lg border border-border bg-secondary/40 overflow-hidden shadow-sm">
                <img src={s.image} alt={`${s.title} song cover by Empowered DLD`} width={900} height={900} loading="lazy" className="w-full aspect-square object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-3 text-[18px] font-bold text-foreground">{s.title}</h3>
                  <p className="mb-6 flex-1 text-[14px] leading-[1.7] text-foreground/75">{s.description}</p>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackStreamingClick("music-page")}
                    className="inline-flex w-fit items-center gap-2 min-h-[44px] px-6 bg-foreground text-background text-[13px] font-semibold rounded-md hover:bg-foreground/85 transition-all"
                  >
                    <Headphones className="w-4 h-4" aria-hidden="true" /> Listen Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-[120px]">
        <div className="container px-6 md:px-8 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <img src={whyCreated} alt="Girl listening to music on headphones in her bedroom" width={900} height={1125} loading="lazy" className="w-full max-h-[500px] object-cover object-center rounded-xl" />
          <div className="space-y-5">
            <h2 className="text-[28px] md:text-[36px] font-bold text-foreground leading-[1.15]">Why We Created Our Music</h2>
            <p className={p}>As a speech-language pathologist and an educator, we know how much understanding matters for people living with DLD.</p>
            <p className={p}>We hear from parents who wish more people understood their children's experiences. We also know that families, educators, and communities need accessible ways to learn about DLD.</p>
            <p className={p}>That's what inspired us to create music!</p>
            <p className={p}>Each song explores a different aspect of living with DLD, from word-finding challenges to self-advocacy. We're especially excited to collaborate with adults with DLD, whose voices and lived experiences are helping shape this project.</p>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-[120px]">
        <div className="container px-6 md:px-8 mx-auto max-w-[760px] text-center space-y-5">
          <h2 className="text-[28px] md:text-[36px] font-bold text-foreground leading-[1.15]">Ways to Use Our Music</h2>
          <p className={p}>Our songs are free to listen to and share! They can help start meaningful conversations about DLD at home, in classrooms, during speech-language therapy, and at awareness events.</p>
          <p className={p}>Try listening together and talking about the experiences described in each song. These conversations can help build understanding, encourage self-advocacy, and explore ways to support people with DLD.</p>
        </div>
      </section>

      <section className="bg-muted py-20 md:py-[100px]">
        <div className="container px-6 md:px-8 mx-auto max-w-[760px] text-center space-y-5">
          <h2 className="text-[28px] md:text-[36px] font-bold text-foreground leading-[1.15]">Our Music Around the World</h2>
          <p className={p}>We've been so encouraged to hear about our music reaching communities around the world!</p>
          <p className={p}>Our song <em>What Is DLD?</em> was used to open and close a DLD awareness event in Brisbane, Australia. Our music has also been shared in schools in the UK and Wales, and we've heard about children singing our songs across at least three continents.</p>
          <p className={p}>It's exciting to see music helping more people learn about DLD!</p>
        </div>
      </section>

      <section className="bg-deep-purple py-20 md:py-[100px]">
        <div className="container px-6 md:px-8 mx-auto max-w-[760px] text-center flex flex-col items-center gap-5">
          <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-[1.15]">Help Us Create More Music</h2>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-white/80">We're continuing to develop new songs and love collaborating with adults with DLD who want to share their voices and experiences.</p>
          <p className="text-[15px] md:text-[16px] leading-[1.8] text-white/80">If you're an adult with DLD who would like to be involved, we'd love to hear from you!</p>
          <a href="mailto:hello@empowereddld.com" className="inline-flex items-center gap-2 min-h-[44px] px-8 bg-white text-deep-purple text-[13px] font-bold rounded-md hover:bg-white/90 transition-all mt-2">
            <Mail className="w-4 h-4" aria-hidden="true" /> Get Involved
          </a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Music;
