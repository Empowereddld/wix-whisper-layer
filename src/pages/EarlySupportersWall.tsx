import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { TIER_COLORS, TIER_NAMES } from "@/lib/waitlist-constants";
import { format } from "date-fns";

interface EarlySupporter {
  id: string;
  name: string;
  email: string;
  created_at: string;
  current_tier: number;
}

const BRAND_COLORS = {
  primary: "#8861d4",
  secondary: "#f3ebf8",
  deepPurple: "#3b1f59",
  white: "#ffffff",
  border: "#dedede",
  text: "#121212",
};

const EarlySupportersWall = () => {
  const navigate = useNavigate();
  const [supporters, setSupporters] = useState<EarlySupporter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSupporters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("storybuilders_waitlist")
        .select("id, name, email, created_at, current_tier, rewards_inventory")
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (fetchError) {
        setError(`Failed to load supporters: ${fetchError.message}`);
        return;
      }

      if (data) {
        // Filter for users who have redeemed the Story Starter Pack
        const redeemed = data.filter((user: any) => {
          if (user.rewards_inventory && typeof user.rewards_inventory === 'object') {
            const inventory = user.rewards_inventory as Record<string, any>;
            return inventory.story_starter_pack?.claimed === true;
          }
          return false;
        });

        const supporters = redeemed.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          current_tier: user.current_tier,
        }));

        setSupporters(supporters);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Error fetching supporters: ${message}`);
      console.error("Error fetching supporters:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupporters();
  }, [fetchSupporters]);

  const getTierColor = (tier: number): string => {
    return TIER_COLORS[tier] || TIER_COLORS[0];
  };

  const getTierName = (tier: number): string => {
    return TIER_NAMES[tier] || TIER_NAMES[0];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRAND_COLORS.white }}>
      <SEOHead
        title="Story Pros Early Supporters | Empowered DLD"
        description="Meet the families who are helping build something special for children who deserve to be heard."
        path="/early-supporters"
        ogImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop"
      />

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: BRAND_COLORS.secondary }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                style={{ color: BRAND_COLORS.deepPurple }}
              >
                Story Pros Early Supporters
              </h1>
              <p
                className="text-lg sm:text-xl mb-8 leading-relaxed"
                style={{ color: BRAND_COLORS.text }}
              >
                These families are helping build something special for children who deserve to be heard.
              </p>
              <div
                className="h-1 w-20 rounded-full mx-auto"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              />
            </motion.div>
          </div>
        </section>

        {/* Supporters Grid Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {isLoading ? (
              <div className="text-center py-20">
                <div
                  className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
                  style={{ borderColor: BRAND_COLORS.primary }}
                />
                <p className="mt-4" style={{ color: BRAND_COLORS.text }}>
                  Loading our wonderful supporters...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p style={{ color: "#ef4444" }}>{error}</p>
              </div>
            ) : supporters.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ color: BRAND_COLORS.text }}>
                  No supporters yet. Be the first to join!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-12">
                  <p
                    className="text-xl font-semibold"
                    style={{ color: BRAND_COLORS.primary }}
                  >
                    {supporters.length} {supporters.length === 1 ? "family" : "families"} building with us
                  </p>
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {supporters.map((supporter) => (
                    <motion.div
                      key={supporter.id}
                      variants={itemVariants}
                      className="group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:shadow-xl"
                      style={{
                        backgroundColor: BRAND_COLORS.white,
                        border: `2px solid ${BRAND_COLORS.border}`,
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        const element = e.currentTarget;
                        element.style.borderColor = BRAND_COLORS.primary;
                        element.style.boxShadow = `0 0 20px ${BRAND_COLORS.primary}20`;
                      }}
                      onMouseLeave={(e) => {
                        const element = e.currentTarget;
                        element.style.borderColor = BRAND_COLORS.border;
                        element.style.boxShadow = "none";
                      }}
                    >
                      {/* Gradient background on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
                        }}
                      />

                      <div className="relative z-10">
                        {/* Tier Badge */}
                        <div className="mb-4 flex items-center justify-between">
                          <div
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{
                              backgroundColor: getTierColor(supporter.current_tier),
                            }}
                          >
                            {getTierName(supporter.current_tier)}
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: BRAND_COLORS.text }}
                          >
                            {format(new Date(supporter.created_at), "MMM yyyy")}
                          </span>
                        </div>

                        {/* Name */}
                        <h3
                          className="text-xl font-bold mb-2"
                          style={{ color: BRAND_COLORS.deepPurple }}
                        >
                          {supporter.name}
                        </h3>

                        {/* Decorative element */}
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: BRAND_COLORS.border }}>
                          <div
                            className="w-8 h-1 rounded-full"
                            style={{ backgroundColor: getTierColor(supporter.current_tier) }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: BRAND_COLORS.secondary }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: BRAND_COLORS.deepPurple }}
              >
                Want to see your name here?
              </h2>
              <p
                className="text-lg mb-8"
                style={{ color: BRAND_COLORS.text }}
              >
                Join the Story Pros Launch Team and become part of a community of families helping to build something special.
              </p>
              <Button
                onClick={() => navigate("/storypros")}
                className="inline-flex items-center gap-2 px-8 py-6 text-lg font-bold text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: BRAND_COLORS.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${BRAND_COLORS.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Join the Launch Team
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EarlySupportersWall;
