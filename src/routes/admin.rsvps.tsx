import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Download, Trash2, ArrowLeft, CalendarCheck, Check, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/rsvps")({
  head: () => ({
    meta: [
      { title: "Event RSVPs — Noqoody Admin" },
      { name: "description", content: "View, filter and export event RSVP submissions." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Event RSVPs — Noqoody Admin" },
      { property: "og:description", content: "View, filter and export event RSVP submissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <RsvpAdmin />
    </AuthProvider>
  ),
});

type Rsvp = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  event_name: string;
  guests: string;
  notes: string | null;
  status: string;
  created_at: string;
};

function useRsvps() {
  return useQuery({
    queryKey: ["event-rsvps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_rsvps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Rsvp[];
    },
  });
}

function csvCell(value: string | null) {
  const v = (value ?? "").replace(/"/g, '""');
  return `"${v}"`;
}

function RsvpAdmin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: rsvps, isLoading } = useRsvps();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("event_rsvps").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-rsvps"] }),
  });

  const setStatus = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase.from("event_rsvps").update({ status }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["event-rsvps"] });
      toast.success(
        vars.status === "reviewed"
          ? `Marked ${vars.ids.length} as reviewed`
          : `Reopened ${vars.ids.length}`,
      );
    },
    onError: () => toast.error("Couldn't update those RSVPs."),
  });

  const gate = useAdminGate("rsvps.view");

  const events = useMemo(
    () => Array.from(new Set((rsvps ?? []).map((r) => r.event_name))).sort(),
    [rsvps],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
    const toTime = to ? new Date(`${to}T23:59:59`).getTime() : null;
    return (rsvps ?? []).filter((r) => {
      const t = new Date(r.created_at).getTime();
      if (fromTime !== null && t < fromTime) return false;
      if (toTime !== null && t > toTime) return false;
      if (event !== "all" && r.event_name !== event) return false;
      if (!q) return true;
      return `${r.full_name} ${r.email} ${r.company ?? ""} ${r.phone ?? ""} ${r.event_name}`
        .toLowerCase()
        .includes(q);
    });
  }, [rsvps, search, event, from, to]);

  const active = useMemo(
    () => (rsvps ?? []).find((r) => r.id === openId) ?? null,
    [rsvps, openId],
  );

  const selectedRows = useMemo(
    () => filtered.filter((r) => selected.includes(r.id)),
    [filtered, selected],
  );

  function exportCsv(rows: Rsvp[] = filtered) {
    const header = ["Submitted", "Name", "Email", "Phone", "Company", "Event", "Attendees", "Notes"];
    const lines = rows.map((r) =>
      [
        format(new Date(r.created_at), "yyyy-MM-dd HH:mm"),
        r.full_name,
        r.email,
        r.phone ?? "",
        r.company ?? "",
        r.event_name,
        r.guests,
        r.notes ?? "",
      ]
        .map(csvCell)
        .join(","),
    );
    const csv = [header.map(csvCell).join(","), ...lines].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `noqoody-rsvps-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(`Exported ${rows.length} RSVP${rows.length === 1 ? "" : "s"}`);
  }

  if (gate) return gate;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Event RSVPs</h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="rsvp-search" className="text-xs font-semibold text-muted-foreground">
              Search
            </label>
            <Input
              id="rsvp-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, company…"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="rsvp-event" className="text-xs font-semibold text-muted-foreground">
              Event
            </label>
            <select
              id="rsvp-event"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All events</option>
              {events.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rsvp-from" className="text-xs font-semibold text-muted-foreground">
              From
            </label>
            <Input id="rsvp-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label htmlFor="rsvp-to" className="text-xs font-semibold text-muted-foreground">
              To
            </label>
            <Input id="rsvp-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} of {rsvps?.length ?? 0} submissions
            {selected.length > 0 && ` · ${selected.length} selected`}
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.length > 0 && (
              <>
                <Button variant="outline" onClick={() => exportCsv(selectedRows)}>
                  <Download className="mr-1 h-4 w-4" />
                  Export selected ({selected.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatus.mutate({ ids: selected, status: "reviewed" })}
                  disabled={setStatus.isPending}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Mark reviewed
                </Button>
              </>
            )}
            <Button onClick={() => exportCsv(filtered)} disabled={filtered.length === 0}>
              <Download className="mr-1 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
            No RSVPs match these filters yet.
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Event RSVP submissions</caption>
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    <Checkbox
                      aria-label="Select all filtered RSVPs"
                      checked={selected.length > 0 && selected.length === filtered.length}
                      onCheckedChange={(v) => setSelected(v ? filtered.map((r) => r.id) : [])}
                    />
                  </th>
                  <th scope="col" className="px-4 py-3">Submitted</th>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Event</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="px-4 py-3">
                      <Checkbox
                        aria-label={`Select RSVP from ${r.full_name}`}
                        checked={selected.includes(r.id)}
                        onCheckedChange={(v) =>
                          setSelected((prev) =>
                            v ? [...prev, r.id] : prev.filter((id) => id !== r.id),
                          )
                        }
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {format(new Date(r.created_at), "d MMM yyyy, HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{r.full_name}</span>
                      {r.company && <span className="block text-xs text-muted-foreground">{r.company}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <a className="text-primary hover:underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                      {r.phone && <span className="block text-xs text-muted-foreground">{r.phone}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{r.event_name}</Badge>
                      {r.notes && <span className="mt-1 block text-xs text-muted-foreground">{r.notes}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.status === "reviewed" ? "default" : "outline"}>
                        {r.status === "reviewed" ? "Reviewed" : "New"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`View details for ${r.full_name}`}
                        onClick={() => setOpenId(r.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete RSVP from ${r.full_name}`}
                        onClick={() => {
                          if (confirm(`Delete RSVP from ${r.full_name}?`)) remove.mutate(r.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.full_name}</SheetTitle>
                <SheetDescription>
                  Submitted {format(new Date(active.created_at), "d MMM yyyy, HH:mm")}
                </SheetDescription>
              </SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                {[
                  ["Email", active.email],
                  ["Phone", active.phone ?? "—"],
                  ["Company", active.company ?? "—"],
                  ["Event", active.event_name],
                  ["Attendees", active.guests],
                  ["Notes", active.notes ?? "—"],
                  ["Status", active.status === "reviewed" ? "Reviewed" : "New"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-0.5 break-words text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    setStatus.mutate({
                      ids: [active.id],
                      status: active.status === "reviewed" ? "new" : "reviewed",
                    })
                  }
                  disabled={setStatus.isPending}
                >
                  <Check className="mr-1 h-4 w-4" />
                  {active.status === "reviewed" ? "Mark as new" : "Mark reviewed"}
                </Button>
                <Button variant="outline" onClick={() => exportCsv([active])}>
                  <Download className="mr-1 h-4 w-4" />
                  Export row
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
