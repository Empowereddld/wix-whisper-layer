import blobPurple1 from "@/assets/blob-purple-1.webp";
import blobPink1 from "@/assets/blob-pink-1.webp";
import blobPurple2 from "@/assets/blob-purple-2.webp";
import blobCoral1 from "@/assets/blob-coral-1.webp";
import blobPink2 from "@/assets/blob-pink-2.webp";
import blobMagenta1 from "@/assets/blob-magenta-1.webp";

const facts = [
  {
    icon: blobPurple1,
    title: "1 in 14 People Have DLD",
    description:
      "You're already serving families affected by DLD - they just haven't been identified yet. In a community of 1,000 people, 75 have DLD.",
  },
  {
    icon: blobPink1,
    title: "6x Higher Mental Health Risk",
    description:
      "Unidentified DLD contributes to anxiety, depression, and social isolation throughout childhood and adulthood.",
  },
  {
    icon: blobPurple2,
    title: "Systemically Overlooked",
    description:
      "Girls, multilingual learners, and racialized individuals are least likely to receive DLD identification and support.",
  },
  {
    icon: blobCoral1,
    title: "Social Isolation",
    description:
      "Children with DLD may have fewer friendships and may struggle with peer relationships, leading to loneliness and withdrawal.",
  },
  {
    icon: blobPink2,
    title: "Increased School Dropout Risk",
    description:
      "Students with unsupported DLD are more likely to disengage from education and leave school without completing their programs.",
  },
  {
    icon: blobMagenta1,
    title: "Lower Employment Outcomes",
    description:
      "Adults with unidentified DLD face barriers to education and career advancement, limiting their economic opportunities.",
  },
];

const RealityOfDLDSection = () => {
  return (
    <section className="py-14 md:py-20">
      <div className="container px-6 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[30px] md:text-[46px] font-black text-foreground mb-3 leading-[1.1]">
            The Reality of DLD
          </h2>
          <p className="text-muted-foreground text-[14px] md:text-[16px] leading-[1.7] max-w-[520px] mx-auto">
            DLD affects 1 in 14 people, but it's still widely misunderstood. Here's the reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-[900px] mx-auto">
          {facts.map((fact) => (
            <div key={fact.title} className="flex flex-col items-center text-center">
              <img
                src={fact.icon}
                alt=""
                className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain mb-5 rounded-full"
                loading="lazy"
              />
              <h3 className="text-[16px] md:text-[18px] font-bold text-foreground mb-2 leading-[1.25]">
                {fact.title}
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealityOfDLDSection;
