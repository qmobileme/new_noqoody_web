import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useAdminGate } from "@/components/admin/AdminGate";
import { useAllPosts, useCreatePost } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { parseImport, findDuplicateSlugs, CSV_TEMPLATE } from "@/lib/post-import";
import { ArrowLeft, Loader2, Upload, Download, AlertTriangle, CheckCircle2, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/import")({
  head: () => ({
    meta: [
      { title: "Bulk import — Noqoody Blog Admin" },
      { name: "description", content: "Import multiple bilingual blog posts at once from CSV or JSON." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Bulk import — Noqoody Blog Admin" },
      { property: "og:description", content: "Import multiple bilingual blog posts at once from CSV or JSON." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <BulkImport />
    </AuthProvider>
  ),
});

function BulkImport() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: posts } = useAllPosts();
  const createPost = useCreatePost();

  const [text, setText] = useState("");
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dryRun, setDryRun] = useState<{
    checkedAt: string;
    rows: { line: number; slug: string; title: string; status: string; issues: string[] }[];
    ready: number;
  } | null>(null);

  const gate = useAdminGate("posts.import");

  const parsed = useMemo(() => parseImport(text), [text]);
  // Any edit invalidates a previous dry run so an import can never use a stale report.
  useEffect(() => {
    setDryRun(null);
  }, [text, skipDuplicates]);

  const duplicates = useMemo(
    () => findDuplicateSlugs(parsed.rows, posts?.map((p) => p.slug) ?? []),
    [parsed.rows, posts],
  );
  const rowErrors = parsed.rows.flatMap((r) => r.errors);
  const importable = parsed.rows.filter(
    (r) => r.errors.length === 0 && !(skipDuplicates && duplicates.has((r.post.slug || "").toLowerCase())),
  );

  if (gate) return gate;

  const handleFile = async (file: File) => {
    setText(await file.text());
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "noqoody-blog-import-template.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const runDryRun = () => {
    const rows = parsed.rows.map((r, i) => {
      const slug = (r.post.slug || "").toLowerCase();
      const dupe = duplicates.has(slug);
      const issues = [...r.errors];
      if (!r.post.title_ar || !r.post.content_ar) issues.push("No Arabic translation — English only");
      if (!r.post.meta_description_en) issues.push("Missing English meta description");
      if (!r.post.category) issues.push("No category — will default to general");
      if (dupe) issues.push(skipDuplicates ? "Duplicate slug — row will be skipped" : "Duplicate slug");
      const status = r.errors.length
        ? "Blocked"
        : dupe && skipDuplicates
          ? "Skipped"
          : issues.length
            ? "Ready with warnings"
            : "Ready";
      return { line: i + 1, slug: r.post.slug || "—", title: r.post.title_en || "—", status, issues };
    });
    setDryRun({ checkedAt: new Date().toISOString(), rows, ready: importable.length });
    const blocked = rows.filter((r) => r.status === "Blocked").length;
    if (blocked) toast.error(`${blocked} row${blocked === 1 ? "" : "s"} cannot be imported`);
    else toast.success(`Dry run passed — ${importable.length} rows ready`);
  };

  const downloadReport = () => {
    if (!dryRun) return;
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      "row,slug,title,status,issues",
      ...dryRun.rows.map((r) =>
        [r.line, esc(r.slug), esc(r.title), esc(r.status), esc(r.issues.join(" | "))].join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "import-dry-run-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = async () => {
    if (!importable.length || !dryRun) return;
    setImporting(true);
    setProgress({ done: 0, total: importable.length });
    let ok = 0;
    const failures: string[] = [];
    for (const row of importable) {
      try {
        await createPost.mutateAsync(row.post);
        ok++;
      } catch (err) {
        failures.push(`${row.post.slug}: ${err instanceof Error ? err.message : "failed"}`);
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setImporting(false);
    if (ok) toast.success(`${ok} post${ok === 1 ? "" : "s"} imported`);
    if (failures.length) toast.error(`${failures.length} failed — ${failures[0]}`);
    if (ok && !failures.length) {
      setText("");
      navigate({ to: "/admin" });
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
            <span className="font-semibold text-foreground">Bulk import</span>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-1" />
            CSV template
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <section className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div>
            <h1 className="font-semibold text-foreground">Paste CSV or JSON</h1>
            <p className="text-sm text-muted-foreground">
              Every row becomes a post. Supported columns: title_en, title_ar, slug, excerpt_en,
              excerpt_ar, content_en, content_ar, meta_description_en, meta_description_ar,
              featured_image, keywords, category, author, published. Only title_en and content_en are
              required — slugs are generated from the title when missing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Label
              htmlFor="import-file"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border cursor-pointer text-sm hover:border-primary transition-colors"
            >
              <Upload className="h-4 w-4" />
              Choose .csv or .json file
            </Label>
            <input
              id="import-file"
              type="file"
              accept=".csv,.json,text/csv,application/json"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
            <div className="flex items-center gap-2">
              <Switch id="skip-dupes" checked={skipDuplicates} onCheckedChange={setSkipDuplicates} />
              <Label htmlFor="skip-dupes" className="text-sm text-muted-foreground">
                Skip rows whose slug already exists
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="import-text">Import data</Label>
            <Textarea
              id="import-text"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='title_en,content_en&#10;"My post","<p>Hello</p>"'
              className="font-mono text-xs"
            />
          </div>
        </section>

        {parsed.fatal && text.trim() && (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            {parsed.fatal}
          </p>
        )}

        {parsed.rows.length > 0 && (
          <section className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-semibold text-foreground">Preview</h2>
              <Badge variant="secondary">{parsed.rows.length} rows found</Badge>
              <Badge>{importable.length} ready to import</Badge>
              {duplicates.size > 0 && <Badge variant="outline">{duplicates.size} duplicate slugs</Badge>}
              {rowErrors.length > 0 && <Badge variant="destructive">{rowErrors.length} errors</Badge>}
            </div>

            {rowErrors.length > 0 && (
              <ul className="text-sm text-destructive space-y-1">
                {rowErrors.slice(0, 8).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-3">Title</th>
                    <th className="py-2 pr-3">Slug</th>
                    <th className="py-2 pr-3">Arabic</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.map((r, i) => {
                    const dupe = duplicates.has((r.post.slug || "").toLowerCase());
                    return (
                      <tr key={`${r.post.slug}-${i}`} className="border-t border-border">
                        <td className="py-2 pr-3 max-w-[220px] truncate text-foreground">
                          {r.post.title_en || "—"}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">{r.post.slug}</td>
                        <td className="py-2 pr-3">
                          {r.post.title_ar ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" aria-label="Arabic included" />
                          ) : (
                            <span className="text-xs text-muted-foreground">EN only</span>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">{r.post.category}</td>
                        <td className="py-2 pr-3">
                          {r.errors.length ? (
                            <Badge variant="destructive">Error</Badge>
                          ) : dupe ? (
                            <Badge variant="outline">{skipDuplicates ? "Skipped" : "Duplicate"}</Badge>
                          ) : (
                            <Badge variant={r.post.published ? "default" : "secondary"}>
                              {r.post.published ? "Publish" : "Draft"}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {dryRun && (
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-foreground">Dry-run report</h3>
                  <Badge variant="secondary">{dryRun.rows.length} rows checked</Badge>
                  <Badge>{dryRun.ready} importable</Badge>
                  <Button variant="outline" size="sm" className="ml-auto" onClick={downloadReport}>
                    <Download className="h-4 w-4 mr-1" />
                    Download report
                  </Button>
                </div>
                <ul className="space-y-1 text-sm max-h-64 overflow-y-auto">
                  {dryRun.rows.map((r) => (
                    <li key={`${r.line}-${r.slug}`} className="flex flex-wrap items-start gap-2">
                      <Badge
                        variant={
                          r.status === "Blocked"
                            ? "destructive"
                            : r.status === "Ready"
                              ? "default"
                              : "outline"
                        }
                      >
                        Row {r.line}: {r.status}
                      </Badge>
                      <span className="text-foreground">{r.title}</span>
                      {r.issues.length > 0 && (
                        <span className="text-muted-foreground">{r.issues.join(" · ")}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={runDryRun} disabled={importing}>
                <ClipboardCheck className="h-4 w-4 mr-1" />
                Run dry-run validation
              </Button>
              <Button
                onClick={handleImport}
                disabled={importing || importable.length === 0 || !dryRun}
                title={dryRun ? undefined : "Run the dry-run validation first"}
              >
                {importing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                Import {importable.length} post{importable.length === 1 ? "" : "s"}
              </Button>
              {!dryRun && (
                <span className="text-sm text-muted-foreground">
                  Validate the rows before importing.
                </span>
              )}
              {importing && (
                <span className="text-sm text-muted-foreground" role="status">
                  {progress.done}/{progress.total} imported…
                </span>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
