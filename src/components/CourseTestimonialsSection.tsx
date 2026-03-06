import { Heart, Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily .M",
    quote: "\"After my child was diagnosed with DLD, I felt so overwhelmed and turned to a Facebook group for help. That's where I discovered Jinean's 'Communicate with Confidence' course. It was exactly what I needed! The course provided clarity, practical tools, and, most importantly, hope. Now, I feel more equipped and less alone on this journey. Jinean, your course was a beacon of light during a challenging time. Thank you!\"",
    attribution: "— Emily R., Grateful Mom from a Facebook Group",
    cardBg: "bg-[hsl(140_12%_72%)]",
  },
  {
    name: "Sarah .M",
    quote: "\"Before enrolling in 'Communicate with Confidence,' I felt lost and overwhelmed about my child's DLD. But this course was a game-changer! Jinean's compassionate approach, combined with practical activities and discussion questions, not only empowered me as a parent but also strengthened the bond with my child. Now, I feel equipped and confident to support my child's journey. Thank you, Jinean, for this life-changing experience!\"",
    attribution: "— Sarah M., Proud Mom of a 7-year-old with DLD",
    cardBg: "bg-[hsl(40_30%_92%)]",
  },
  {
    name: "Tiffany .B",
    quote: "\"Receiving speech therapy from Jinean was already transformative, but her 'Communicate with Confidence' course took things to another level. I've gained tools I didn't even know existed and have seen a noticeable shift in my child's progress. Truly, this course is the gift that keeps on giving.\"",
    attribution: "— Tiffany B., Dedicated Mom and Client",
    cardBg: "bg-[hsl(20_30%_85%)]",
  },
];

const tailColors: Record<string, string> = {
  "bg-[hsl(140_12%_72%)]": "hsl(140, 12%, 72%)",
  "bg-[hsl(40_30%_92%)]": "hsl(40, 30%, 92%)",
  "bg-[hsl(20_30%_85%)]": "hsl(20, 30%, 85%)",
};

const CourseTestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-lavender">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className={`${t.cardBg} rounded-2xl p-4 md:p-5`}>
              {/* Heart icon – top right */}
              <div className="flex justify-end -mt-1 mb-2">
                <div className="w-10 h-10 rounded-full bg-[hsl(350_60%_92%)] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                </div>
              </div>

              {/* White speech bubble */}
              <div className="relative bg-white rounded-xl p-6 pt-4 text-center">
                <h3 className="text-[20px] md:text-[22px] font-bold text-foreground mb-2">
                  {t.name}
                </h3>

                {/* Stars */}
                <div className="flex justify-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-[12px] md:text-[13px] text-muted-foreground leading-[1.7] mb-5">
                  {t.quote}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-foreground/10 mb-4" />

                <p className="text-[12px] md:text-[13px] text-foreground/70 leading-[1.5]">
                  {t.attribution}
                </p>

                {/* Speech bubble tail – bottom right */}
                <div
                  className="absolute -bottom-3 right-8 w-6 h-6 rotate-45 bg-white"
                />
              </div>

              {/* Cursive "Testimonial" script */}
              <p
                className="mt-2 ml-2 text-[28px] md:text-[32px] text-foreground/70"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                Testimonial
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTestimonialsSection;
