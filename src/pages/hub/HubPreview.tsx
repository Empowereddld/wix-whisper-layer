import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowRight, FileText, Image, CheckSquare, BookOpen, Package, BarChart3, Users, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Resource } from "@/hooks/useResources";
import empoweredLogo from "@/assets/empowered-logo.png";

const typeIcons: Record<string, React.ElementType> = {
  poster: Image,
  guide: BookOpen,
  checklist: CheckSquare,
  handout: FileText,
  activity: FileText,
  bundle: Package,
  infographic: BarChart3,
};

const typeLabels: Record<string, string> = {
  poster: "Poster",
  guide: "Guide",
  checklist: "Checklist",
  handout: "Handout",
  activity: "Activity",
  bundle: "Bundle",
  infographic: "Infographic",
};

const HubPreview = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch a limited set of resources for the public preview (no auth required via anon key)
    const fetchPreview = async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .order("download_count", { ascending: false })
        .limit(6);
      if (data) setResources(data);
      setLoading(false);
    };
    fetchPreview();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-midnight text-midnight-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="https://empowereddld.com" className="flex-shrink-0">
              <img src={empoweredLogo} alt="Empowered DLD" className="h-8 brightness-0 invert" />
            </a>
            <div className="flex items-center gap-3">
              <Link to="/hub/login">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                  Log In
                </Button>
              </Link>
              <Link to="/hub/signup">
                <Button size="sm" className="bg-mauve text-white hover:bg-mauve/90">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-midnight to-midnight/90 text-midnight-foreground py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Free DLD Resources.<br />
            <span className="text-mauve">One Place. Always Free.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Posters, guides, checklists, and activities — designed for parents, SLPs, educators, and school leaders supporting children with Developmental Language Disorder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hub/signup">
              <Button size="lg" className="bg-mauve text-white hover:bg-mauve/90 h-14 px-8 text-lg">
                Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/50">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> 100% Free</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Instant access</span>
          </div>
        </div>
      </section>

      {/* Resource Preview Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-midnight mb-3">
              Preview What's Inside
            </h2>
            <p className="text-stone-ui text-lg">
              Sign up once to unlock and download every resource — for free.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const Icon = typeIcons[resource.resource_type] || FileText;
                return (
                  <div
                    key={resource.id}
                    className="relative bg-card rounded-xl border border-thistle/60 overflow-hidden group"
                  >
                    {/* Thumbnail */}
                    <div className="h-40 bg-thistle/30 flex items-center justify-center">
                      <Icon className="h-12 w-12 text-hub-lavender/60" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-midnight mb-1.5 line-clamp-2 leading-snug">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-stone-ui mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-hub-lavender/15 text-hub-lavender font-medium">
                          {typeLabels[resource.resource_type]}
                        </span>
                      </div>
                    </div>

                    {/* Lock overlay */}
                    <div className="absolute inset-0 bg-midnight/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                      <Lock className="h-8 w-8 text-white/80" />
                      <p className="text-white font-medium text-sm">Sign up to download</p>
                      <Link to="/hub/signup">
                        <Button size="sm" className="bg-mauve text-white hover:bg-mauve/90">
                          Create Free Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-thistle/30 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-midnight mb-4">
            Ready to access every resource?
          </h2>
          <p className="text-stone-ui text-lg mb-8">
            Create your free account in under a minute. No credit card. No strings attached.
          </p>
          <Link to="/hub/signup">
            <Button size="lg" className="bg-midnight text-midnight-foreground hover:bg-midnight/90 h-14 px-8 text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight text-white/50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Empowered DLD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HubPreview;
