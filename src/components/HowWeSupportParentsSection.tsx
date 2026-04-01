import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const cards = [
  {
    title: "Books and Resources",
    description: "Stories featuring diverse characters with DLD your child can relate to. Available in 7+ languages with discussion guides and parent guidebook.",
    link: "Explore the Books",
    href: "/shop/books",
  },
  {
    title: "Free Community",
    description: "Connect with 4000+ parents and professionals to ask questions, share strategies, and find support in our private Facebook community.",
    link: "Join the Community",
    href: "https://www.facebook.com/share/g/1GCdxhWtfB/",
  },
  {
    title: "Free Resources",
    description: "Free downloadable guides, checklists, and practical tools to help you advocate for your child, communicate with teachers, and support language development at home.",
    link: "Browse Resources",
    href: "/hub/preview",
  },
  {
    title: "Animated Podcast",
    description: "Watch Dan and Daria share real conversations about living with DLD. These short episodes help you understand your child's experience and start important conversations with them.",
    link: "Watch the Podcast",
    href: "https://youtube.com/playlist?list=PLzfiOYFA1If6abH3LUNdxKPOAuOgkjZN5",
  },
  {
    title: "Educational App",
    description: "Help your child build language skills through interactive storytelling. Designed by a team of experts specifically for children with DLD. Coming soon!",
    link: "Join the App Waitlist",
    href: "/storybuilders",
  },
];

const ParentWorkshopWaitlistCard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim(),
      role: "parent",
      notes: "Parent Workshop waitlist",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You're already on the list!" : "Something went wrong. Please try again.");
      return;
    }
    setJoined(true);
    toast.success("You're on the list! We'll keep you posted.");
  };

  return (
    <div className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px]">
      <h3 className="text-[20px] md:text-[24px] font-black text-foreground mb-4 text-center">
        Parent Workshops
      </h3>
      {joined ? (
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
            🎉 You're on the list! We'll let you know when our next Parent Workshop is announced.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
            In the meantime, check out our <strong>free course</strong> on YouTube:
          </p>
          <a
            href="https://youtube.com/playlist?list=PLzfiOYFA1If7CpwIvkvipjplTZawhjw97&si=I11C55OX3Wbz0hcS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] text-foreground hover:text-primary transition-colors mt-auto pt-2"
          >
            Watch Free Course
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
            Sign up and we'll keep you posted on our next upcoming Parent Workshop!
          </p>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white/80"
          />
          <Input
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/80"
          />
          <Button type="submit" disabled={loading} className="mt-auto">
            {loading ? "Joining..." : "Join Workshop Waitlist"}
          </Button>
        </form>
      )}
    </div>
  );
};

const HowWeSupportParentsSection = () => {
  return (
    <section className="py-10 md:py-16 lg:py-[120px]">
      <div className="container px-6 md:px-8">
        <div className="mb-8 md:mb-10 lg:mb-14">
          <h2 className="text-[28px] md:text-[38px] lg:text-[46px] font-black text-foreground leading-[1.1] mb-3">
            How We Support Parents
          </h2>
          <p className="text-[13px] md:text-[14px] lg:text-[16px] text-muted-foreground leading-[1.7] max-w-[650px]">
            From workshops to books to community support, we're here to help you help your child.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          <ParentWorkshopWaitlistCard />
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-lavender border border-border/30 rounded-lg p-6 md:p-8 lg:p-10 flex flex-col min-h-[220px] md:min-h-[260px]"
            >
              <div>
                <h3 className="text-[20px] md:text-[24px] font-black text-foreground mb-4 text-center whitespace-nowrap">
                  {card.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-muted-foreground leading-[1.7]">
                  {card.description}
                </p>
              </div>
              <a
                href={card.href}
                {...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-1 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em] text-foreground hover:text-primary transition-colors mt-auto pt-6"
              >
                {card.link}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeSupportParentsSection;
