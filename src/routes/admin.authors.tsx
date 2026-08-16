import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { useAuthors, useSaveAuthor, useDeleteAuthor, type BlogAuthor } from "@/hooks/useAuthors";
import { useAllPosts } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Plus, Trash2, Pencil, UserRound, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/authors")({
  head: () => ({
    meta: [
      { title: "Authors — Noqoody Blog Admin" },
      { name: "description", content: "Create and edit blog authors and see their assigned posts." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Authors — Noqoody Blog Admin" },
      { property: "og:description", content: "Create and edit blog authors and see their assigned posts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AuthorsPanel />
    </AuthProvider>
  ),
});

const EMPTY = {
  id: "",
  name: "",
  title_en: "",
  title_ar: "",
  bio_en: "",
  bio_ar: "",
  avatar_url: "",
  email: "",
};

function AuthorsPanel() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: authors, isLoading } = useAuthors();
  const { data: posts } = useAllPosts();
  const saveAuthor = useSaveAuthor();
  const deleteAuthor = useDeleteAuthor();
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(false);

  const gate = useAdminGate("authors.manage");

  if (gate) return gate;

  const countFor = (name: string) =>
    posts?.filter((p) => (p.author || "").toLowerCase() === name.toLowerCase()).length ?? 0;

  const startEdit = (a: BlogAuthor) => {
    setForm({
      id: a.id,
      name: a.name,
      title_en: a.title_en ?? "",
      title_ar: a.title_ar ?? "",
      bio_en: a.bio_en ?? "",
      bio_ar: a.bio_ar ?? "",
      avatar_url: a.avatar_url ?? "",
      email: a.email ?? "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Author name is required");
      return;
    }
    try {
      await saveAuthor.mutateAsync({
        ...(form.id ? { id: form.id } : {}),
        name: form.name.trim(),
        title_en: form.title_en || null,
        title_ar: form.title_ar || null,
        bio_en: form.bio_en || null,
        bio_ar: form.bio_ar || null,
        avatar_url: form.avatar_url || null,
        email: form.email || null,
      });
      toast.success(form.id ? "Author updated" : "Author created");
      setForm(EMPTY);
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save author");
    }
  };

  const handleDelete = async (a: BlogAuthor) => {
    const assigned = countFor(a.name);
    const warning = assigned
      ? `${a.name} is assigned to ${assigned} post(s). Those posts keep the name but lose the profile. Delete anyway?`
      : `Delete ${a.name}?`;
    if (!confirm(warning)) return;
    try {
      await deleteAuthor.mutateAsync(a.id);
      toast.success("Author deleted");
    } catch {
      toast.error("Failed to delete author");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin" aria-label="Back to admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="font-semibold text-foreground">Authors</span>
          </div>
          <Button
            onClick={() => {
              setForm(EMPTY);
              setEditing(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            New author
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && authors && authors.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <UserRound className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No authors yet — create your first one.</p>
            </div>
          )}

          {authors?.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
              {a.avatar_url ? (
                <img src={a.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                  {a.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{a.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {a.title_en && <span className="text-xs text-muted-foreground">{a.title_en}</span>}
                  <Badge variant="secondary">{countFor(a.name)} posts</Badge>
                  {a.email && <span className="text-xs text-muted-foreground truncate">{a.email}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" aria-label={`Edit ${a.name}`} onClick={() => startEdit(a)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${a.name}`}
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(a)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <aside className="space-y-4 p-6 rounded-xl border border-border bg-card h-fit sticky top-20">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">{form.id ? "Edit author" : "New author"}</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close author form"
                onClick={() => {
                  setEditing(false);
                  setForm(EMPTY);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor="a-name">Name *</Label>
              <Input
                id="a-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Noqoody Team"
              />
            </div>
            <div>
              <Label htmlFor="a-title">Role / title (EN)</Label>
              <Input
                id="a-title"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                placeholder="Head of Payments"
              />
            </div>
            <div dir="rtl">
              <Label htmlFor="a-title-ar">المسمى الوظيفي</Label>
              <Input
                id="a-title-ar"
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="a-bio">Bio (EN)</Label>
              <Textarea
                id="a-bio"
                rows={3}
                value={form.bio_en}
                onChange={(e) => setForm({ ...form, bio_en: e.target.value })}
              />
            </div>
            <div dir="rtl">
              <Label htmlFor="a-bio-ar">نبذة</Label>
              <Textarea
                id="a-bio-ar"
                rows={3}
                value={form.bio_ar}
                onChange={(e) => setForm({ ...form, bio_ar: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="a-avatar">Avatar URL</Label>
              <Input
                id="a-avatar"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="a-email">Email</Label>
              <Input
                id="a-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Button onClick={handleSave} disabled={saveAuthor.isPending} className="w-full">
              {saveAuthor.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              {form.id ? "Save author" : "Create author"}
            </Button>
          </aside>
        )}
      </div>
    </div>
  );
}
