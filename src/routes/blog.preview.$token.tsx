import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogProviders } from "@/components/blog/BlogProviders";
import { useLanguage } from "@/hooks/useLanguage";
import { getDraftPreview } from "@/lib/preview.functions";
import { getReadingTime } from "@/lib/readingTime";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Tag, Columns2 } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/blog/preview/$token")({
  loader: async ({ params }) => getDraftPreview({ data: { token: params.token } }),
  head: () => ({
    meta: [
      { title: "Draft preview — Noqoody Blog" },
      { name: "description", content: "Private preview of an unpublished Noqoody blog draft." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Draft preview — Noqoody Blog" },
      { property: "og:description", content: "Private preview of an unpublished Noqoody blog draft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: () => <PreviewMissing />,
  notFoundComponent: () => <PreviewMissing />,
  component: () => (
    <BlogProviders>
      <DraftPreview />
    </BlogProviders>
  ),
});

function PreviewMissing() {
  return (
    <BlogProviders>
      <BlogHeader />
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-foreground">Preview link not valid</h1>
        <p className="text-muted-foreground max-w-md">
          This preview link has been regenerated or the post was deleted. Ask for a fresh link from the
          blog admin.
        </p>
        <Button asChild variant="outline">
          <Link to="/blog">Back to blog</Link>
        </Button>
      </div>
      <BlogFooter />
    </BlogProviders>
  );
}

function DraftPreview() {
  const result = Route.useLoaderData();
  const { t, lang } = useLanguage();
  const [compare, setCompare] = useState(false);

  if (!result.ok) return <PreviewMissing />;

  const post = result.post;
  const lastPublished = result.lastPublished;
  const title = t(post.title_en, post.title_ar);
  const content = t(post.content_en, post.content_ar) || "";
  const date = post.published_at ?? post.created_at;
  const readTime = getReadingTime(content);

  return (
    <>
      <BlogHeader />

      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container mx-auto px-4 py-3 max-w-4xl flex flex-wrap items-center gap-2 text-sm">
          <Eye className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {post.published ? "Preview of a published post" : "Private draft preview"}
          </span>
          <span className="text-muted-foreground">
            — not indexed by search engines and not listed on the blog.
          </span>
          {lastPublished && (
            <Button
              size="sm"
              variant={compare ? "default" : "outline"}
              className="ms-auto"
              onClick={() => setCompare((v) => !v)}
              aria-pressed={compare}
            >
              <Columns2 className="h-4 w-4 me-1" />
              {compare ? "Show draft only" : "Compare with published"}
            </Button>
          )}
        </div>
      </div>

      {compare && lastPublished && (
        <CompareView
          draft={post}
          published={lastPublished.post}
          capturedAt={lastPublished.capturedAt}
          lang={lang}
        />
      )}

      {!compare && (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-4xl pt-10">
          {post.category && (
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
              {post.category}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-[1.15] mb-6">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span>{date ? format(new Date(date), "d MMM yyyy") : ""}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTime} {lang === "ar" ? "دقيقة" : "min read"}
            </span>
            <span>{post.author}</span>
          </div>

          {post.featured_image && (
            <div className="w-full rounded-xl overflow-hidden mb-12">
              <img src={post.featured_image} alt={title} className="w-full h-auto object-cover" />
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 max-w-3xl pb-16">
          <article className="prose-blog" dangerouslySetInnerHTML={{ __html: content }} />
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              {post.keywords.map((kw: string) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                >
                  <Tag className="h-3 w-3" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
      )}

      <BlogFooter />
    </>
  );
}

function CompareView({
  draft,
  published,
  capturedAt,
  lang,
}: {
  draft: Record<string, unknown>;
  published: Record<string, unknown>;
  capturedAt: string;
  lang: string;
}) {
  const fields = useMemo(
    () =>
      [
        ["Title (EN)", "title_en"],
        ["Title (AR)", "title_ar"],
        ["Slug", "slug"],
        ["Category", "category"],
        ["Author", "author"],
        ["Meta description (EN)", "meta_description_en"],
        ["Excerpt (EN)", "excerpt_en"],
      ] as const,
    [],
  );

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : "—");
  const html = (v: unknown) => (typeof v === "string" ? v : "");
  const isAr = lang === "ar";
  const draftBody = html(isAr ? draft["content_ar"] : draft["content_en"]);
  const pubBody = html(isAr ? published["content_ar"] : published["content_en"]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <p className="text-sm text-muted-foreground">
          Comparing the current draft with the last published version captured{" "}
          {format(new Date(capturedAt), "d MMM yyyy, HH:mm")}.
        </p>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground bg-muted/50">
                <th className="p-3">Field</th>
                <th className="p-3">Published</th>
                <th className="p-3">Draft</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(([label, key]) => {
                const changed = str(draft[key]) !== str(published[key]);
                return (
                  <tr key={key} className="border-t border-border align-top">
                    <td className="p-3 font-medium text-foreground whitespace-nowrap">
                      {label}
                      {changed && (
                        <span className="ms-2 text-[10px] uppercase text-primary">changed</span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{str(published[key])}</td>
                    <td className={`p-3 ${changed ? "text-foreground bg-primary/5" : "text-muted-foreground"}`}>
                      {str(draft[key])}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-4">Published body</h2>
            <article className="prose-blog" dangerouslySetInnerHTML={{ __html: pubBody }} />
          </section>
          <section className="rounded-xl border border-primary/40 p-5 bg-primary/[0.03]">
            <h2 className="font-semibold text-foreground mb-4">Draft body</h2>
            <article className="prose-blog" dangerouslySetInnerHTML={{ __html: draftBody }} />
          </section>
        </div>
      </div>
    </main>
  );
}
