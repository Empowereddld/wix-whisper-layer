import { ArrowRight, Headphones, MessageCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
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
        <section className="bg-lavender py-14 md:py-20">
          <div className="container px-6 md:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div className="mx-auto w-full max-w-[520px] lg:mx-0">
                <img
                  src={COVER_ARTWORK_URL}
                  alt="What Is DLD? song cover by Empowered DLD"
                  width={1080}
                  height={1080}
                  className="aspect-square w-full rounded-lg object-cover shadow-elevated"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              <div className="max-w-[590px]">
                <p className="mb-4 text-sm font-bold uppercase text-primary">Music from Empowered DLD</p>
                <h1 className="mb-4 text-[42px] font-black leading-[1.05] text-foreground sm:text-[52px] lg:text-[66px]">
                  What Is DLD?
                </h1>
                <p className="mb-5 text-lg font-semibold text-primary">Empowered DLD</p>
                <p className="mb-8 max-w-[540px] text-[17px] leading-[1.75] text-foreground/80 md:text-lg">
                  A child-friendly song created to help children understand DLD and learn what can help.
                </p>
                <Button asChild size="lg" className="min-h-[50px] px-7">
                  <a href={STREAMING_SMART_LINK} target="_blank" rel="noreferrer">
                    <Headphones className="mr-2 h-5 w-5" aria-hidden="true" />
                    Listen to the song
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-6 md:px-8">
            <div className="mx-auto max-w-[760px]">
              <p className="mb-3 text-sm font-bold uppercase text-primary">The story behind the song</p>
              <h2 className="mb-7 text-[30px] font-bold text-foreground md:text-[42px]">Why we made this song</h2>
              <p className="text-[17px] leading-[1.85] text-foreground/80 md:text-lg">
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
                <p className="text-[17px] leading-[1.75] text-foreground/80">
                  Listen together, then ask your child: What helps your brain when language feels hard?
                </p>
              </div>
              <div>
                <Share2 className="mb-5 h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Help someone learn about DLD</h2>
                <p className="text-[17px] leading-[1.75] text-foreground/80">
                  Share <em>What Is DLD?</em> with a teacher, family member, friend, or someone who works with children.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-6 md:px-8">
            <div className="mx-auto max-w-[900px] text-center">
              <h2 className="mb-8 text-[30px] font-bold text-foreground md:text-[42px]">Explore more from Empowered DLD</h2>
              <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="min-h-[50px]">
                  <Link to="/shop/books">Meet Dan &amp; Daria in the books <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-[50px]">
                  <Link to="/hub">Find free DLD resources for families <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-deep-purple py-14 text-deep-purple-foreground md:py-16">
          <div className="container px-6 text-center md:px-8">
            <p className="mb-2 text-sm font-bold uppercase text-deep-purple-foreground/70">Empowered DLD music</p>
            <h2 className="text-2xl font-bold text-deep-purple-foreground md:text-3xl">More music is on the way.</h2>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Music;