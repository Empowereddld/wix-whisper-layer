import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const bullets = [
  "Speech-Language Pathologist with 15+ years of experience",
  "Certified educator and classroom teacher",
  "Published author of children's books about DLD",
  "Trusted by families and professionals across the country",
];

const TrustSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Created by an SLP and Teacher Who Understands
            </h2>
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
              Every resource on Empowered DLD is created with deep expertise and genuine care for children with Developmental Language Disorder.
            </p>
            <ul className="space-y-3 mb-8">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground text-base leading-[1.7]">{b}</span>
                </li>
              ))}
            </ul>
            <Button className="h-12 px-6 rounded-md text-base font-semibold hover:brightness-90 transition-all">
              Learn More About Us
            </Button>
          </div>

          {/* Founder image */}
          <div>
            <div className="bg-secondary rounded-xl overflow-hidden shadow-md h-[360px] lg:h-[440px]">
              <img
                src="/placeholder.svg"
                alt="Founder of Empowered DLD"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
