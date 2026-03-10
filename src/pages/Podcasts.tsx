import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import { Button } from "@/components/ui/button";
import podcastHeroImg from "@/assets/podcast-hero.webp";
import ep12Img from "@/assets/podcast-ep12.png";
import ep6Img from "@/assets/podcast-ep6.webp";
import ep9Img from "@/assets/podcast-ep9.webp";

const episodes = [
  {
    number: "Episode 12",
    title: "What is DLD Anyways??",
    description:
      "Dan and Daria explain DLD in their own words. Perfect for anyone who wants to understand what it's really like.",
    image: ep12Img,
    link: "#",
  },
  {
    number: "Episode 6",
    title: "I Know It's a Mess..I Just Don't Know Where to Start",
    description:
      "Dan and Daria talk about the frustration of not knowing how to get started on tasks. Every teacher should watch this.",
    image: ep6Img,
    link: "#",
  },
  {
    number: "Episode 9",
    title: "You Want to Join In but...",
    description:
      "Dan, Daria, and Millen share what it feels like when the right words are just out of reach. Honest and eye-opening.",
    image: ep9Img,
    link: "#",
  },
];

const whyWatchPoints = [
  "Hear directly from children with DLD. No scripts. No adults speaking for them. Just real kids sharing what it's like.",
  "Short, accessible episodes. Each episode is just 2 to 3 minutes. Perfect for classroom discussions, therapy sessions, or family conversations.",
  "Built to spark dialogue. Every episode helps open up vulnerable topics to get kids sharing!",
];

const Podcasts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-6">
              {/* Gray card background */}
              <div className="bg-muted rounded-xl lg:rounded-2xl lg:w-[58%] lg:flex-shrink-0 py-10 md:py-14 lg:py-24 px-6 md:px-8 lg:px-16">
                <span className="inline-block bg-deep-purple text-deep-purple-foreground text-[12px] md:text-[14px] lg:text-[16px] font-bold uppercase tracking-[0.14em] px-6 md:px-8 py-2 md:py-2.5 rounded-sm mb-4 md:mb-6">
                  PODCAST
                </span>
                <h1 className="text-[30px] md:text-[36px] lg:text-[48px] font-black text-foreground leading-[1.12] mb-4 md:mb-5 max-w-[500px]">
                  Life with DLD: The Dan and Daria Podcast
                </h1>
                <p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-6 md:mb-8 max-w-[500px]">
                  Dan and Daria share real, honest conversations about living with DLD. Watch our short episodes that help children feel understood and give every adult in their corner a window into their world.
                </p>
                <a
                  href="#episodes"
                  className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-black text-white text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-black/85 transition-colors duration-200"
                >
                  Explore the Series
                </a>
              </div>

              {/* Image */}
              <div className="mt-4 lg:mt-0 lg:flex-1 rounded-xl overflow-hidden shadow-lg max-h-[260px] md:max-h-[380px] lg:max-h-none">
                <img
                  src={podcastHeroImg}
                  alt="Life with DLD - The Dan and Daria Podcast"
                  className="w-full h-full object-cover object-center aspect-[16/9] lg:aspect-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Episodes Section */}
        <section id="episodes" className="py-16 md:py-[120px]">
          <div className="flex flex-col gap-20 md:gap-28">
            {episodes.map((ep, i) => {
              const imageFirst = i % 2 === 0;
              return (
                <div
                  key={ep.number}
                  className={`flex flex-col ${imageFirst ? "lg:flex-row" : "lg:flex-row-reverse"} items-stretch ${!imageFirst ? "bg-muted" : ""}`}
                >
                  {/* Image */}
                  <div className="lg:w-[58%] flex-shrink-0">
                    <img
                      src={ep.image}
                      alt={ep.title}
                     className="w-full h-full object-cover aspect-[16/9] lg:aspect-auto"
                     loading="lazy"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 lg:py-16">
                    <p className="text-[13px] font-semibold text-foreground tracking-wide mb-3">
                      {ep.number}
                    </p>
                    <h3 className="text-[26px] md:text-[32px] font-black text-foreground leading-[1.15] mb-4">
                      {ep.title}
                    </h3>
                    <div className="w-12 h-[3px] bg-foreground/20 mb-5" />
                    <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[400px] mb-6">
                      {ep.description}
                    </p>
                    <div>
                      <a
                        href={ep.link}
                        className="inline-flex items-center justify-center h-12 px-8 bg-deep-purple text-deep-purple-foreground text-[13px] font-semibold rounded-sm hover:bg-deep-purple/90 transition-colors duration-200"
                      >
                        Watch Episode
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Watch Section */}
        <section className="py-12 md:py-16 bg-lavender">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10">
            <h2 className="text-[28px] md:text-[40px] font-black text-foreground leading-[1.15] mb-3">
              Why Watch?
            </h2>
            <p className="text-[15px] md:text-[16px] font-semibold text-foreground mb-10">
              Why Parents, SLPs, and Educators Love This Podcast
            </p>
            <ul className="flex flex-col gap-8 max-w-[750px]">
              {whyWatchPoints.map((point, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-2 w-2 h-2 rounded-full bg-foreground flex-shrink-0" />
                  <p className="text-[15px] md:text-[16px] text-foreground/80 leading-[1.75]">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ready to Watch CTA */}
        <section className="py-16 md:py-24 border-t border-border/30">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col items-center text-center gap-5">
            <h2 className="text-[28px] md:text-[40px] font-black text-foreground leading-[1.15]">
              Ready to Watch?
            </h2>
            <p className="text-[15px] md:text-[16px] text-muted-foreground">
              All episodes are free on YouTube.
            </p>
            <Button className="h-12 px-8 rounded-sm text-[14px] font-semibold bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90 mt-2">
              Go to YouTube Channel
            </Button>
          </div>
        </section>

        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
