import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-deep-purple text-deep-purple-foreground pt-14 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <p className="font-sans text-lg font-bold mb-3">
              Empowered<span className="text-lavender">DLD</span>
            </p>
            <p className="text-sm text-primary-foreground/50 leading-relaxed">
              Empowering families, educators, and clinicians to support children with Developmental Language Disorder.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-sm mb-4 text-primary-foreground/70">Quick Links</p>
            <ul className="space-y-2">
              {["About DLD", "Resources", "Books", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p className="font-semibold text-sm mb-4 text-primary-foreground/70">Useful Links</p>
            <ul className="space-y-2">
              {["For Parents", "For Teachers", "For Clinicians", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-semibold text-sm mb-4 text-primary-foreground/70">Subscribe to our Newsletter</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="h-10 rounded-md bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 focus-visible:ring-primary-foreground/40 text-sm"
              />
              <Button
                variant="secondary"
                className="h-10 px-4 rounded-md font-semibold shrink-0 text-sm"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-primary-foreground/40 hover:text-primary-foreground transition-colors"
                aria-label={`Social media link`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="text-xs text-primary-foreground/40">© 2026 Empowered DLD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
