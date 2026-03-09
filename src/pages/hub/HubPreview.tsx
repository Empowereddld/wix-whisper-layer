import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight, FileText, Image, BookOpen, Package, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import empoweredLogo from "@/assets/empowered-logo.png";

const typeIcons: Record<string, React.ElementType> = {
  poster: Image,
  guide: BookOpen,
  checklist: FileText,
  bundle: Package,
  infographic: BarChart3,
};

const placeholderResources = [
  {
    id: "1",
    title: "Dan and Daria's Tips for Little Talkers",
    description: "A colorful poster with practical tips to support early language development at home.",
    type: "poster",
    audience: "Parents",
  },
  {
    id: "2",
    title: "DLD Awareness Infographic",
    description: "A visual guide explaining DLD signs, statistics, and intervention strategies.",
    type: "infographic",
    audience: "Therapists",
  },
  {
    id: "3",
    title: "Accommodations & Modifications for DLD",
    description: "A comprehensive checklist of classroom accommodations to support students with DLD.",
    type: "checklist",
    audience: "Educators",
  },
  {
    id: "4",
    title: "Language Impact Checklist",
    description: "An assessment tool to identify how DLD affects communication across different settings.",
    type: "checklist",
    audience: "Therapists",
  },
  {
    id: "5",
    title: "DLD Discussion & Activity Guide",
    description: "Engaging activities and discussion prompts for teaching students about DLD.",
    type: "guide",
    audience: "Educators",
  },
  {
    id: "6",
    title: "DLD Starter Pack",
    description: "A curated bundle of essential resources for families new to the DLD journey.",
    type: "bundle",
    audience: "Parents",
  },
];

type AudienceFilter = "All" | "Parents" | "Therapists" | "Educators";

const HubPreview = () => {
  const [activeFilter, setActiveFilter] = useState<AudienceFilter>("All");

  const filteredResources = placeholderResources.filter(
    (resource) => activeFilter === "All" || resource.audience === activeFilter
  );

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
            Free DLD Resources.
            <br />
            <span className="text-mauve">Free to Access. Always Growing.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Posters, guides, checklists, and activities — designed for Parents, Therapists, and Educators supporting children with Developmental Language Disorder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hub/signup">
              <Button size="lg" className="bg-mauve text-white hover:bg-mauve/90 h-14 px-8 text-lg">
                Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/50">
            <span>✦ 100% Free</span>
            <span>✦ No credit card</span>
            <span>✦ Instant access</span>
          </div>
        </div>
      </section>

      {/* Audience Filter Tabs */}
      <section className="bg-thistle/30 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value as AudienceFilter)}
            className="w-full"
          >
            <TabsList className="bg-white/80 border border-thistle mx-auto flex w-fit">
              <TabsTrigger value="All" className="px-6 data-[state=active]:bg-midnight data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="Parents" className="px-6 data-[state=active]:bg-midnight data-[state=active]:text-white">
                Parents
              </TabsTrigger>
              <TabsTrigger value="Therapists" className="px-6 data-[state=active]:bg-midnight data-[state=active]:text-white">
                Therapists
              </TabsTrigger>
              <TabsTrigger value="Educators" className="px-6 data-[state=active]:bg-midnight data-[state=active]:text-white">
                Educators
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Resource Preview Grid */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-midnight mb-3">
              Preview What's Inside
            </h2>
            <p className="text-stone-ui text-lg">
              Sign up once to unlock and download every resource — for free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = typeIcons[resource.type] || FileText;
              return (
                <div
                  key={resource.id}
                  className="relative bg-card rounded-xl border border-thistle/60 overflow-hidden group shadow-sm"
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
                      <span className="text-xs px-2 py-0.5 rounded-full bg-mauve/15 text-mauve font-medium">
                        {resource.audience}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-hub-lavender/15 text-hub-lavender font-medium capitalize">
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  {/* Lock overlay on hover */}
                  <div className="absolute inset-0 bg-midnight/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <Lock className="h-8 w-8 text-white/80" />
                    <p className="text-white font-medium text-sm">Sign Up to Download</p>
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
