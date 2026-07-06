import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/empowered-logo.webp";
import { useAuth } from "@/contexts/AuthContext";

const whoWeServeLinks = [
  { label: "For Parents", href: "/for-parents" },
  { label: "For Therapists", href: "/for-therapists" },
  { label: "For Educators", href: "/for-educators" },
  { label: "For Organizations", href: "/for-organizations" },
];

const resourcesLinks = [
  { label: "Podcasts", href: "/resources/podcasts" },
  { label: "Free Course", href: "/resources/free-course" },
  { label: "Downloadables", href: "/resources/downloadables" },
  { label: "Blogs", href: "/resources/blog" },
];

const shopLinks = [
  { label: "Books", href: "/shop/books" },
  { label: "Bulk Orders", href: "/shop/bulk-orders" },
  { label: "Educational App", href: "/storypros" },
];

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "WHO WE SERVE", href: "/who-we-serve", children: whoWeServeLinks },
  { label: "RESOURCES", href: "/resources", children: resourcesLinks },
  { label: "SHOP", href: "/shop", children: shopLinks },
  { label: "WORK WITH US", href: "/work-with-us" },
  { label: "ABOUT DLD", href: "/about-dld" },
  { label: "CONTACT", href: "/contact" },
];

const mobileNavLinks = [
  { label: "HOME", href: "/" },
  { label: "WHO WE SERVE", href: "/who-we-serve", children: whoWeServeLinks },
  { label: "RESOURCES", href: "/resources", children: resourcesLinks },
  { label: "SHOP", href: "/shop", children: shopLinks },
  { label: "WORK WITH US", href: "/work-with-us" },
  { label: "ABOUT DLD", href: "/about-dld" },
  { label: "WHY EMPOWERED DLD", href: "/why-empowered-dld" },
  { label: "CONTACT", href: "/contact" },
];

const Header = () => {
  const { session } = useAuth();
  const signupHref = "/signup";
  const loginHref = "/login";
  const libraryHref = "/hub";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-[70px] lg:h-[80px] bg-background backdrop-blur-md border-b border-border/20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-full flex items-center justify-between gap-6">
        <Link to="/" className="flex-shrink-0">
          <img src={logoImage} alt="Empowered DLD" className="h-[32px] lg:h-[38px] w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" ref={dropdownRef}>
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative flex items-center">
                <Link
                  to={link.href}
                  className="text-[13px] font-medium tracking-[0.06em] text-foreground/80 hover:text-primary transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
                <button
                  className="p-1 text-foreground/80 hover:text-primary transition-colors duration-200"
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  aria-label="Show submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === link.label && (
                   <div className="absolute top-full left-0 mt-2 bg-background border border-border/30 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-2.5 text-[13px] font-medium text-foreground/70 hover:bg-accent hover:text-primary transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-[13px] font-medium tracking-[0.04em] text-foreground/80 hover:text-primary transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            )
          )}

          <button className="relative text-primary hover:text-primary/80 transition-colors duration-200 ml-2" aria-label="Shopping cart">
            <ShoppingBag className="w-[26px] h-[26px] stroke-[1.5]" fill="hsl(var(--primary))" color="hsl(var(--primary))" />
            <span className="absolute top-[-2px] right-[-2px] text-[9px] text-primary-foreground bg-primary rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
              0
            </span>
          </button>

          {session ? (
            <Button asChild variant="outline" size="default" className="rounded-md h-10 px-7 text-[12px] font-semibold tracking-[0.08em] border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all duration-300 ml-2 whitespace-nowrap">
              <Link to={libraryHref}>MY LIBRARY</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-3 xl:gap-4 ml-2">
              <Link
                to={loginHref}
                className="text-[12px] xl:text-[13px] font-medium tracking-[0.04em] text-foreground/80 hover:text-primary transition-colors duration-200 whitespace-nowrap"
              >
                Log in
              </Link>
              <Button asChild size="default" className="rounded-md h-10 px-5 xl:px-7 text-[12px] font-semibold tracking-[0.08em] bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 whitespace-nowrap">
                <Link to={signupHref}>JOIN THE LIBRARY</Link>
              </Button>
            </div>
          )}
        </nav>

        <button
          className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-background border-b border-border/30 px-6 pb-6 pt-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto shadow-[var(--shadow-elevated)]">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  className="flex items-center justify-between w-full text-[14px] font-semibold text-foreground py-1"
                  onClick={() => setMobileSubOpen(mobileSubOpen === link.label ? null : link.label)}
                >
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSubOpen === link.label ? "rotate-180" : ""}`} />
                </button>
                {mobileSubOpen === link.label && (
                  <div className="pl-4 flex flex-col gap-2 mt-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="text-[13px] font-medium text-foreground/60 py-1"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-[14px] font-semibold text-foreground py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <div className="flex items-center gap-4 pt-2 border-t border-border/20 mt-2">
            <button className="relative text-primary" aria-label="Shopping cart">
              <ShoppingBag className="w-[24px] h-[24px] stroke-[1.5]" fill="hsl(var(--primary))" color="hsl(var(--primary))" />
              <span className="absolute top-[-2px] right-[-2px] text-[9px] text-primary-foreground bg-primary rounded-full w-[14px] h-[14px] flex items-center justify-center font-bold leading-none">
                0
              </span>
            </button>
            {session ? (
              <Button asChild variant="outline" className="flex-1 font-bold text-[12px] tracking-[0.1em] border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground">
                <Link to={libraryHref} onClick={() => setMobileOpen(false)}>MY LIBRARY</Link>
              </Button>
            ) : (
              <div className="flex-1 flex flex-col gap-2">
                <Button asChild className="font-bold text-[12px] tracking-[0.1em]">
                  <Link to={signupHref} onClick={() => setMobileOpen(false)}>JOIN THE LIBRARY</Link>
                </Button>
                <Link
                  to={loginHref}
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-[13px] font-medium text-foreground/80 hover:text-primary py-1"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
