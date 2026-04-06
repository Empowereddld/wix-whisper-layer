import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
}

const SuggestionBoard = () => {
  const [suggestions] = useState<Suggestion[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const columns = [
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

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> The suggestion board feature is coming soon. Community suggestions will appear here once the feature is fully implemented.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="outline" className="text-xs">
                {column.suggestions.length}
              </Badge>
            </div>

            <div className="space-y-3 min-h-[200px] bg-muted/20 rounded-lg p-3">
              {column.suggestions.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                  No suggestions
                </div>
              ) : (
                column.suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="bg-white shadow-sm">
                    <CardContent className="p-3">
                      <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBoard;
