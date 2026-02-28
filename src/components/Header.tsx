import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";

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
    <header className="sticky top-0 z-50 h-[68px] bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="container h-full flex items-center justify-between gap-4">
        <a href="/" className="text-[18px] text-foreground font-bold tracking-tight whitespace-nowrap">
          Empowered<span className="text-primary font-bold">DLD</span>
        </a>

        <nav className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[12px] font-semibold tracking-[0.02em] text-foreground/90 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}

          <button className="relative text-muted-foreground hover:text-foreground transition-colors" aria-label="Shopping cart">
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.6]" />
            <span className="absolute -top-2 -right-2 text-[10px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>

          <Button size="default" className="rounded-md h-10 px-6 text-[12px] font-semibold tracking-[0.08em]">
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
        <nav className="lg:hidden bg-background border-b border-border/30 px-5 pb-5 pt-2 flex flex-col gap-3 max-h-[75vh] overflow-y-auto">
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
          <Button className="w-full font-semibold text-[13px] tracking-[0.08em]">LOGIN</Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
