import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useOrderProducts, useSaveOrderProduct, useDeleteOrderProduct } from "@/hooks/useCatalog";
import type { OrderProduct } from "@/lib/catalog-types";
import { arrayToLines, linesToArray, slugify } from "@/lib/admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/order-products")({
  head: () => ({
    meta: [
      { title: "Order Now list — Noqoody Admin" },
      { name: "description", content: "Manage the devices shown on the Order Now page." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Order Now list — Noqoody Admin" },
      { property: "og:description", content: "Manage the devices shown on the Order Now page." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AdminOrderProductsPage />
    </AuthProvider>
  ),
});

type Draft = Partial<OrderProduct> & { specsText?: string };

const EMPTY: Draft = {
  name: "",
  slug: "",
  image: "",
  description: "",
  specsText: "",
  min_quantity: 1,
  max_quantity: 50,
  active: true,
  sort_order: 0,
};

function AdminOrderProductsPage() {
  const gate = useAdminGate("orders.manage");
  const { data: products = [], isLoading } = useOrderProducts();
  const save = useSaveOrderProduct();
  const remove = useDeleteOrderProduct();
  const [draft, setDraft] = useState<Draft | null>(null);

  if (gate) return gate;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft?.name) return;
    const { specsText, ...rest } = draft;
    try {
      await save.mutateAsync({
        ...rest,
        name: draft.name,
        slug: draft.slug?.trim() || slugify(draft.name),
        specs: linesToArray(specsText ?? ""),
      });
      toast.success("Device saved");
      setDraft(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <AdminShell
      title="Order Now list"
      description="These devices and quantity limits drive the public Order Now page."
      actions={
        <Button onClick={() => setDraft({ ...EMPTY })}>
          <Plus className="mr-1 h-4 w-4" /> New device
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
                {p.image ? <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-contain" /> : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-semibold">{p.name}</h2>
                    <Badge variant={p.active ? "default" : "secondary"}>{p.active ? "Live" : "Hidden"}</Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.min_quantity}–{p.max_quantity} units
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDraft({ ...p, specsText: arrayToLines(p.specs) })}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (!confirm(`Delete ${p.name}?`)) return;
                    await remove.mutateAsync(p.id);
                    toast.success("Device deleted");
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
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.id ? `Edit ${draft.name}` : "New device"}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <form className="space-y-3" onSubmit={submit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="o-name">Name</Label>
                  <Input
                    id="o-name"
                    value={draft.name ?? ""}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="o-slug">Slug</Label>
                  <Input
                    id="o-slug"
                    value={draft.slug ?? ""}
                    onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                    placeholder="auto from name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="o-img">Image URL</Label>
                <Input
                  id="o-img"
                  value={draft.image ?? ""}
                  onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                  placeholder="/order-devices/A920Pro.png"
                />
              </div>
              <div>
                <Label htmlFor="o-desc">Description</Label>
                <Textarea
                  id="o-desc"
                  rows={2}
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="o-specs">Spec bullets — one per line</Label>
                <Textarea
                  id="o-specs"
                  rows={5}
                  value={draft.specsText ?? ""}
                  onChange={(e) => setDraft({ ...draft, specsText: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label htmlFor="o-min">Min qty</Label>
                  <Input
                    id="o-min"
                    type="number"
                    value={draft.min_quantity ?? 1}
                    onChange={(e) => setDraft({ ...draft, min_quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="o-max">Max qty</Label>
                  <Input
                    id="o-max"
                    type="number"
                    value={draft.max_quantity ?? 50}
                    onChange={(e) => setDraft({ ...draft, max_quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="o-order">Sort order</Label>
                  <Input
                    id="o-order"
                    type="number"
                    value={draft.sort_order ?? 0}
                    onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.active ?? true}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                />
                Show on the Order Now page
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
