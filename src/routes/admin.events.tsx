import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEvents, useSaveEvent, useDeleteEvent } from "@/hooks/useCatalog";
import type { SiteEvent } from "@/lib/catalog-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/admin-form";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [
      { title: "Events — Noqoody Admin" },
      { name: "description", content: "Create and publish Noqoody events." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Events — Noqoody Admin" },
      { property: "og:description", content: "Create and publish Noqoody events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AdminEventsPage />
    </AuthProvider>
  ),
});

const EMPTY: Partial<SiteEvent> = { title: "", slug: "", summary: "", description: "", location: "", published: false };

function AdminEventsPage() {
  const gate = useAdminGate("events.manage");
  const { data: events = [], isLoading } = useEvents();
  const save = useSaveEvent();
  const remove = useDeleteEvent();
  const [draft, setDraft] = useState<Partial<SiteEvent> | null>(null);

  if (gate) return gate;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft?.title) return;
    try {
      await save.mutateAsync({
        ...draft,
        title: draft.title,
        slug: draft.slug?.trim() || slugify(draft.title),
        starts_at: draft.starts_at || null,
        ends_at: draft.ends_at || null,
      });
      toast.success("Event saved");
      setDraft(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AdminShell
      title="Events"
      description="Everything published here appears on the public Events page."
      actions={
        <Button onClick={() => setDraft({ ...EMPTY })}>
          <Plus className="mr-1 h-4 w-4" /> New event
        </Button>
      }
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-semibold">{ev.title}</h2>
                  <Badge variant={ev.published ? "default" : "secondary"}>
                    {ev.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {[ev.location, ev.starts_at ? new Date(ev.starts_at).toLocaleDateString() : null]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setDraft(ev)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!confirm(`Delete "${ev.title}"?`)) return;
                    await remove.mutateAsync(ev.id);
                    toast.success("Event deleted");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
          {!events.length ? <p className="text-sm text-muted-foreground">No events yet.</p> : null}
        </ul>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit event" : "New event"}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <form className="space-y-3" onSubmit={submit}>
              <div>
                <Label htmlFor="ev-title">Title</Label>
                <Input
                  id="ev-title"
                  value={draft.title ?? ""}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ev-slug">Slug (optional)</Label>
                <Input
                  id="ev-slug"
                  value={draft.slug ?? ""}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                  placeholder="auto from title"
                />
              </div>
              <div>
                <Label htmlFor="ev-loc">Location / cadence</Label>
                <Input
                  id="ev-loc"
                  value={draft.location ?? ""}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  placeholder="Doha — quarterly"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ev-start">Starts</Label>
                  <Input
                    id="ev-start"
                    type="datetime-local"
                    value={draft.starts_at ? String(draft.starts_at).slice(0, 16) : ""}
                    onChange={(e) =>
                      setDraft({ ...draft, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ev-end">Ends</Label>
                  <Input
                    id="ev-end"
                    type="datetime-local"
                    value={draft.ends_at ? String(draft.ends_at).slice(0, 16) : ""}
                    onChange={(e) =>
                      setDraft({ ...draft, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="ev-summary">Summary</Label>
                <Textarea
                  id="ev-summary"
                  rows={2}
                  value={draft.summary ?? ""}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ev-desc">Full description</Label>
                <Textarea
                  id="ev-desc"
                  rows={4}
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ev-cover">Cover image URL</Label>
                  <Input
                    id="ev-cover"
                    value={draft.cover_image ?? ""}
                    onChange={(e) => setDraft({ ...draft, cover_image: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ev-reg">Registration link</Label>
                  <Input
                    id="ev-reg"
                    value={draft.registration_url ?? ""}
                    onChange={(e) => setDraft({ ...draft, registration_url: e.target.value })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Published on the public site
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={save.isPending}>
                  {save.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null} Save
                </Button>
              </div>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
