import { Link } from "react-router-dom";
import speakingImg from "@/assets/work-speaking.webp";
import workshopsImg from "@/assets/work-workshops.webp";
import consultationImg from "@/assets/work-consultation.webp";

const categories = [
{
  label: "SPEAKING ENGAGEMENTS",
  title: "Keynotes & Presentations",
  description:
  "Conference sessions, staff development, and parent nights that inspire action. Practical, engaging talks on DLD awareness and classroom strategies from real-world experience.",
  image: speakingImg,
  cta: "Pricing",
  href: "#contact"
},
{
  label: "CUSTOM WORKSHOPS",
  title: "Interactive Training",
  description:
  "Half-day or full-day sessions tailored to your team. Build practical skills your staff can use immediately in classrooms, therapy rooms, and beyond.",
  image: workshopsImg,
  cta: "Explore Workshops",
  href: "/for-organizations#partnership-packages"
},
{
  label: "CONSULTATION",
  title: "Personalized Support",
  description:
  "Ongoing guidance for schools, SLP teams, and organizations building DLD-friendly practices. Custom action plans, resource recommendations, and implementation support.",
  image: consultationImg,
  cta: "Schedule a Call",
  href: "#contact"
}];


const WorkWithUsBrowseSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-28">
      <div className="max-w-[1300px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            OUR SERVICES
          </p>
          <h2 className="text-[28px] md:text-[36px] lg:text-[42px] font-black text-foreground leading-[1.1] mb-3">Choose Your Path Forward

          </h2>
          <p className="text-[15px] md:text-[16px] text-muted-foreground leading-relaxed max-w-[600px]">
            Whether you need a keynote speaker, staff training, or ongoing consultation, we're here to support your team.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) =>
          <div key={cat.label} className="flex flex-col bg-muted rounded-xl border border-border/40 overflow-hidden pb-8">
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover"
                loading="lazy" />
              
              </div>

              {/* Text */}
              <div className="px-6 pt-5 flex flex-col flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {cat.label}
                </p>
                <h3 className="text-[20px] md:text-[22px] font-bold text-foreground leading-tight mb-2">
                  {cat.title}
                </h3>
                <p className="text-[14px] md:text-[15px] text-muted-foreground leading-relaxed mb-6 flex-1">
                  {cat.description}
                </p>

                {/* CTA */}
                <a
                href={cat.href}
                className="inline-flex items-center justify-center h-11 px-7 bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] rounded-md hover:opacity-90 transition-opacity duration-200 w-fit mt-auto">
                
                  {cat.cta}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default WorkWithUsBrowseSection;