import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Power, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { BRAND_COLORS } from "@/lib/waitlist-constants";

interface Theme {
  id: string;
  title: string;
  description: string;
  emoji: string;
  active: boolean;
  vote_count: number;
}

const ThemeVotingAdmin = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", emoji: "" });
  const [newId, setNewId] = useState("");

  // Load themes
  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase.rpc as any)("get_theme_results");

      if (error) throw error;

      const themesData = (data || []).map((theme: any) => ({
        ...theme,
        active: theme.is_active,
      }));
      setThemes(themesData);
    } catch (error) {
      console.error("Error loading themes:", error);
      toast.error("Failed to load themes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheme = async () => {
    if (!newId || !form.title || !form.description || !form.emoji) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { error } = await (supabase.from as any)("story_themes").insert({
        id: newId,
        title: form.title,
        description: form.description,
        emoji: form.emoji,
        active: true,
      });

      if (error) throw error;

      toast.success("Theme added successfully");
      setForm({ title: "", description: "", emoji: "" });
      setNewId("");
      setAddOpen(false);
      loadThemes();
    } catch (error) {
      console.error("Error adding theme:", error);
      toast.error("Failed to add theme");
    }
  };

  const handleToggleActive = async (themeId: string, currentActive: boolean) => {
    try {
      const { error } = await (supabase.from as any)("story_themes")
        .update({ active: !currentActive })
        .eq("id", themeId);

      if (error) throw error;

      toast.success(
        `Theme ${!currentActive ? "activated" : "deactivated"} successfully`
      );
      loadThemes();
    } catch (error) {
      console.error("Error toggling theme:", error);
      toast.error("Failed to toggle theme");
    }
  };

  const handleRemoveTheme = async (themeId: string) => {
    if (!confirm("Are you sure you want to delete this theme?")) return;

    try {
      const { error } = await (supabase.from as any)("story_themes")
        .delete()
        .eq("id", themeId);

      if (error) throw error;

      toast.success("Theme deleted successfully");
      loadThemes();
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast.error("Failed to delete theme");
    }
  };

  const totalVotes = themes.reduce((sum, theme) => sum + theme.vote_count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Theme Voting Management</h1>
          <p className="text-gray-600 mt-1">
            Manage story themes and view voting results
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: BRAND_COLORS.PRIMARY }}>
              <Plus className="h-4 w-4 mr-2" /> Add Theme
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Story Theme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Theme ID</label>
                <Input
                  placeholder="e.g., fantasy-quest"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value.toLowerCase())}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="e.g., Fantasy Quest"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of the theme"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Emoji</label>
                <Input
                  placeholder="e.g., ⚔️"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  maxLength={2}
                  className="mt-1 text-center text-2xl"
                />
              </div>
              <Button
                onClick={handleAddTheme}
                className="w-full text-white"
                style={{ backgroundColor: BRAND_COLORS.PRIMARY }}
              >
                Add Theme
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold" style={{ color: BRAND_COLORS.PRIMARY }}>
              {themes.length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Active Themes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold" style={{ color: BRAND_COLORS.PRIMARY }}>
              {totalVotes}
            </div>
            <p className="text-sm text-gray-600 mt-1">Total Votes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold" style={{ color: BRAND_COLORS.PRIMARY }}>
              {themes.length > 0
                ? Math.round(totalVotes / themes.length)
                : 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Avg Votes/Theme</p>
          </CardContent>
        </Card>
      </div>

      {/* Themes table with voting results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Voting Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : themes.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No themes created yet
            </div>
          ) : (
            <div className="space-y-4">
              {themes.map((theme) => {
                const percentage =
                  totalVotes > 0
                    ? Math.round((theme.vote_count / totalVotes) * 100)
                    : 0;

                return (
                  <div key={theme.id} className="border rounded-lg p-4">
                    {/* Theme header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{theme.emoji}</span>
                          <div>
                            <h3 className="font-semibold">{theme.title}</h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                              ID: {theme.id}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          {theme.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleActive(theme.id, theme.active)
                          }
                          className={theme.active ? "" : "text-orange-600"}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTheme(theme.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Vote count and bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {theme.vote_count} votes
                        </span>
                        <span className="text-sm text-gray-500">
                          {percentage}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: BRAND_COLORS.PRIMARY,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          theme.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {theme.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeVotingAdmin;
