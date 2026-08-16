import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { BlogProviders } from "@/components/blog/BlogProviders";
import { SocialShare } from "@/components/blog/SocialShare";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { useLanguage } from "@/hooks/useLanguage";
import type { BlogPost } from "@/hooks/useBlogPosts";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_POST_COLUMNS } from "@/hooks/useBlogPosts";
import { incrementPostView } from "@/lib/post-views.functions";
import { ArrowLeft, ArrowRight, Clock, Tag, X } from "lucide-react";
import { getReadingTime } from "@/lib/readingTime";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const SITE = "https://noqoody.lovable.app";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(PUBLIC_POST_COLUMNS)
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw notFound();
    if (!data) {
      // The slug may have been renamed — forward old, indexed URLs permanently.
      const { data: moved } = await supabase
        .from("blog_post_slug_redirects")
        .select("new_slug")
        .eq("old_slug", params.slug)
        .maybeSingle();
      if (moved?.new_slug && moved.new_slug !== params.slug) {
        throw redirect({
          to: "/blog/$slug",
          params: { slug: moved.new_slug },
          statusCode: 301,
          replace: true,
        });
      }
      throw notFound();
    }
    return { post: data as unknown as BlogPost };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable — Noqoody Blog" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.post;
    const desc = p.meta_description_en || p.excerpt_en || "Noqoody payment insights.";
    const url = `${SITE}/blog/${params.slug}`;
    const image = `${SITE}/api/public/og/${params.slug}`;
    const imageAlt = `Cover image for ${p.title_en}`;
    return {
      meta: [
        { title: `${p.title_en} | Noqoody Blog` },
        { name: "description", content: desc },
        { name: "author", content: p.author || "Noqoody" },
        ...(p.keywords?.length ? [{ name: "keywords", content: p.keywords.join(", ") }] : []),
        { property: "og:site_name", content: "Noqoody Blog" },
        { property: "og:title", content: p.title_en },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: "en_US" },
        ...(p.title_ar ? [{ property: "og:locale:alternate", content: "ar_QA" }] : []),
        { property: "og:image", content: image },
        { property: "og:image:secure_url", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: imageAlt },
        { property: "article:published_time", content: p.published_at ?? p.created_at },
        { property: "article:modified_time", content: p.updated_at },
        { property: "article:author", content: p.author || "Noqoody" },
        ...(p.category ? [{ property: "article:section", content: p.category }] : []),
        ...(p.keywords ?? []).map((k) => ({ property: "article:tag", content: k })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title_en },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: image },
        { name: "twitter:image:alt", content: imageAlt },
        { name: "twitter:label1", content: "Reading time" },
        { name: "twitter:data1", content: `${getReadingTime(p.content_en ?? "")} min read` },
        { name: "twitter:label2", content: "Category" },
        { name: "twitter:data2", content: p.category || "Insights" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        ...(p.title_ar ? [{ rel: "alternate", hrefLang: "ar", href: `${url}?lang=ar` }] : []),
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.title_en,
            description: desc,
            image,
            datePublished: p.published_at,
            dateModified: p.updated_at,
            author: { "@type": "Organization", name: p.author || "Noqoody" },
            publisher: { "@type": "Organization", name: "Noqoody" },
            keywords: p.keywords?.join(", "),
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <BlogProviders>
      <BlogHeader />
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
        <Button asChild variant="outline">
          <Link to="/blog">Back to blog</Link>
        </Button>
      </div>
    </BlogProviders>
  ),
  component: () => (
    <BlogProviders>
      <BlogPostPage />
    </BlogProviders>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const { t, lang } = useLanguage();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") setLightboxSrc((target as HTMLImageElement).src);
    };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [post]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxSrc]);

  useEffect(() => {
    if (!post.slug) return;
    const key = `viewed:${post.slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void incrementPostView({ data: { slug: post.slug } }).catch(() => {});
  }, [post.slug]);

  const title = t(post.title_en, post.title_ar);
  const content = t(post.content_en, post.content_ar);
  const date = post.published_at ? format(new Date(post.published_at), "d MMM yyyy") : "";
  const readTime = getReadingTime(content || "");

  return (
    <>
      <BlogHeader />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-4xl pt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            {lang === "ar" ? (
              <>
                <ArrowRight className="h-4 w-4" />
                العودة للمدونة
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </>
            )}
          </Link>

          {post.category && (
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">{post.category}</p>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] mb-8">
            {title}
          </h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{date}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTime} {lang === "ar" ? "دقيقة" : "min read"}
              </span>
            </div>
            <SocialShare url={`${SITE}/blog/${post.slug}`} title={title} />
          </div>

          {post.featured_image && (
            <div className="w-full rounded-xl overflow-hidden mb-12">
              <img src={post.featured_image} alt={title} className="w-full h-auto object-cover" />
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 max-w-5xl pb-16">
          <div className="flex gap-10">
            <article className="flex-1 min-w-0 max-w-3xl">
              <div
                ref={contentRef}
                className="prose-blog [&_img]:cursor-zoom-in"
                dangerouslySetInnerHTML={{ __html: content }}
              />

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
            </article>

            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TableOfContents content={content || ""} />
            </aside>
          </div>
        </div>
      </main>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={lightboxSrc}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <RelatedPosts currentPost={post} />
      <BlogFooter />
    </>
  );
}
