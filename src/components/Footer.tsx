import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-deep-purple text-deep-purple-foreground pt-12 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-sans text-lg font-bold mb-3">
              Empowered<span className="text-lavender">DLD</span>
            </p>
            <p className="text-[13px] text-primary-foreground/45 leading-relaxed">
              Empowering families, educators, and clinicians to support children with Developmental Language Disorder.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-bold text-[12px] uppercase tracking-[0.1em] mb-4 text-primary-foreground/60">Quick Links</p>
            <ul className="space-y-1.5">
              {["HOME", "WHO WE SERVE", "RESOURCES", "SHOP", "WORK WITH US", "ABOUT DLD", "BLOG", "CONTACT"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-primary-foreground/45 hover:text-primary-foreground transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p className="font-bold text-[12px] uppercase tracking-[0.1em] mb-4 text-primary-foreground/60">Useful Links</p>
            <ul className="space-y-1.5">
              {["For Parents", "For SLPs", "For Educators and Schools", "For Organizations"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-primary-foreground/45 hover:text-primary-foreground transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-[12px] uppercase tracking-[0.1em] mb-4 text-primary-foreground/60">Contact</p>
            <ul className="space-y-1.5 text-[13px] text-primary-foreground/45">
              <li>info@empowereddld.com</li>
              <li>United States</li>
            </ul>
          </div>
        </div>

        {/* Newsletter row */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-[12px] text-primary-foreground/60 font-bold uppercase tracking-[0.1em] shrink-0">Subscribe to our Newsletter</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="Your email"
              className="h-9 rounded-md bg-primary-foreground/8 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/25 focus-visible:ring-primary-foreground/30 text-[13px]"
            />
            <Button
              variant="secondary"
              className="h-9 px-4 rounded-md font-bold shrink-0 text-[12px] tracking-[0.05em]"
            >
              Subscribe
            </Button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-primary-foreground/35 hover:text-primary-foreground transition-colors duration-200"
                aria-label={`Social media link`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
          <p className="text-[11px] text-primary-foreground/35">© 2026 Empowered DLD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
