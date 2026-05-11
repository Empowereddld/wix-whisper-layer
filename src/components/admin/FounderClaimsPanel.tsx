import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Search } from "lucide-react";
import { format } from "date-fns";

type ClaimRow = {
  id: string;
  waitlist_id: string;
  founder_slot_number: number | null;
  recipient_name: string;
  shipping_street: string;
  shipping_street2: string | null;
  shipping_city: string;
  shipping_region: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone: string | null;
  inscription_to: string;
  inscription_note: string | null;
  additional_notes: string | null;
  status: string;
  submitted_at: string;
  updated_at: string;
  fulfilled_at: string | null;
  waitlist?: { name: string | null; email: string | null } | null;
};

export default function FounderClaimsPanel() {
  const [rows, setRows] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("founder_claims")
      .select(
        "*, waitlist:storybuilders_waitlist!founder_claims_waitlist_id_fkey(name,email)"
      )
      .order("founder_slot_number", { ascending: true });
    if (error) {
      // Fallback without join (no FK relation defined)
      const fb = await (supabase as any)
        .from("founder_claims")
        .select("*")
        .order("founder_slot_number", { ascending: true });
      const claims = (fb.data ?? []) as ClaimRow[];
      const ids = Array.from(new Set(claims.map((c) => c.waitlist_id)));
      if (ids.length) {
        const { data: users } = await supabase
          .from("storybuilders_waitlist")
          .select("id, name, email")
          .in("id", ids);
        const map = new Map((users ?? []).map((u: any) => [u.id, u]));
        claims.forEach((c) => {
          const u = map.get(c.waitlist_id);
          c.waitlist = u ? { name: u.name, email: u.email } : null;
        });
      }
      setRows(claims);
    } else {
      setRows((data ?? []) as ClaimRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const t = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.recipient_name?.toLowerCase().includes(t) ||
        r.waitlist?.email?.toLowerCase().includes(t) ||
        r.waitlist?.name?.toLowerCase().includes(t) ||
        r.inscription_to?.toLowerCase().includes(t) ||
        String(r.founder_slot_number ?? "").includes(t),
    );
  }, [rows, search]);

  const exportCsv = () => {
    if (filtered.length === 0) return;
    const headers = [
      "Slot",
      "Founder Name",
      "Founder Email",
      "Recipient",
      "Street",
      "Street 2",
      "City",
      "Region",
      "Postal",
      "Country",
      "Phone",
      "Inscription To",
      "Inscription Note",
      "Additional Notes",
      "Status",
      "Submitted",
      "Updated",
    ];
    const rowsCsv = filtered.map((r) => [
      r.founder_slot_number ?? "",
      r.waitlist?.name ?? "",
      r.waitlist?.email ?? "",
      r.recipient_name,
      r.shipping_street,
      r.shipping_street2 ?? "",
      r.shipping_city,
      r.shipping_region,
      r.shipping_postal_code,
      r.shipping_country,
      r.shipping_phone ?? "",
      r.inscription_to,
      r.inscription_note ?? "",
      r.additional_notes ?? "",
      r.status,
      r.submitted_at,
      r.updated_at,
    ]);
    const csv = [headers, ...rowsCsv]
      .map((row) =>
        row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `founder-claims-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading Founder claims…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, slot, inscription…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={exportCsv} variant="outline" size="sm" disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-background border border-border rounded-2xl shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Slot</TableHead>
                  <TableHead>Founder</TableHead>
                  <TableHead>Ship To</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No Founder claims yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id} className="align-top">
                      <TableCell className="font-bold">#{r.founder_slot_number ?? "—"}</TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium text-foreground">{r.waitlist?.name ?? "—"}</div>
                        <div className="text-muted-foreground">{r.waitlist?.email ?? "—"}</div>
                      </TableCell>
                      <TableCell className="text-xs leading-relaxed max-w-[260px]">
                        <div className="font-medium text-foreground">{r.recipient_name}</div>
                        <div className="text-muted-foreground">
                          {r.shipping_street}
                          {r.shipping_street2 ? `, ${r.shipping_street2}` : ""}
                          <br />
                          {r.shipping_city}, {r.shipping_region} {r.shipping_postal_code}
                          <br />
                          {r.shipping_country}
                          {r.shipping_phone ? <><br />☎ {r.shipping_phone}</> : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs max-w-[240px]">
                        <div className="font-medium text-foreground">"To {r.inscription_to}"</div>
                        {r.inscription_note && (
                          <div className="text-muted-foreground italic mt-1">
                            {r.inscription_note}
                          </div>
                        )}
                        {r.additional_notes && (
                          <div className="text-muted-foreground mt-2">
                            <strong>Notes:</strong> {r.additional_notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(r.submitted_at), "MMM d, yyyy")}
                        {r.updated_at !== r.submitted_at && (
                          <div className="italic">
                            edited {format(new Date(r.updated_at), "MMM d")}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
