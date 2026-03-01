import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import logoImage from "@/assets/empowered-logo.png";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "WHO WE SERVE", href: "#who-we-serve" },
  { label: "RESOURSES", href: "#resources" },
  { label: "SHOP", href: "#shop" },
  { label: "WORK WITH US", href: "#work-with-us" },
  { label: "ABOUT DLD", href: "#about" },
  { label: "BLOGS", href: "#blogs" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[70px] md:h-[90px] bg-background backdrop-blur-md border-b border-border/20">
      <div className="container h-full flex items-center justify-between gap-4 md:gap-6">
        <a href="/" className="flex-shrink-0 ml-2 md:ml-4">
          <img src={logoImage} alt="EmpoweredDLD" className="h-[140px] md:h-[183px] w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium tracking-[0.04em] text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}

          <button className="relative text-primary hover:text-primary/80 transition-colors duration-200 ml-2" aria-label="Shopping cart">
            <ShoppingBag className="w-[26px] h-[26px] stroke-[1.5]" fill="hsl(var(--primary))" color="hsl(var(--primary))" />
            <span className="absolute top-[-2px] right-[-2px] text-[9px] text-primary-foreground bg-primary rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
              0
            </span>
          </button>

          <Button variant="outline" size="default" className="rounded-md h-10 px-7 text-[12px] font-semibold tracking-[0.08em] border-foreground/30 hover:bg-accent transition-all duration-300 ml-2">
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
        <nav className="lg:hidden bg-background border-b border-border/30 px-6 pb-6 pt-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto shadow-[var(--shadow-elevated)]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] font-semibold text-foreground py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-border/20 mt-2">
            <button className="relative text-primary" aria-label="Shopping cart">
              <ShoppingBag className="w-[24px] h-[24px] stroke-[1.5]" fill="hsl(var(--primary))" color="hsl(var(--primary))" />
              <span className="absolute top-[-2px] right-[-2px] text-[9px] text-primary-foreground bg-primary rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
                0
              </span>
            </button>
            <Button className="flex-1 font-bold text-[12px] tracking-[0.1em]">LOGIN</Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
