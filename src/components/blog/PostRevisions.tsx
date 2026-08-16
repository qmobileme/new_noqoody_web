import { useState } from "react";
import { usePostRevisions, type BlogRevision } from "@/hooks/useBlogPosts";
import { History, Loader2, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const FIELD_LABELS: Record<string, string> = {
  title_en: "English title",
  title_ar: "Arabic title",
  excerpt_en: "English excerpt",
  excerpt_ar: "Arabic excerpt",
  content_en: "English content",
  content_ar: "Arabic content",
  meta_description_en: "English meta description",
  meta_description_ar: "Arabic meta description",
  featured_image: "Cover image",
  keywords: "Keywords",
  category: "Category",
  author: "Author",
  slug: "Slug",
  published: "Publish state",
  published_at: "Publish date",
  scheduled_at: "Schedule",
};

export function fieldLabel(field: string) {
  return FIELD_LABELS[field] ?? field;
}

const ACTION_STYLES: Record<string, string> = {
  created: "bg-primary/10 text-primary",
  updated: "bg-muted text-muted-foreground",
  published: "bg-emerald-500/10 text-emerald-600",
  unpublished: "bg-amber-500/10 text-amber-600",
  deleted: "bg-destructive/10 text-destructive",
};

/** Version history + activity log for one post, with restore-into-editor. */
export function PostRevisions({
  postId,
  onRestore,
}: {
  postId: string | undefined;
  onRestore?: (snapshot: Record<string, unknown>) => void;
}) {
  const { data: revisions, isLoading } = usePostRevisions(postId);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!postId) return null;

  return (
    <section className="p-6 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-foreground">Version history</h2>
      </div>

      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      {!isLoading && !revisions?.length && (
        <p className="text-sm text-muted-foreground">
          No changes recorded yet — the next save will create the first version.
        </p>
      )}

      <ol className="space-y-2">
        {revisions?.map((rev: BlogRevision) => {
          const open = openId === rev.id;
          const snapshot = (rev.snapshot ?? {}) as Record<string, unknown>;
          return (
            <li key={rev.id} className="rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : rev.id)}
                aria-expanded={open}
                className="w-full flex items-start justify-between gap-3 px-3 py-2 text-left"
              >
                <span className="space-y-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${ACTION_STYLES[rev.action] ?? ACTION_STYLES["updated"]}`}
                    >
                      {rev.action}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(rev.created_at), "d MMM yyyy, HH:mm")}
                    </span>
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {rev.changed_fields.length
                      ? rev.changed_fields.map(fieldLabel).join(", ")
                      : "Initial version"}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
                  <dl className="grid grid-cols-1 gap-1 text-xs">
                    {(rev.changed_fields.length
                      ? rev.changed_fields
                      : ["title_en", "category", "keywords"]
                    ).map((f) => (
                      <div key={f} className="flex gap-2">
                        <dt className="text-muted-foreground shrink-0">{fieldLabel(f)}:</dt>
                        <dd className="text-foreground line-clamp-2 break-all">
                          {formatValue(snapshot[f])}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {onRestore && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onRestore(snapshot)}
                      className="gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Load this version into the editor
                    </Button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const text = String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 180 ? `${text.slice(0, 180)}…` : text || "—";
}
