import { Heart, Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily .M",
    quote: "\"After my child was diagnosed with DLD, I felt so overwhelmed and turned to a Facebook group for help. That's where I discovered Jinean's 'Communicate with Confidence' course. It was exactly what I needed! The course provided clarity, practical tools, and, most importantly, hope. Now, I feel more equipped and less alone on this journey. Jinean, your course was a beacon of light during a challenging time. Thank you!\"",
    attribution: "— Emily R., Grateful Mom from a Facebook Group",
    bg: "bg-[hsl(40_30%_94%)]",
  },
  {
    name: "Sarah .M",
    quote: "\"Before enrolling in 'Communicate with Confidence,' I felt lost and overwhelmed about my child's DLD. But this course was a game-changer! Jinean's compassionate approach, combined with practical activities and discussion questions, not only empowered me as a parent but also strengthened the bond with my child. Now, I feel equipped and confident to support my child's journey. Thank you, Jinean, for this life-changing experience!\"",
    attribution: "— Sarah M., Proud Mom of a 7-year-old with DLD",
    bg: "bg-[hsl(30_20%_92%)]",
  },
  {
    name: "Tiffany .B",
    quote: "\"Receiving speech therapy from Jinean was already transformative, but her 'Communicate with Confidence' course took things to another level. I've gained tools I didn't even know existed and have seen a noticeable shift in my child's progress. Truly, this course is the gift that keeps on giving.\"",
    attribution: "— Tiffany B., Dedicated Mom and Client",
    bg: "bg-[hsl(20_15%_93%)]",
  },
];

const CourseTestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1100px] mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="relative">
              {/* Heart icon */}
              <div className="flex justify-center -mb-4 relative z-10">
                <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
              </div>

              {/* Card */}
              <div className={`${t.bg} rounded-xl p-6 pt-8 text-center relative`}>
                {/* Speech bubble tail effect */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 ${t.bg}" />

                <h3 className="text-[18px] md:text-[20px] font-bold text-foreground mb-2">
                  {t.name}
                </h3>

                {/* Stars */}
                <div className="flex justify-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-[12px] md:text-[13px] text-muted-foreground leading-[1.7] mb-4">
                  {t.quote}
                </p>

                <p className="text-[11px] md:text-[12px] text-foreground/60 leading-[1.5]">
                  {t.attribution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTestimonialsSection;
