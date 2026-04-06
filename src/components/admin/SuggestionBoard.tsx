import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  user_email: string;
  status: string;
  vote_count: number;
  created_at: string;
}

interface Column {
  id: string;
  title: string;
  suggestions: Suggestion[];
}

const SuggestionBoard = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("waitlist_suggestions")
        .select("*")
        .order("vote_count", { ascending: false });

      if (error) throw error;

      if (data) {
        setSuggestions(
          data.map((s: any) => ({
            ...s,
            vote_count: s.vote_count || 0,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleStatusChange = useCallback(
    async (suggestionId: string, newStatus: string) => {
      try {
        await supabase
          .from("waitlist_suggestions")
          .update({ status: newStatus })
          .eq("id", suggestionId);

        setSuggestions((prev) =>
          prev.map((s) =>
            s.id === suggestionId ? { ...s, status: newStatus } : s
          )
        );
      } catch (error) {
        console.error("Error updating suggestion status:", error);
      }
    },
    []
  );

  const columns: Column[] = [
    {
      id: "new",
      title: "New",
      suggestions: suggestions.filter((s) => s.status === "new" || !s.status),
    },
    {
      id: "under_review",
      title: "Under Review",
      suggestions: suggestions.filter((s) => s.status === "under_review"),
    },
    {
      id: "planned",
      title: "Planned",
      suggestions: suggestions.filter((s) => s.status === "planned"),
    },
    {
      id: "done",
      title: "Done",
      suggestions: suggestions.filter((s) => s.status === "done"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {column.suggestions.length}
              </Badge>
            </div>

            <div className="space-y-3 min-h-[400px] bg-muted/20 rounded-lg p-3">
              {column.suggestions.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                  No suggestions
                </div>
              ) : (
                column.suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isExpanded={expandedCard === suggestion.id}
                    onToggleExpand={() =>
                      setExpandedCard(
                        expandedCard === suggestion.id ? null : suggestion.id
                      )
                    }
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: Suggestion;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const SuggestionCard = ({
  suggestion,
  isExpanded,
  onToggleExpand,
  onStatusChange,
}: SuggestionCardProps) => {
  const categoryColors: Record<string, string> = {
    feature: "bg-blue-100 text-blue-800",
    improvement: "bg-purple-100 text-purple-800",
    design: "bg-pink-100 text-pink-800",
    content: "bg-green-100 text-green-800",
    other: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm line-clamp-2">
              {suggestion.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              by {suggestion.user_email.split("@")[0]}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Badge className={categoryColors[suggestion.category] || categoryColors.other}>
          {suggestion.category}
        </Badge>

        <div className="flex items-center gap-2">
          <ThumbsUp className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-semibold">{suggestion.vote_count}</span>
        </div>

        {isExpanded && (
          <div className="space-y-3 border-t pt-3 mt-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {suggestion.description}
            </p>

            <div className="text-xs text-muted-foreground">
              Submitted {format(new Date(suggestion.created_at), "MMM dd, yyyy")}
            </div>

            <Select value={suggestion.status || "new"} onValueChange={(v) => onStatusChange(suggestion.id, v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionBoard;
