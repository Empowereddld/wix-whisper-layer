import { Button } from "@/components/ui/button";
import courseDevices from "@/assets/course-devices.png";

const FreeCourseHero = () => {
  return (
    <section className="pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md mb-6">
              <span className="text-[16px] md:text-[18px] font-bold uppercase tracking-[0.08em]">
                FREE COURSE
              </span>
            </div>

            <h1 className="text-[34px] md:text-[42px] lg:text-[48px] font-black text-foreground leading-[1.08] mb-5">
              Learn How to Support a Child With DLD
            </h1>

            <p className="text-[14px] md:text-[15px] text-muted-foreground leading-[1.75] mb-8 max-w-[500px]">
              Free video lessons for parents and educators. Practical strategies you can use immediately at home, in therapy, and in the classroom.
            </p>

            <a href="https://www.youtube.com/@EmpoweredDLD" target="_blank" rel="noopener noreferrer">
              <Button className="h-[50px] px-8 rounded-md text-[13px] font-bold uppercase tracking-[0.1em] bg-foreground text-background hover:bg-foreground/90">
                Watch Now
              </Button>
            </a>
          </div>

          {/* Right image */}
          <div className="flex items-center justify-center">
            <img
              src={courseDevices}
              alt="Free DLD course shown on multiple devices with YouTube"
              className="w-full max-w-[520px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeCourseHero;
