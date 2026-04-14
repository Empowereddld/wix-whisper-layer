import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { INITIAL_STORY_THEMES, BRAND_COLORS } from "@/lib/waitlist-constants";

interface ThemeVotingProps {
  canVote: boolean;
  userEmail?: string;
}

interface Theme {
  id: string;
  title: string;
  description: string;
  emoji: string;
  votes: number;
}

const ThemeVoting = ({ canVote, userEmail }: ThemeVotingProps) => {
  const [themes, setThemes] = useState<Theme[]>([...INITIAL_STORY_THEMES] as Theme[]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingVote, setCheckingVote] = useState(true);

  // Check if user has already voted
  useEffect(() => {
    const checkUserVote = async () => {
      if (!userEmail) {
        setCheckingVote(false);
        return;
      }

      try {
        const { data } = await (supabase.rpc as any)("check_user_vote", {
          p_email: userEmail,
        });

        if (data && (data as any).length > 0) {
          setHasVoted(true);
          setSelectedTheme((data as any)[0].theme_id);
        }
      } catch (error) {
        console.error("Error checking vote:", error);
      } finally {
        setCheckingVote(false);
      }
    };

    checkUserVote();
  }, [userEmail]);

  // Load theme results
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const { data } = await (supabase.rpc as any)("get_theme_results");

        if (data) {
          const themesWithVotes = INITIAL_STORY_THEMES.map((theme) => {
            const result = (data as any[]).find((r: any) => r.theme_id === theme.id);
            return {
              ...theme,
              votes: result?.vote_count || 0,
            };
          });
          setThemes(themesWithVotes);
        }
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    };

    loadThemes();
  }, []);

  const handleVote = async () => {
    if (!selectedTheme || !userEmail || !canVote || hasVoted) return;

    setLoading(true);
    try {
      const { data, error } = await (supabase.rpc as any)("cast_theme_vote", {
        p_email: userEmail,
        p_theme_id: selectedTheme,
      });

      if (error) throw error;

      if ((data as any)?.success) {
        setHasVoted(true);
        toast.success("Your vote has been recorded!");

        // Reload theme results
        const { data: results } = await (supabase.rpc as any)("get_theme_results");
        if (results) {
          const themesWithVotes = INITIAL_STORY_THEMES.map((theme) => {
            const result = (results as any[]).find((r: any) => r.theme_id === theme.id);
            return {
              ...theme,
              votes: result?.vote_count || 0,
            };
          });
          setThemes(themesWithVotes);
        }
      } else {
        toast.error((data as any)?.error || "Failed to cast vote");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingVote) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const totalVotes = themes.reduce((sum, theme) => sum + theme.votes, 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold" style={{ color: BRAND_COLORS.DARK }}>
          Vote on Story Themes
        </h2>
        <p className="text-gray-600">
          Help shape the Story Pros stories! Choose your favorite theme.
        </p>
      </div>

      {/* Locked overlay if user can't vote */}
      {!canVote && (
        <div
          className="relative rounded-lg border-2 border-dashed p-6 text-center"
          style={{ backgroundColor: BRAND_COLORS.LIGHT }}
        >
          <div className="absolute inset-0 backdrop-blur-sm rounded-lg flex items-center justify-center bg-black/20">
            <div className="text-center space-y-2">
              <Lock className="h-8 w-8 text-white mx-auto" />
              <p className="text-white font-semibold">
                Redeem the Story Champion Pack to unlock voting
              </p>
            </div>
          </div>
          <p className="text-gray-700 opacity-50">Themes will be visible here</p>
        </div>
      )}

      {/* Theme cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const percentage =
            totalVotes > 0 ? Math.round((theme.votes / totalVotes) * 100) : 0;
          const isSelected = selectedTheme === theme.id;

          return (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "ring-2"
                  : "hover:shadow-lg"
              } ${!canVote ? "opacity-60" : ""}`}
              style={{
                borderColor: isSelected ? BRAND_COLORS.PRIMARY : undefined,
              } as React.CSSProperties}
              onClick={() => canVote && !hasVoted && setSelectedTheme(theme.id)}
            >
              <CardContent className="p-4 space-y-3">
                {/* Theme header with emoji and title */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-3xl mb-2">{theme.emoji}</div>
                    <h3 className="font-semibold text-lg">{theme.title}</h3>
                  </div>
                  {hasVoted && isSelected && (
                    <Check
                      className="h-5 w-5 flex-shrink-0"
                      style={{ color: BRAND_COLORS.PRIMARY }}
                    />
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">{theme.description}</p>

                {/* Vote count and bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      {theme.votes} votes
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: BRAND_COLORS.PRIMARY,
                      }}
                    />
                  </div>
                </div>

                {/* Selection radio button */}
                {canVote && (
                  <div className="flex items-center pt-2">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={isSelected}
                      onChange={() => setSelectedTheme(theme.id)}
                      disabled={hasVoted}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: BRAND_COLORS.PRIMARY }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vote button */}
      {canVote && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleVote}
            disabled={!selectedTheme || loading || hasVoted}
            className="px-8 text-white font-semibold"
            style={{
              backgroundColor: hasVoted ? "#999" : BRAND_COLORS.PRIMARY,
            }}
          >
            {hasVoted ? "✓ Vote Recorded" : "Submit Vote"}
          </Button>
        </div>
      )}

      {/* Message for users who already voted */}
      {canVote && hasVoted && (
        <div
          className="text-center p-4 rounded-lg"
          style={{ backgroundColor: BRAND_COLORS.LIGHT }}
        >
          <p className="text-gray-700">
            Thank you for voting! You selected{" "}
            <span className="font-semibold">
              {themes.find((t) => t.id === selectedTheme)?.title}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ThemeVoting;
