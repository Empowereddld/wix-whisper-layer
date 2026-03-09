import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminResources } from "@/hooks/useAdminResources";
import { useLogAction } from "@/hooks/useAuditLog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const RESOURCE_TYPES = ["poster", "guide", "checklist", "handout", "activity", "bundle", "infographic"];
const AUDIENCES = [
  { label: "Parents", value: "parent" },
  { label: "Therapists", value: "slp" },
  { label: "Educators", value: "educator" },
];

interface ResourceFormData {
  id?: string;
  title: string;
  description: string;
  roles: string[];
  resource_type: string;
  thumbnail_url: string;
  file_url: string;
  is_published: boolean;
}

const emptyForm: ResourceFormData = {
  title: "",
  description: "",
  roles: [],
  resource_type: "guide",
  thumbnail_url: "",
  file_url: "",
  is_published: true,
};

const AdminResources = () => {
  const [search, setSearch] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<ResourceFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: resources, isLoading, togglePublish, deleteResource, saveResource } = useAdminResources({
    search,
    audience: filterAudience,
    type: filterType,
    status: filterStatus,
  });
  const logAction = useLogAction();

  const handleEdit = (r: any) => {
    setForm({
      id: r.id,
      title: r.title,
      description: r.description || "",
      roles: r.roles || [],
      resource_type: r.resource_type,
      thumbnail_url: r.thumbnail_url || "",
      file_url: r.file_url || "",
      is_published: r.is_published,
    });
    setSheetOpen(true);
  };

  const handleNew = () => {
    setForm(emptyForm);
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    await saveResource.mutateAsync(form);
    logAction.mutate(form.id ? `Updated resource: ${form.title}` : `Created resource: ${form.title}`);
    setSheetOpen(false);
    toast({ title: form.id ? "Resource updated" : "Resource created" });
  };

  const handleDelete = async (r: any) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await deleteResource.mutateAsync(r.id);
    logAction.mutate(`Deleted resource: ${r.title}`);
    toast({ title: "Resource deleted" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: string, field: "file_url" | "thumbnail_url") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    setForm((prev) => ({ ...prev, [field]: urlData.publicUrl }));
    setUploading(false);
  };

  const toggleAudience = (val: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(val)
        ? prev.roles.filter((r) => r !== val)
        : [...prev.roles, val],
    }));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Button onClick={handleNew} className="bg-coral hover:bg-coral/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add New Resource
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterAudience} onValueChange={(v) => setFilterAudience(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Audience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Audiences</SelectItem>
            {AUDIENCES.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => setFilterType(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.thumbnail_url ? (
                      <img src={r.thumbnail_url} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="text-xs">{(r.roles || []).join(", ") || "All"}</TableCell>
                  <TableCell className="capitalize text-xs">{r.resource_type}</TableCell>
                  <TableCell className="text-right">{r.download_count || 0}</TableCell>
                  <TableCell>
                    <Switch
                      checked={r.is_published}
                      onCheckedChange={(checked) => {
                        togglePublish.mutate({ id: r.id, is_published: checked });
                        logAction.mutate(`${checked ? "Published" : "Unpublished"} resource: ${r.title}`);
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(r)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!resources || resources.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    No resources found. Add your first resource!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Resource Form Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{form.id ? "Edit Resource" : "Add New Resource"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} />
            </div>
            <div>
              <Label>Audience</Label>
              <div className="flex gap-2 mt-1">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => toggleAudience(a.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.roles.includes(a.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Resource Type</Label>
              <Select value={form.resource_type} onValueChange={(v) => setForm((p) => ({ ...p, resource_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Thumbnail Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "thumbnails", "thumbnail_url")} />
              {form.thumbnail_url && <img src={form.thumbnail_url} className="h-20 mt-2 rounded" />}
            </div>
            <div>
              <Label>Resource File (PDF)</Label>
              <Input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, "resources", "file_url")} />
              {form.file_url && <p className="text-xs text-muted-foreground mt-1 truncate">{form.file_url}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm((p) => ({ ...p, is_published: v }))} />
              <Label>{form.is_published ? "Published" : "Draft"}</Label>
            </div>
            <Button onClick={handleSave} disabled={saveResource.isPending || uploading} className="w-full bg-coral hover:bg-coral/90 text-white">
              {saveResource.isPending ? "Saving..." : "Save Resource"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminResources;
