import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogProviders } from "@/components/blog/BlogProviders";
import { NewsletterBanner } from "@/components/blog/NewsletterBanner";
import { usePublishedPosts } from "@/hooks/useBlogPosts";
import { useLanguage } from "@/hooks/useLanguage";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FeaturedHeroCard, ArticleGridCard, ArticleListCard } from "@/components/blog/BlogCard";

const title = "Blog — Payment Insights for Qatar Merchants | Noqoody";
const description =
  "Guides and updates on card acceptance, tap-to-pay, payment links and settlement for merchants in Qatar and the GCC.";
const url = "https://noqoody.lovable.app/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: url },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Noqoody Blog RSS",
        href: "https://noqoody.lovable.app/blog/rss.xml",
      },
    ],
  }),
  component: () => (
    <BlogProviders>
      <BlogListing />
    </BlogProviders>
  ),
});

const PER_PAGE = 6;

type SortKey = "newest" | "oldest" | "popular";

const SORT_LABELS: Record<SortKey, { en: string; ar: string }> = {
  newest: { en: "Newest first", ar: "الأحدث أولاً" },
  oldest: { en: "Oldest first", ar: "الأقدم أولاً" },
  popular: { en: "Most popular", ar: "الأكثر قراءة" },
};

function BlogListing() {
  const { data: posts, isLoading } = usePublishedPosts();
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    if (!posts) return [];
    return Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
  }, [posts]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = search.toLowerCase();
    return posts.filter((p) => {
      const matchSearch =
        !search ||
        p.title_en.toLowerCase().includes(q) ||
        p.title_ar?.toLowerCase().includes(q) ||
        p.keywords?.some((k) => k.toLowerCase().includes(q));
      const matchCat = !selectedCategory || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [posts, search, selectedCategory]);

  const sorted = useMemo(() => {
    const time = (p: (typeof filtered)[number]) =>
      new Date(p.published_at ?? p.created_at).getTime();
    const copy = [...filtered];
    if (sort === "oldest") copy.sort((a, b) => time(a) - time(b));
    else if (sort === "popular") copy.sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0) || time(b) - time(a));
    else copy.sort((a, b) => time(b) - time(a));
    return copy;
  }, [filtered, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, sort]);

  const featured = page === 1 ? sorted[0] || null : null;
  const lastArticles = page === 1 ? sorted.slice(1, 7) : [];
  const allArticles = sorted.slice(7);
  const totalPages = Math.max(1, Math.ceil(allArticles.length / PER_PAGE) || 1);
  const visibleAll =
    page === 1 ? allArticles.slice(0, PER_PAGE) : allArticles.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <BlogHeader />

      <main className="min-h-screen bg-background">
        <section className="pt-10 md:pt-14 pb-6">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-8">
              {lang === "ar" ? "المدونة" : "Blog"}
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <label htmlFor="blog-search" className="sr-only">
                  {lang === "ar" ? "ابحث في المقالات" : "Search articles"}
                </label>
                <Input
                  id="blog-search"
                  placeholder={lang === "ar" ? "ابحث في المقالات..." : "Search articles..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-card"
                />
              </div>
              <div>
                <label htmlFor="blog-sort" className="sr-only">
                  {lang === "ar" ? "ترتيب المقالات" : "Sort articles"}
                </label>
                <select
                  id="blog-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <option key={key} value={key}>
                      {lang === "ar" ? SORT_LABELS[key].ar : SORT_LABELS[key].en}
                    </option>
                  ))}
                </select>
              </div>
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    aria-pressed={!selectedCategory}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      !selectedCategory
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {lang === "ar" ? "الكل" : "All"}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={selectedCategory === cat}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && sorted.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">{lang === "ar" ? "لا توجد مقالات بعد" : "No articles found"}</p>
          </div>
        )}

        {featured && (
          <section className="pb-12 border-b border-border">
            <div className="container mx-auto px-4 max-w-6xl">
              <FeaturedHeroCard post={featured} index={0} />
            </div>
          </section>
        )}

        {lastArticles.length > 0 && (
          <section className="py-12 border-b border-border">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                {lang === "ar" ? "أحدث المقالات" : "Last Articles"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lastArticles.map((post, i) => (
                  <ArticleGridCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterBanner />

        {visibleAll.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                {lang === "ar" ? "جميع المقالات" : "All Articles"}
              </h2>
              <div className="space-y-0 divide-y divide-border">
                {visibleAll.map((post, i) => (
                  <ArticleListCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Blog pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="min-h-10 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40"
                  >
                    {lang === "ar" ? "السابق" : "Previous"}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      aria-current={page === n ? "page" : undefined}
                      className={`min-h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition-colors ${
                        page === n
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="min-h-10 rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40"
                  >
                    {lang === "ar" ? "التالي" : "Next"}
                  </button>
                </nav>
              )}
            </div>
          </section>
        )}
      </main>

      <BlogFooter />
    </>
  );
}
