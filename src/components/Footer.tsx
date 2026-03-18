import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logoWhite from "@/assets/empowered-logo-white.webp";

const FacebookFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const YouTubeFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramFilled = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about-dld" },
  { label: "Resources", to: "/resources" },
  { label: "Contact Us", to: "/contact" },
];

const usefulLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Disclaimer", to: "/disclaimer" },
  { label: "Support", to: "/contact" },
];

const socialLinks = [
  { Icon: FacebookFilled, label: "Facebook", href: "https://www.facebook.com/share/g/1GCdxhWtfB/" },
  { Icon: YouTubeFilled, label: "YouTube", href: "https://www.youtube.com/@EmpoweredDLDParenting" },
  { Icon: InstagramFilled, label: "Instagram", href: "https://www.instagram.com/empowered.dld.parenting" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("waitlist")
      .insert({ name: name.trim(), email: email.trim(), notes: "footer newsletter" });

    setIsSubmitting(false);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } else {
      toast({ title: "You're on the list!", description: "Thanks for subscribing." });
      setEmail("");
      setName("");
    }
  };

  return (
    <footer className="bg-deep-purple text-deep-purple-foreground pt-12 md:pt-14 pb-10">
      <div className="container px-6 md:px-8">
        {/* Row 1 – 4-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 sm:gap-10 mb-8 items-start">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="h-12 mb-5 overflow-y-hidden overflow-x-visible">
              <img src={logoWhite} alt="EmpoweredDLD logo" className="h-48 -mt-[4.35rem] ml-0" style={{ objectFit: 'contain', objectPosition: 'left' }} loading="lazy" />
            </div>
            <p className="text-[13px] text-primary-foreground/50 leading-relaxed">
              Supporting 4,000+ families and professionals with evidence-based resources, multilingual materials, and community connection for children with Developmental Language Disorder.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-bold text-base mb-4 text-primary-foreground">Quick Links</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[13px] text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p className="font-bold text-base mb-4 text-primary-foreground">Useful Links</p>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[13px] text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
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
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8">
          {/* Social icons */}
          <div className="flex items-center justify-center lg:justify-start gap-4">
            {socialLinks.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-200"
                aria-label={label}
              >
                <Icon className="w-8 h-8" />
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4 w-full lg:w-auto">
            <p className="font-serif italic text-lg text-primary-foreground/90">Subscribe to Our Newsletter</p>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full lg:w-[420px] xl:w-[500px] bg-transparent border border-primary-foreground/30 rounded-sm px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 transition-colors"
            />
            <div className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 flex-1 bg-transparent border border-primary-foreground/30 rounded-sm px-3 text-[13px] text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/60 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 border border-primary-foreground/50 bg-transparent text-primary-foreground text-[12px] font-bold uppercase tracking-[0.15em] rounded-sm hover:bg-primary-foreground/10 transition-colors duration-200 shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
