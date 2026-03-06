import Header from "@/components/Header";
import FreeCourseHero from "@/components/FreeCourseHero";
import WhatYoullLearnSection from "@/components/WhatYoullLearnSection";
import CreatedByExpertsSection from "@/components/CreatedByExpertsSection";
import CourseTestimonialsSection from "@/components/CourseTestimonialsSection";
import ChoosePathCTA from "@/components/ChoosePathCTA";
import Footer from "@/components/Footer";

const FreeCourse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <FreeCourseHero />
        <WhatYoullLearnSection />
        <CreatedByExpertsSection />
        <CourseTestimonialsSection />
        {/* Self-Paced Band */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container px-6 md:px-8 text-center">
            <h2 className="text-[24px] md:text-[32px] lg:text-[38px] font-black text-foreground leading-[1.15]">
              Self-Paced. Free. Always Available.
            </h2>
          </div>
        </section>
        <ChoosePathCTA />
      </main>
      <Footer />
    </div>
  );
};

export default FreeCourse;
