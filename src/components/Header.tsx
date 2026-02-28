import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import logoImage from "@/assets/empowered-logo.png";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT DLD", href: "#about" },
  { label: "RESOURCES", href: "#resources" },
  { label: "FOR PARENTS", href: "#resources" },
  { label: "ARTICLES", href: "#" },
  { label: "BOOKS", href: "#books" },
  { label: "CONTACT", href: "#contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[64px] bg-background/97 backdrop-blur-md border-b border-border/20 shadow-[0_1px_3px_hsl(0_0%_0%/0.04)]">
      <div className="container h-full flex items-center justify-between gap-4">
        <a href="/" className="flex-shrink-0">
          <img src={logoImage} alt="EmpoweredDLD" className="h-[28px] w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] font-semibold tracking-[0.04em] text-foreground/75 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}

          <button className="relative text-muted-foreground hover:text-foreground transition-colors duration-200 ml-1" aria-label="Shopping cart">
            <ShoppingBag className="w-[17px] h-[17px] stroke-[1.6]" />
            <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
              0
            </span>
          </button>

          <Button size="default" className="rounded-md h-9 px-5 text-[11px] font-bold tracking-[0.1em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 ml-1">
            LOGIN
          </Button>
        </nav>

        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-background border-b border-border/20 px-5 pb-5 pt-2 flex flex-col gap-3 max-h-[75vh] overflow-y-auto shadow-[var(--shadow-elevated)]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-semibold text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full font-bold text-[12px] tracking-[0.1em]">LOGIN</Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
