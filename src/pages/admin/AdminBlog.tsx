import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLogAction } from "@/hooks/useAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface PostForm {
  id?: string;
  title: string;
  slug: string;
  body: string;
  featured_image_url: string;
  status: string;
  published_at: string;
}

const emptyPost: PostForm = {
  title: "", slug: "", body: "", featured_image_url: "", status: "draft", published_at: "",
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminBlog = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<PostForm>(emptyPost);
  const queryClient = useQueryClient();
  const logAction = useLogAction();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (post: PostForm) => {
      const payload = {
        title: post.title,
        slug: post.slug || slugify(post.title),
        body: post.body,
        featured_image_url: post.featured_image_url || null,
        status: post.status,
        published_at: post.status === "published" ? (post.published_at || new Date().toISOString()) : null,
        updated_at: new Date().toISOString(),
      };
      if (post.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setSheetOpen(false);
      toast({ title: "Post saved" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] }),
  });

  const handleNew = () => { setForm(emptyPost); setSheetOpen(true); };
  const handleEdit = (p: any) => {
    setForm({ id: p.id, title: p.title, slug: p.slug, body: p.body || "", featured_image_url: p.featured_image_url || "", status: p.status, published_at: p.published_at || "" });
    setSheetOpen(true);
  };
  const handleDelete = async (p: any) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await deleteMutation.mutateAsync(p.id);
    logAction.mutate(`Deleted blog post: ${p.title}`);
    toast({ title: "Post deleted" });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Button onClick={handleNew} className="bg-coral hover:bg-coral/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {p.published_at ? format(new Date(p.published_at), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(p)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!posts || posts.length === 0) && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">No blog posts yet. Create your first post!</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader><SheetTitle>{form.id ? "Edit Post" : "New Post"}</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }))} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} rows={10} />
            </div>
            <div>
              <Label>Featured Image URL</Label>
              <Input value={form.featured_image_url} onChange={(e) => setForm((p) => ({ ...p, featured_image_url: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.status === "published"} onCheckedChange={(v) => setForm((p) => ({ ...p, status: v ? "published" : "draft" }))} />
              <Label>{form.status === "published" ? "Published" : "Draft"}</Label>
            </div>
            <Button onClick={() => { saveMutation.mutate(form); logAction.mutate(form.id ? `Updated post: ${form.title}` : `Created post: ${form.title}`); }} disabled={saveMutation.isPending} className="w-full bg-coral hover:bg-coral/90 text-white">
              {saveMutation.isPending ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminBlog;
