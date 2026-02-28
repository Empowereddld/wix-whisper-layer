import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "About DLD", href: "#about" },
  { label: "Resources", href: "#resources" },
  { label: "Books", href: "#books" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[68px] bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="container h-full flex items-center justify-between">
        <a href="/" className="text-[18px] text-foreground font-bold tracking-tight">
          Empowered<span className="text-primary font-bold">DLD</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <ShoppingCart className="w-[18px] h-[18px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors stroke-[1.5]" />
          <Button size="default" className="rounded-lg h-9 px-5 text-[12px] font-semibold">
            Login
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-background border-b border-border/30 px-5 pb-5 pt-2 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full font-semibold text-[13px]">Login</Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
