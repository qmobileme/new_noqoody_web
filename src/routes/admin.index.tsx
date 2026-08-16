import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAllPosts, useDeletePost, useUpdatePost } from "@/hooks/useBlogPosts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Loader2,
  LogOut,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Mail,
  MailOpen,
  FileText,
  Search,
  X,
  Users,
  Upload,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { regenerateFeeds, type FeedTarget } from "@/lib/feeds.functions";
import noqoodyLogo from "@/assets/noqoody-logo.svg";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Blog Admin — Noqoody" },
      { name: "description", content: "Manage Noqoody blog posts and contact messages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Blog Admin — Noqoody" },
      { property: "og:description", content: "Manage Noqoody blog posts and contact messages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  ),
});

function useContactSubmissions() {
  return useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { error } = await supabase.from("contact_submissions").update({ read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-submissions"] }),
  });
}

function useDeleteSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-submissions"] }),
  });
}

function AdminDashboard() {
  const { can, roles, signOut } = useAuth();
  const canPublish = can("posts.publish");
  const canImport = can("posts.import");
  const canManageAuthors = can("authors.manage");
  const canRegenerate = can("feeds.regenerate");
  const navigate = useNavigate();
  const { data: posts, isLoading } = useAllPosts();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const { data: submissions, isLoading: subsLoading } = useContactSubmissions();
  const markRead = useMarkRead();
  const deleteSubmission = useDeleteSubmission();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set((posts ?? []).map((p) => (p.category || "general").toLowerCase()));
    return Array.from(set).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter((p) => {
      const matchesQuery =
        !q ||
        p.title_en.toLowerCase().includes(q) ||
        (p.title_ar || "").toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q);
      const matchesCategory = category === "all" || (p.category || "general").toLowerCase() === category;
      const matchesStatus =
        status === "all" ||
        (status === "published" && p.published) ||
        (status === "draft" && !p.published && !p.scheduled_at) ||
        (status === "scheduled" && !p.published && !!p.scheduled_at);
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [posts, query, status, category]);

  const filtersActive = !!query.trim() || status !== "all" || category !== "all";

  const runRegenerate = useServerFn(regenerateFeeds);
  const [regenerating, setRegenerating] = useState(false);
  const [feedReport, setFeedReport] = useState<{ generatedAt: string; targets: FeedTarget[] } | null>(
    null,
  );

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const report = await runRegenerate({ data: undefined });
      setFeedReport(report);
      const failed = report.targets.filter((t) => !t.ok);
      if (failed.length) toast.error(`${failed.map((f) => f.label).join(", ")} could not be rebuilt`);
      else toast.success("Sitemap and RSS regenerated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not regenerate feeds");
    } finally {
      setRegenerating(false);
    }
  };

  const gate = useAdminGate("posts.edit");

  if (gate) return gate;

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      await updatePost.mutateAsync({
        id,
        published: !published,
        published_at: !published ? new Date().toISOString() : null,
      });
      toast.success(!published ? "Post published" : "Post unpublished");
    } catch {
      toast.error("Failed to update post");
    }
  };

  const unreadCount = submissions?.filter((s) => !s.read).length || 0;

  return (
    <AdminShell
      title="Dashboard & posts"
      description="Manage blog posts and incoming messages."
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to="/blog">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Blog
          </Link>
        </Button>
      }
    >
      <div className="max-w-5xl">
        <Tabs defaultValue="posts">
          <TabsList className="mb-6">
            <TabsTrigger value="posts" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Posts ({posts?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-1.5">
              <Mail className="h-4 w-4" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
                <p className="text-sm text-muted-foreground">
                  {filtersActive
                    ? `${filteredPosts.length} of ${posts?.length || 0} posts`
                    : `${posts?.length || 0} total posts`}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {canManageAuthors && (
                  <Button asChild variant="outline">
                    <Link to="/admin/authors">
                      <Users className="h-4 w-4 mr-1" />
                      Authors
                    </Link>
                  </Button>
                )}
                {canImport && (
                  <Button asChild variant="outline">
                    <Link to="/admin/import">
                      <Upload className="h-4 w-4 mr-1" />
                      Bulk import
                    </Link>
                  </Button>
                )}
                {canRegenerate && (
                  <Button variant="outline" onClick={handleRegenerate} disabled={regenerating}>
                    <RefreshCw className={`h-4 w-4 mr-1 ${regenerating ? "animate-spin" : ""}`} />
                    Regenerate sitemap &amp; RSS
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link to="/admin/rsvps">Event RSVPs</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/admin/activity">Activity log</Link>
                </Button>
                <Button asChild>
                  <Link to="/admin/posts/$id" params={{ id: "new" }}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Post
                  </Link>
                </Button>
              </div>
            </div>

            {feedReport && (
              <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
                <p className="font-medium text-foreground">
                  Feeds rebuilt {format(new Date(feedReport.generatedAt), "MMM d, yyyy HH:mm")}
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {feedReport.targets.map((t) => (
                    <li key={t.path} className="flex flex-wrap items-center gap-2">
                      <Badge variant={t.ok ? "default" : "destructive"}>{t.ok ? "OK" : "Failed"}</Badge>
                      <span className="text-foreground">{t.label}</span>
                      <a
                        href={t.path}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {t.path}
                      </a>
                      <span>
                        {t.urls} entries · {(t.bytes / 1024).toFixed(1)} KB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <label htmlFor="post-search" className="sr-only">
                  Search posts by title, slug, category or author
                </label>
                <Input
                  id="post-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, slug, category or author…"
                  className="pl-9"
                />
              </div>
              <label htmlFor="filter-status" className="sr-only">
                Filter by status
              </label>
              <select
                id="filter-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <label htmlFor="filter-category" className="sr-only">
                Filter by category
              </label>
              <select
                id="filter-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground capitalize"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {filtersActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setStatus("all");
                    setCategory("all");
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {isLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && posts && posts.length === 0 && (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-4">No blog posts yet</p>
                <Button asChild>
                  <Link to="/admin/posts/$id" params={{ id: "new" }}>
                    Create your first post
                  </Link>
                </Button>
              </div>
            )}

            {posts && posts.length > 0 && filteredPosts.length === 0 && (
              <div className="text-center py-16 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">No posts match these filters.</p>
              </div>
            )}

            {filteredPosts.length > 0 && (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                  >
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt=""
                        className="h-16 w-24 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-24 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">N</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-medium text-foreground truncate">{post.title_en}</h2>
                      <p className="text-xs text-muted-foreground truncate">/blog/{post.slug}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        {!post.published && post.scheduled_at && (
                          <Badge variant="outline">
                            Scheduled {format(new Date(post.scheduled_at), "MMM d, HH:mm")}
                          </Badge>
                        )}
                        {post.category && (
                          <span className="text-xs text-muted-foreground capitalize">{post.category}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                     <div className="flex items-center gap-1 flex-shrink-0">
                      {canPublish && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePublish(post.id, !!post.published)}
                          title={post.published ? "Unpublish" : "Publish"}
                          aria-label={post.published ? "Unpublish post" : "Publish post"}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin/posts/$id" params={{ id: post.id }} aria-label="Edit post">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete post"
                        onClick={() => handleDelete(post.id, post.title_en)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
              <p className="text-sm text-muted-foreground">
                {submissions?.length || 0} messages · {unreadCount} unread
              </p>
            </div>

            {subsLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!subsLoading && submissions && submissions.length === 0 && (
              <div className="text-center py-20 border border-dashed border-border rounded-xl">
                <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            )}

            {submissions && submissions.length > 0 && (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-5 rounded-xl border bg-card ${
                      sub.read ? "border-border" : "border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{sub.name}</span>
                          {!sub.read && (
                            <Badge variant="default" className="text-[10px] h-5">
                              New
                            </Badge>
                          )}
                        </div>
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-sm text-primary hover:underline break-all"
                        >
                          {sub.email}
                        </a>
                        <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                          {sub.message}
                        </p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {format(new Date(sub.created_at), "MMM d, yyyy · HH:mm")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={sub.read ? "Mark as unread" : "Mark as read"}
                          onClick={() => markRead.mutate({ id: sub.id, read: !sub.read })}
                        >
                          {sub.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete message"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Delete this message?")) deleteSubmission.mutate(sub.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminShell>
  );
}
