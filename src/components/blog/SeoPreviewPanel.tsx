import { useMemo } from "react";
import { Globe, Twitter, Code2 } from "lucide-react";

const SITE = "https://noqoody.lovable.app";

export interface SeoPreviewInput {
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  meta_description_en: string;
  meta_description_ar: string;
  featured_image: string;
  category: string;
  author: string;
  keywords: string;
  published: boolean;
}

/**
 * Live SEO preview: renders the exact canonical / Open Graph / Twitter Card /
 * hreflang output the public article route emits for this post.
 */
export function SeoPreviewPanel({ post }: { post: SeoPreviewInput }) {
  const tags = useMemo(() => {
    const slug = post.slug || "your-article-slug";
    const url = `${SITE}/blog/${slug}`;
    const image = `${SITE}/api/public/og/${slug}`;
    const title = post.title_en || "Untitled article";
    const desc = post.meta_description_en || post.excerpt_en || "Noqoody payment insights.";
    const imageAlt = `Cover image for ${title}`;
    const keywords = post.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const meta: Array<[string, string]> = [
      ["title", `${title} | Noqoody Blog`],
      ["description", desc],
      ["author", post.author || "Noqoody"],
      ...(keywords.length ? ([["keywords", keywords.join(", ")]] as Array<[string, string]>) : []),
      ["og:site_name", "Noqoody Blog"],
      ["og:title", title],
      ["og:description", desc],
      ["og:type", "article"],
      ["og:url", url],
      ["og:locale", "en_US"],
      ...(post.title_ar ? ([["og:locale:alternate", "ar_QA"]] as Array<[string, string]>) : []),
      ["og:image", image],
      ["og:image:width", "1200"],
      ["og:image:height", "630"],
      ["og:image:alt", imageAlt],
      ["article:section", post.category || "general"],
      ...keywords.map((k) => ["article:tag", k] as [string, string]),
      ["twitter:card", "summary_large_image"],
      ["twitter:title", title],
      ["twitter:description", desc],
      ["twitter:image", image],
      ["twitter:image:alt", imageAlt],
    ];

    const links: Array<[string, string, string?]> = [
      ["canonical", url],
      ["alternate", url, "en"],
      ...(post.title_ar ? ([["alternate", `${url}?lang=ar`, "ar"]] as Array<[string, string, string?]>) : []),
      ["alternate", url, "x-default"],
    ];

    return { url, image, title, desc, meta, links, keywords };
  }, [post]);

  const previewImage = post.featured_image || "/og-image.jpg";
  const descTooLong = tags.desc.length > 160;

  return (
    <section className="p-6 rounded-xl border border-border bg-card space-y-5">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-foreground">Live SEO preview</h2>
      </div>

      {/* Google result */}
      <div className="rounded-lg border border-border p-3 space-y-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Google result</p>
        <p className="text-xs text-muted-foreground truncate">{tags.url}</p>
        <p className="text-base text-primary leading-snug line-clamp-2">{tags.title} | Noqoody Blog</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{tags.desc}</p>
        <p className={`text-[11px] ${descTooLong ? "text-destructive" : "text-muted-foreground"}`}>
          Meta description {tags.desc.length}/160 characters
        </p>
      </div>

      {/* Social card */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <Twitter className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Open Graph / Twitter card
          </p>
        </div>
        <img
          src={previewImage}
          alt=""
          className="w-full aspect-[1200/630] object-cover bg-muted"
          loading="lazy"
        />
        <div className="p-3 space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase">noqoody.lovable.app</p>
          <p className="text-sm font-medium text-foreground line-clamp-2">{tags.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{tags.desc}</p>
        </div>
      </div>

      {/* Raw tags */}
      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-foreground flex items-center gap-2">
          <Code2 className="h-3.5 w-3.5" /> Exact head output ({tags.meta.length + tags.links.length} tags)
        </summary>
        <pre className="px-3 pb-3 pt-1 text-[11px] leading-relaxed overflow-x-auto text-muted-foreground">
          {tags.links
            .map(([rel, href, lang]) =>
              lang
                ? `<link rel="${rel}" hreflang="${lang}" href="${href}" />`
                : `<link rel="${rel}" href="${href}" />`,
            )
            .concat(
              tags.meta.map(([key, value]) =>
                key === "title"
                  ? `<title>${value}</title>`
                  : key.startsWith("og:") || key.startsWith("article:")
                    ? `<meta property="${key}" content="${value}" />`
                    : `<meta name="${key}" content="${value}" />`,
              ),
            )
            .join("\n")}
        </pre>
      </details>

      {!post.published && (
        <p className="text-xs text-muted-foreground">
          This post is a draft — these tags go live once it is published.
        </p>
      )}
    </section>
  );
}
