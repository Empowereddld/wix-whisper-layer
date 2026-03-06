import { Check } from "lucide-react";
import courseWatching from "@/assets/course-watching.jpg";

const learnings = [
  {
    title: "Understand DLD in Real Life",
    description: "Learn how DLD shows up in everyday moments like following directions, participating in conversations, and explaining ideas.",
  },
  {
    title: "Use Practical Strategies Immediately",
    description: "Get concrete tools like how to give directions that stick, support word-finding, and reduce communication frustration.",
  },
  {
    title: "Build Your Child's Confidence",
    description: "Help children recognize their strengths, ask for help when they need it, and participate more confidently.",
  },
  {
    title: "Support Multiple Contexts",
    description: "Strategies that work at home, in the classroom, and during therapy sessions.",
  },
];

const WhatYoullLearnSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            What You'll Learn
          </h2>
            WHAT YOU'LL LEARN
          </h2>
          <p className="text-[14px] md:text-[15px] text-muted-foreground">
            Everything You Need to Support Communication With Confidence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center max-w-[1000px] mx-auto">
          {/* Image */}
          <div className="rounded-xl overflow-hidden">
            <img
              src={courseWatching}
              alt="Two people watching the DLD course on a laptop"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* Checklist */}
          <div className="space-y-6">
            {learnings.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <Check className="text-muted-foreground mt-1 w-5 h-5 shrink-0" strokeWidth={2.5} />
                <div>
                  <h3 className="text-[14px] md:text-[15px] font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.65]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYoullLearnSection;
