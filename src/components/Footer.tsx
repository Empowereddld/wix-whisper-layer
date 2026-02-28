import { Mail } from "lucide-react";
import logoWhite from "@/assets/empowered-logo-white.png";

const FacebookFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const WhatsAppFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-deep-purple text-deep-purple-foreground pt-14 pb-10">
      <div className="container">
        {/* Row 1 – 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10 mb-14">
          {/* Brand */}
          <div>
            <img src={logoWhite} alt="EmpoweredDLD logo" className="h-12 mb-5" />
            <p className="text-[13px] text-primary-foreground/50 leading-relaxed">
              Supporting 4,000+ families and professionals with evidence-based resources, multilingual materials, and community connection for children with Developmental Language Disorder.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-bold text-base mb-4 text-primary-foreground">Quick Links</p>
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
            <p className="font-bold text-base mb-4 text-primary-foreground">Useful Links</p>
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
            <p className="font-bold text-base mb-4 text-primary-foreground">Contact</p>
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
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[
              { Icon: FacebookFilled, label: "Facebook" },
              { Icon: WhatsAppFilled, label: "WhatsApp" },
              { Icon: InstagramFilled, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="w-8 h-8" />
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <p className="font-serif italic text-lg text-primary-foreground/90">Subscribe to Our Newsletter</p>
            <input
              type="email"
              placeholder="Email"
              className="h-10 w-full lg:w-[420px] bg-transparent border border-primary-foreground/30 rounded-sm px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 transition-colors"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Name"
                className="h-10 flex-1 bg-transparent border border-primary-foreground/30 rounded-sm px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 transition-colors"
              />
              <button className="h-10 px-6 border border-primary-foreground/50 bg-transparent text-primary-foreground text-[12px] font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-primary-foreground/10 transition-colors duration-200 shrink-0">
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
