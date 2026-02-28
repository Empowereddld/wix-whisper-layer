import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-deep-purple text-deep-purple-foreground pt-16 pb-12">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-xl font-bold mb-3">Empowered DLD</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Empowering families, educators, and clinicians to support children with Developmental Language Disorder.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-sm mb-4 uppercase tracking-wider text-white/80">Quick Links</p>
            <ul className="space-y-2">
              {["About DLD", "Resources", "Books", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="font-semibold text-sm mb-4 uppercase tracking-wider text-white/80">Resources</p>
            <ul className="space-y-2">
              {["For Parents", "For Teachers", "For Clinicians", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-semibold text-sm mb-4 uppercase tracking-wider text-white/80">Stay Updated</p>
            <p className="text-sm text-white/60 mb-3">Get the latest DLD resources delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="h-11 rounded-md bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/40"
              />
              <Button
                variant="secondary"
                className="h-11 px-5 rounded-md font-semibold shrink-0"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© 2026 Empowered DLD. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-white/50 hover:text-white transition-colors"
                aria-label={`Visit our ${Icon.displayName || "social media"} page`}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
