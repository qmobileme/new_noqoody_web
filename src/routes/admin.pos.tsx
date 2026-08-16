import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { usePosProducts, useSavePosProduct, useDeletePosProduct } from "@/hooks/useCatalog";
import type { FeatureBlock, PosProduct } from "@/lib/catalog-types";
import { arrayToLines, linesToArray, linesToSpecs, slugify, specsToLines } from "@/lib/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/pos")({
  head: () => ({
    meta: [
      { title: "POS Library — Noqoody Admin" },
      { name: "description", content: "Manage the Noqoody POS product library and product pages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "POS Library — Noqoody Admin" },
      { property: "og:description", content: "Manage the Noqoody POS product library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AdminPosPage />
    </AuthProvider>
  ),
});

type Draft = Partial<PosProduct> & { specsText?: string; checklistText?: string; galleryText?: string };

const EMPTY: Draft = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  best_for: "",
  hero_image: "",
  accent_color: "#dd8127",
  intro_headline: "Android SmartPOS",
  intro_body: "",
  published: true,
  features: [],
  specsText: "",
  checklistText: "",
  galleryText: "",
};

function AdminPosPage() {
  const gate = useAdminGate("pos.manage");
  const { data: products = [], isLoading } = usePosProducts();
  const save = useSavePosProduct();
  const remove = useDeletePosProduct();
  const [draft, setDraft] = useState<Draft | null>(null);

  if (gate) return gate;

  const openEdit = (p: PosProduct) =>
    setDraft({
      ...p,
      specsText: specsToLines(p.specs),
      checklistText: arrayToLines(p.checklist),
      galleryText: arrayToLines(p.gallery),
    });

  const setFeature = (i: number, patch: Partial<FeatureBlock>) => {
    if (!draft) return;
    const features = [...(draft.features ?? [])];
    features[i] = { ...features[i], ...patch } as FeatureBlock;
    setDraft({ ...draft, features });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft?.name) return;
    const { specsText, checklistText, galleryText, ...rest } = draft;
    try {
      await save.mutateAsync({
        ...rest,
        name: draft.name,
        slug: draft.slug?.trim() || slugify(draft.name),
        specs: linesToSpecs(specsText ?? ""),
        checklist: linesToArray(checklistText ?? ""),
        gallery: linesToArray(galleryText ?? ""),
        features: (draft.features ?? []).filter((f) => f.heading || f.body),
      });
      toast.success("Product saved");
      setDraft(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AdminShell
      title="POS library"
      description="Each product here gets its own public page at /pos-products/<slug>."
      actions={
        <Button onClick={() => setDraft({ ...EMPTY })}>
          <Plus className="mr-1 h-4 w-4" /> New product
        </Button>
      }
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                {p.hero_image ? (
                  <img src={p.hero_image} alt="" className="h-14 w-14 rounded-lg object-contain" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-semibold">{p.name}</h2>
                    <Badge variant={p.published ? "default" : "secondary"}>
                      {p.published ? "Live" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{p.tagline}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/pos-products/$slug" params={{ slug: p.slug }} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!confirm(`Delete ${p.name}?`)) return;
                    await remove.mutateAsync(p.id);
                    toast.success("Product deleted");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{draft?.id ? `Edit ${draft.name}` : "New POS product"}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <form className="space-y-3" onSubmit={submit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="p-name">Name</Label>
                  <Input
                    id="p-name"
                    value={draft.name ?? ""}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="p-slug">Slug</Label>
                  <Input
                    id="p-slug"
                    value={draft.slug ?? ""}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    placeholder="auto from name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="p-tag">Tagline</Label>
                <Input
                  id="p-tag"
                  value={draft.tagline ?? ""}
                  onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="p-desc">Short description</Label>
                <Textarea
                  id="p-desc"
                  rows={2}
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="p-hero">Hero image URL</Label>
                  <Input
                    id="p-hero"
                    value={draft.hero_image ?? ""}
                    onChange={(e) => setDraft({ ...draft, hero_image: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="p-best">Best for</Label>
                  <Input
                    id="p-best"
                    value={draft.best_for ?? ""}
                    onChange={(e) => setDraft({ ...draft, best_for: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="p-head">Intro headline</Label>
                  <Input
                    id="p-head"
                    value={draft.intro_headline ?? ""}
                    onChange={(e) => setDraft({ ...draft, intro_headline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="p-accent">Accent colour</Label>
                  <Input
                    id="p-accent"
                    value={draft.accent_color ?? ""}
                    onChange={(e) => setDraft({ ...draft, accent_color: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="p-intro">Intro body</Label>
                <Textarea
                  id="p-intro"
                  rows={3}
                  value={draft.intro_body ?? ""}
                  onChange={(e) => setDraft({ ...draft, intro_body: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="p-specs">Specs — one “Label: Value” per line</Label>
                <Textarea
                  id="p-specs"
                  rows={5}
                  value={draft.specsText ?? ""}
                  onChange={(e) => setDraft({ ...draft, specsText: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="p-check">Checklist bullets — one per line</Label>
                <Textarea
                  id="p-check"
                  rows={5}
                  value={draft.checklistText ?? ""}
                  onChange={(e) => setDraft({ ...draft, checklistText: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="p-gal">Gallery image URLs — one per line</Label>
                <Textarea
                  id="p-gal"
                  rows={3}
                  value={draft.galleryText ?? ""}
                  onChange={(e) => setDraft({ ...draft, galleryText: e.target.value })}
                />
              </div>

              <fieldset className="rounded-xl border border-border p-3">
                <legend className="px-1 text-sm font-semibold">Feature blocks</legend>
                {(draft.features ?? []).map((f, i) => (
                  <div key={i} className="mb-3 space-y-2 border-b border-border pb-3 last:border-0">
                    <Input
                      value={f.heading ?? ""}
                      placeholder="Heading"
                      onChange={(e) => setFeature(i, { heading: e.target.value })}
                    />
                    <Textarea
                      rows={2}
                      value={f.body ?? ""}
                      placeholder="Body text"
                      onChange={(e) => setFeature(i, { body: e.target.value })}
                    />
                    <Input
                      value={f.image ?? ""}
                      placeholder="Image URL (optional)"
                      onChange={(e) => setFeature(i, { image: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDraft({ ...draft, features: (draft.features ?? []).filter((_, j) => j !== i) })
                      }
                    >
                      Remove block
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setDraft({ ...draft, features: [...(draft.features ?? []), { heading: "", body: "", image: "" }] })
                  }
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add block
                </Button>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="p-sheet">Datasheet URL</Label>
                  <Input
                    id="p-sheet"
                    value={draft.datasheet_url ?? ""}
                    onChange={(e) => setDraft({ ...draft, datasheet_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="p-order">Sort order</Label>
                  <Input
                    id="p-order"
                    type="number"
                    value={draft.sort_order ?? 0}
                    onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.published ?? true}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Visible on the public site
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
