import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import img1 from "@/assets/resource-preview-1.png";
import img2 from "@/assets/resource-preview-2.png";
import img3 from "@/assets/resource-preview-3.png";
import img4 from "@/assets/resource-preview-4.png";
import img5 from "@/assets/resource-preview-5.png";
import img6 from "@/assets/resource-preview-6.png";
import img7 from "@/assets/resource-preview-7.png";

const columns = [
  [img1, img2],
  [img3, img4, img5],
  [img6, img7],
];

const ResourceLibraryCTA = () => {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left — Copy */}
          <div className="lg:w-[40%] text-center lg:text-left shrink-0">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] leading-tight mb-6">
              Access the Empowered DLD
              <br />
              Resource Library
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-4 max-w-md mx-auto lg:mx-0">
              Guides, posters, and tools to support children with DLD at home, in therapy, and in the classroom.
            </p>
            <p className="text-white/50 text-sm mb-8">
              All free. All in one place.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-base font-semibold"
            >
              <Link to="/hub/preview">Get Free Access</Link>
            </Button>
          </div>

          {/* Right — Masonry grid */}
          <div className="lg:w-[60%] relative">
            {/* Top/bottom gradient fades */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent z-10" />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className={`flex flex-col gap-3 md:gap-4 ${colIdx === 2 ? "hidden lg:flex" : ""} ${colIdx === 1 ? "mt-6" : ""}`}>
                  {col.map((src, imgIdx) => (
                    <div key={imgIdx} className="rounded-xl overflow-hidden">
                      <img
                        src={src}
                        alt="Resource preview"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceLibraryCTA;
