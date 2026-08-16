import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { useBlogActivity, type BlogRevision } from "@/hooks/useBlogPosts";
import { fieldLabel } from "@/components/blog/PostRevisions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, History } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/activity")({
  head: () => ({
    meta: [
      { title: "Blog Activity Log — Noqoody Admin" },
      { name: "description", content: "Audit every blog post edit, publish and translation change." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Blog Activity Log — Noqoody Admin" },
      { property: "og:description", content: "Audit every blog post edit, publish and translation change." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <ActivityLog />
    </AuthProvider>
  ),
});

const ACTIONS = ["all", "created", "updated", "published", "unpublished", "deleted"] as const;

function ActivityLog() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: entries, isLoading } = useBlogActivity(200);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<(typeof ACTIONS)[number]>("all");

  const gate = useAdminGate("activity.view");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (entries ?? []).filter((e: BlogRevision) => {
      if (action !== "all" && e.action !== action) return false;
      if (!q) return true;
      return (
        e.slug.toLowerCase().includes(q) ||
        (e.title_en ?? "").toLowerCase().includes(q) ||
        e.changed_fields.some((f) => fieldLabel(f).toLowerCase().includes(q))
      );
    });
  }, [entries, query, action]);

  if (gate) return gate;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-3 h-14 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin" aria-label="Back to admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <History className="h-4 w-4 text-primary" />
          <h1 className="font-semibold text-foreground">Blog activity log</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="flex flex-wrap gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by article, slug or changed field…"
            className="max-w-sm"
            aria-label="Search activity"
          />
          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <Button
                key={a}
                size="sm"
                variant={action === a ? "default" : "outline"}
                onClick={() => setAction(a)}
                className="capitalize"
                aria-pressed={action === a}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>

        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {!isLoading && !filtered.length && (
          <p className="text-sm text-muted-foreground">No activity matches these filters yet.</p>
        )}

        <ol className="space-y-3">
          {filtered.map((e) => (
            <li key={e.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-foreground">
                  {e.title_en ?? e.slug}{" "}
                  <span className="text-xs font-normal text-muted-foreground capitalize">— {e.action}</span>
                </p>
                <time className="text-xs text-muted-foreground" dateTime={e.created_at}>
                  {format(new Date(e.created_at), "d MMM yyyy, HH:mm")}
                </time>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {e.changed_fields.length
                  ? `Changed: ${e.changed_fields.map(fieldLabel).join(", ")}`
                  : "Initial version"}
              </p>
              <Link
                to="/admin/posts/$id"
                params={{ id: e.slug }}
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                Open in editor
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
