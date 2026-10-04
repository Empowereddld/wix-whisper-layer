import { ArrowRight, Headphones, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackStreamingClick } from "@/lib/streaming-clicks";
import coverArtwork from "@/assets/what-is-dld-cover.webp.asset.json";

const STREAMING_SMART_LINK = "https://release.landr.com/what-is-dld";
const COVER_ARTWORK_URL = import.meta.env.DEV
  ? new URL(coverArtwork.url, "https://id-preview--51a660d5-acfd-48f5-86f4-38b3ac526ca2.lovable.app").toString()
  : coverArtwork.url;

const Music = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="What Is DLD? | Music from Empowered DLD"
        description="Listen to What Is DLD?, a child-friendly song from Empowered DLD created to help children and families understand Developmental Language Disorder."
        path="/music"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Music", path: "/music" },
        ]}
      />
      <Header />

      <main>
        <section className="bg-deep-purple py-20 md:py-28 lg:py-32">
          <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-6">
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
              Music from Empowered DLD
            </p>
            <img
              src={COVER_ARTWORK_URL}
              alt="What Is DLD? song cover by Empowered DLD"
              width={1024}
              height={1024}
              className="w-full max-w-[320px] md:max-w-[360px] aspect-square rounded-lg object-cover shadow-elevated"
              loading="eager"
              fetchPriority="high"
            />
            <h1 className="text-[32px] md:text-[48px] lg:text-[56px] font-black text-white leading-[1.1] max-w-[800px]">
              What Is DLD?
            </h1>
            <p className="text-[14px] md:text-[16px] text-white/80 leading-[1.7] max-w-[620px]">
              A child-friendly song created to help children understand DLD  
and learn what can help.
            </p>
            <a
              href={STREAMING_SMART_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 bg-white text-deep-purple text-[13px] font-bold tracking-[0.04em] rounded-md hover:bg-white/90 transition-all duration-200 mt-2"
            >
              <Headphones className="w-4 h-4" aria-hidden="true" />
              Listen to the song
            </a>
          </div>
        </section>

        <section className="py-20 md:py-[120px]">
          <div className="container px-6 md:px-8">
            <div className="mx-auto max-w-[760px]">
              <p className="mb-3 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-primary">
                The story behind the song
              </p>
              <h2 className="mb-7 text-[28px] md:text-[40px] font-bold text-foreground leading-[1.15]">
                Why we made this song
              </h2>
              <p className="text-[16px] md:text-[17px] leading-[1.8] text-foreground/80">
                Children with DLD often grow up knowing that some things feel harder without always understanding why. We created <em>What Is DLD?</em> to give children simple language for understanding DLD, recognizing the supports that help them, and knowing that having DLD does not change the value of their ideas.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/40 py-16 md:py-20">
          <div className="container px-6 md:px-8">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <MessageCircle className="mb-5 h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Use it to start a conversation</h2>
                <p className="text-[16px] md:text-[17px] leading-[1.75] text-foreground/80">
                  Listen together, then ask your child: What helps your brain when language feels hard?
                </p>
              </div>
              <div>
                <Share2 className="mb-5 h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Help someone learn about DLD</h2>
                <p className="text-[16px] md:text-[17px] leading-[1.75] text-foreground/80">
                  Share <em>What Is DLD?</em> with a teacher, family member, friend, or someone who works with children.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-[120px]">
          <div className="container px-6 md:px-8">
            <div className="mx-auto max-w-[900px] text-center">
              <h2 className="mb-8 text-[28px] md:text-[40px] font-bold text-foreground leading-[1.15]">
                Explore more from Empowered DLD
              </h2>
              <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/shop/books"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground text-[13px] font-semibold tracking-[0.04em] rounded-md hover:bg-primary/90 transition-all duration-200"
                >
                  Meet Dan &amp; Daria in the books
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/hub"
                  className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-border bg-background text-foreground text-[13px] font-semibold tracking-[0.04em] rounded-md hover:bg-secondary/60 transition-all duration-200"
                >
                  Find free DLD resources for families
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-deep-purple py-16 md:py-20">
          <div className="container px-6 md:px-8 flex flex-col items-center text-center gap-3">
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.22em] text-white/60">
              Empowered DLD music
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">More music is on the way.</h2>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Music;
