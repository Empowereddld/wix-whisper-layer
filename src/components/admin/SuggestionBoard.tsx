import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, Star, Check, X, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  vote_count: number;
  created_at: string;
  waitlist_id: string;
}

const COLUMN_DEFS: { id: string; title: string }[] = [
  { id: "pending", title: "New" },
  { id: "under_review", title: "Considering" },
  { id: "planned", title: "Building" },
  { id: "done", title: "Built" },
];

const SuggestionBoard = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("waitlist_suggestions")
      .select("id, title, description, category, status, vote_count, created_at, waitlist_id")
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(`Could not load suggestions: ${error.message}`);
    } else {
      setSuggestions((data ?? []) as Suggestion[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from("waitlist_suggestions")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error(`Update failed: ${error.message}`);
    } else {
      toast.success(`Marked as ${status.replace("_", " ")}`);
      setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    }
    setBusyId(null);
  };

  const removeSuggestion = async (id: string) => {
    if (!confirm("Reject and delete this suggestion? This cannot be undone.")) return;
    setBusyId(id);
    const { error } = await supabase.from("waitlist_suggestions").delete().eq("id", id);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
    } else {
      toast.success("Suggestion rejected.");
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    }
    setBusyId(null);
  };

  const columns = COLUMN_DEFS.map((c) => ({
    ...c,
    items: suggestions.filter((s) =>
      c.id === "pending"
        ? s.status === "pending" || s.status === "new" || !s.status
        : s.status === c.id
    ),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading suggestions…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Approve, queue, or reject community suggestions. Featured items appear first to users.
        </p>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <Badge variant="outline" className="text-xs">{column.items.length}</Badge>
            </div>

            <div className="space-y-3 min-h-[200px] bg-muted/20 rounded-lg p-3">
              {column.items.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
                  Nothing here yet
                </div>
              ) : (
                column.items.map((s) => (
                  <Card key={s.id} className="bg-white shadow-sm">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm leading-snug">{s.title}</h4>
                        <Badge variant="secondary" className="text-[10px] shrink-0 capitalize">
                          {s.category || "general"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">{s.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {s.vote_count}
                        </span>
                        <span>{format(new Date(s.created_at), "MMM d")}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {s.status !== "under_review" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px]"
                            disabled={busyId === s.id}
                            onClick={() => updateStatus(s.id, "under_review")}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        )}
                        {s.status !== "planned" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px]"
                            disabled={busyId === s.id}
                            onClick={() => updateStatus(s.id, "planned")}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Plan
                          </Button>
                        )}
                        {s.status !== "done" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px]"
                            disabled={busyId === s.id}
                            onClick={() => updateStatus(s.id, "done")}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Done
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] text-destructive hover:text-destructive"
                          disabled={busyId === s.id}
                          onClick={() => removeSuggestion(s.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
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
