import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/empowered-logo.webp";

const HubComingSoon = () => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-6 py-16">
      <div className="bg-background rounded-2xl shadow-lg max-w-lg w-full px-10 py-14 flex flex-col items-center text-center gap-6">
        <Link to="/">
          <img src={logoImage} alt="EmpoweredDLD" className="h-28 w-auto" />
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
          Coming Soon
        </h1>

        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
          The Empowered DLD Resource Library is launching soon. Free guides, posters, and tools for parents, therapists, and educators — all in one place.
        </p>

        <Button asChild size="lg" className="rounded-full h-12 px-10 text-sm font-semibold mt-2">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default HubComingSoon;
