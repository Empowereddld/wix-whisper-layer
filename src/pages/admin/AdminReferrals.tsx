import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Download, ChevronDown, ChevronRight, Trophy } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Referrer {
  id: string;
  first_name: string;
  last_name: string | null;
  email?: string;
  count: number;
  last_referral: string;
  referred: { id: string; first_name: string; created_at: string }[];
}

const AdminReferrals = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data: referrers, isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      // Get all profiles with referred_by set
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, referred_by, created_at")
        .not("referred_by", "is", null);

      if (!profiles) return [];

      // Group by referrer
      const map = new Map<string, { count: number; last: string; referred: any[] }>();
      profiles.forEach((p) => {
        const ref = p.referred_by!;
        const existing = map.get(ref) || { count: 0, last: p.created_at, referred: [] };
        existing.count++;
        if (new Date(p.created_at) > new Date(existing.last)) existing.last = p.created_at;
        existing.referred.push({ id: p.id, first_name: p.first_name, created_at: p.created_at });
        map.set(ref, existing);
      });

      // Get referrer profiles
      const refIds = Array.from(map.keys());
      const { data: referrerProfiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", refIds);

      const result: Referrer[] = [];
      map.forEach((val, key) => {
        const profile = referrerProfiles?.find((p) => p.id === key);
        result.push({
          id: key,
          first_name: profile?.first_name || "Unknown",
          last_name: profile?.last_name || null,
          count: val.count,
          last_referral: val.last,
          referred: val.referred.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        });
      });

      return result.sort((a, b) => b.count - a.count);
    },
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const exportCSV = () => {
    if (!referrers?.length) return;
    const headers = ["Referrer", "Referrals", "Last Referral"];
    const rows = referrers.map((r) => [
      `${r.first_name} ${r.last_name || ""}`.trim(),
      r.count,
      format(new Date(r.last_referral), "yyyy-MM-dd"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `referrals-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const topReferrers = referrers?.slice(0, 3) || [];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Top Referrers */}
      {topReferrers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {topReferrers.map((r, i) => (
            <div key={r.id} className="bg-gradient-to-br from-mauve/10 to-hub-lavender/10 border border-mauve/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mauve/20 flex items-center justify-center">
                <Trophy className={`h-5 w-5 ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : "text-amber-600"}`} />
              </div>
              <div>
                <p className="font-semibold text-midnight">{r.first_name} {r.last_name || ""}</p>
                <p className="text-sm text-muted-foreground">{r.count} referral{r.count !== 1 ? "s" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Referrer</TableHead>
                <TableHead>Referrals</TableHead>
                <TableHead>Last Referral</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrers?.map((r) => (
                <Collapsible key={r.id} open={expanded.has(r.id)} onOpenChange={() => toggleExpand(r.id)} asChild>
                  <>
                    <TableRow className="cursor-pointer" onClick={() => toggleExpand(r.id)}>
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <button>{expanded.has(r.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</button>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell className="font-medium">{r.first_name} {r.last_name || ""}</TableCell>
                      <TableCell>{r.count}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{format(new Date(r.last_referral), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/30 p-4">
                          <p className="text-sm font-medium mb-2">Referred Users</p>
                          <div className="space-y-1">
                            {r.referred.map((ref) => (
                              <div key={ref.id} className="flex justify-between text-sm">
                                <span>{ref.first_name}</span>
                                <span className="text-muted-foreground">{format(new Date(ref.created_at), "MMM d, yyyy")}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
              {(!referrers || referrers.length === 0) && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">No referrals yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReferrals;
