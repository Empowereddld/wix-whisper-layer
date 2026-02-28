import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import logoWhite from "@/assets/empowered-logo-white.png";

const Footer = () => {
  return (
    <footer className="bg-deep-purple text-deep-purple-foreground pt-14 pb-10">
      <div className="container">
        {/* Row 1 – 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <img src={logoWhite} alt="EmpoweredDLD logo" className="h-12 mb-4" />
            <p className="text-[13px] text-primary-foreground/50 leading-relaxed">
              Supporting 4,000+ families and professionals with evidence-based resources, multilingual materials, and community connection for children with Developmental Language Disorder.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-bold text-[13px] uppercase tracking-[0.1em] mb-4 text-primary-foreground/70">Quick Links</p>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p className="font-bold text-[13px] uppercase tracking-[0.1em] mb-4 text-primary-foreground/70">Useful Links</p>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms & Conditions", "Disclaimer", "Support"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-bold text-[13px] uppercase tracking-[0.1em] mb-4 text-primary-foreground/70">Contact</p>
            <a
              href="mailto:hello@empowereddldparenting.com"
              className="inline-flex items-center gap-2 text-[13px] text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200"
            >
              <Mail className="w-4 h-4 shrink-0" />
              hello@empowereddldparenting.com
            </a>
          </div>
        </div>

        {/* Row 2 – Social icons (left) + Newsletter (right) */}
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Social icons */}
          <div className="flex items-center gap-5">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: MessageCircle, label: "WhatsApp" },
              { Icon: Instagram, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="w-8 h-8" strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto">
            <p className="font-serif italic text-lg text-primary-foreground/90">Subscribe to Our Newsletter</p>
            <div className="flex flex-col gap-3 w-full lg:w-72">
              <input
                type="email"
                placeholder="Email"
                className="h-10 w-full bg-transparent border border-primary-foreground/30 rounded-sm px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 transition-colors"
              />
              <input
                type="text"
                placeholder="Name"
                className="h-10 w-full bg-transparent border border-primary-foreground/30 rounded-sm px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 transition-colors"
              />
              <button className="h-10 w-full border border-primary-foreground/50 bg-transparent text-primary-foreground text-[12px] font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-primary-foreground/10 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
