import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import { Button } from "@/components/ui/button";
import podcastHeroImg from "@/assets/resource-podcast.png";
import ep12Img from "@/assets/podcast-ep12.png";
import ep6Img from "@/assets/podcast-ep6.png";
import ep9Img from "@/assets/podcast-ep9.png";

const episodes = [
  {
    number: "Episode 12",
    title: "What is DLD Anyways??",
    description:
      "Dan and Daria explain DLD in their own words. Perfect for anyone who wants to understand what it's like.",
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
        <section>
          {/* Purple banner */}
          <div className="bg-deep-purple py-8 md:py-10">
            <div className="max-w-[1100px] mx-auto px-6 md:px-10">
              <h1 className="text-[28px] md:text-[40px] font-black text-white tracking-wide">
                PODCAST
              </h1>
            </div>
          </div>

          {/* Hero content */}
          <div className="bg-muted">
            <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-16 md:py-20 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Left text */}
              <div className="flex-1 flex flex-col gap-6">
                <h2 className="text-[30px] md:text-[42px] font-black text-foreground leading-[1.12]">
                  Life with DLD: The Dan and Daria Podcast
                </h2>
                <p className="text-[15px] md:text-[16px] text-muted-foreground leading-[1.75] max-w-[500px]">
                  Dan and Daria share real, honest conversations about living with DLD. Watch our short episodes that help children feel understood and give every adult in their corner a window into their world.
                </p>
                <div>
                  <Button className="h-12 px-8 rounded-sm text-[14px] font-semibold bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90">
                    Explore the Series
                  </Button>
                </div>
              </div>

              {/* Right image */}
              <div className="flex-1 max-w-[520px]">
                <img
                  src={podcastHeroImg}
                  alt="Life with DLD Podcast"
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Episodes Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col gap-20 md:gap-28">
            {episodes.map((ep, i) => {
              const imageFirst = i % 2 === 0;
              return (
                <div
                  key={ep.number}
                  className={`flex flex-col ${imageFirst ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 lg:gap-16 items-center`}
                >
                  {/* Image */}
                  <div className="flex-1 w-full">
                    <img
                      src={ep.image}
                      alt={ep.title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 flex flex-col gap-4">
                    <p className="text-[13px] font-semibold text-foreground tracking-wide">
                      {ep.number}
                    </p>
                    <h3 className="text-[26px] md:text-[32px] font-black text-foreground leading-[1.15]">
                      {ep.title}
                    </h3>
                    <div className="w-12 h-[3px] bg-foreground/20 my-1" />
                    <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] max-w-[450px]">
                      {ep.description}
                    </p>
                    <div className="mt-2">
                      <Button className="h-12 px-8 rounded-sm text-[14px] font-semibold bg-deep-purple text-deep-purple-foreground hover:bg-deep-purple/90">
                        Watch Episode
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Watch Section */}
        <section className="py-16 md:py-24 border-t border-border/30">
          <div className="max-w-[1100px] mx-auto px-6 md:px-10">
            <h2 className="text-[28px] md:text-[40px] font-black text-foreground leading-[1.15] mb-3">
              WHY WATCH?
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
