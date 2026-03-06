import workshopBg from "@/assets/workshop-bg.png";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

const EducatorsDLDAwarenessCTA = () => {
  const fade = useScrollFadeIn();

  return (
    <section className="py-10 md:py-14 lg:py-20 bg-muted">
      <div className="container px-6 md:px-8">
        <div
          ref={fade.ref}
          className={`relative overflow-hidden rounded-2xl ${fade.className}`}
        >
          <img
            src={workshopBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 px-8 md:px-16 py-14 md:py-20 text-center">
            <h2 className="text-[24px] md:text-[32px] lg:text-[40px] font-black text-white leading-[1.12] mb-4 max-w-[700px] mx-auto">
              Do you want to bring DLD awareness and support to your school?
            </h2>
            <p className="text-white/70 text-[14px] md:text-[16px] leading-[1.7] mb-8 max-w-[500px] mx-auto">
              Download our free school information packet to learn how Empowered DLD can transform your approach to language support.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 bg-primary text-primary-foreground text-[11px] md:text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.12em] rounded-sm hover:bg-primary/90 transition-colors duration-200"
            >
              Get the Info Packet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducatorsDLDAwarenessCTA;
