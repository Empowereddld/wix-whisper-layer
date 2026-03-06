import testimonialEmily from "@/assets/testimonial-emily.png";
import testimonialSarah from "@/assets/testimonial-sarah.png";
import testimonialTiffany from "@/assets/testimonial-tiffany.png";

const testimonials = [
  { src: testimonialEmily, alt: "Testimonial from Emily M., Grateful Mom from a Facebook Group" },
  { src: testimonialSarah, alt: "Testimonial from Sarah M., Proud Mom of a 7-year-old with DLD" },
  { src: testimonialTiffany, alt: "Testimonial from Tiffany B., Dedicated Mom and Client" },
];

const CourseTestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
          {testimonials.map((t) => (
            <div key={t.alt} className="aspect-square">
              <img
                src={t.src}
                alt={t.alt}
                className="w-full h-full object-contain rounded-xl"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTestimonialsSection;
