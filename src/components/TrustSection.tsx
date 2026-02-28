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
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-foreground mb-4">
              Created by an SLP and Teacher Who Understands
            </h2>
            <p className="text-muted-foreground text-base mb-7 leading-[1.7]">
              Every resource on Empowered DLD is created with deep expertise and genuine care for children with Developmental Language Disorder.
            </p>
            <ul className="space-y-3.5 mb-9">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground text-base leading-[1.7]">{b}</span>
                </li>
              ))}
            </ul>
            <Button className="h-12 px-7 rounded-lg text-base font-medium hover:brightness-95 transition-all">
              Learn More About Us
            </Button>
          </div>

          {/* Founder image */}
          <div>
            <div className="bg-secondary rounded-2xl overflow-hidden shadow-sm h-[360px] lg:h-[440px]">
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
