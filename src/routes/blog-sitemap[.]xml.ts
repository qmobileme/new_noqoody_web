import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getPublishedPosts, xmlEscape, SITE_URL } from "@/lib/blog-feed.server";

/** XML sitemap for the blog, with English/Arabic hreflang alternates per article. */
export const Route = createFileRoute("/blog-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getPublishedPosts();

        const alternates = (loc: string, hasArabic: boolean) =>
          [
            `    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(loc)}" />`,
            hasArabic
              ? `    <xhtml:link rel="alternate" hreflang="ar" href="${xmlEscape(`${loc}?lang=ar`)}" />`
              : null,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(loc)}" />`,
          ]
            .filter(Boolean)
            .join("\n");

        const urls = [
          [
            `  <url>`,
            `    <loc>${SITE_URL}/blog</loc>`,
            `    <changefreq>daily</changefreq>`,
            `    <priority>0.9</priority>`,
            `  </url>`,
          ].join("\n"),
          ...posts.map((post) => {
            const loc = `${SITE_URL}/blog/${post.slug}`;
            const lastmod = post.updated_at ? new Date(post.updated_at).toISOString() : null;
            return [
              `  <url>`,
              `    <loc>${xmlEscape(loc)}</loc>`,
              lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
              `    <changefreq>monthly</changefreq>`,
              `    <priority>0.8</priority>`,
              alternates(loc, Boolean(post.title_ar)),
              post.featured_image
                ? `    <image:image><image:loc>${xmlEscape(post.featured_image)}</image:loc><image:title>${xmlEscape(post.title_en)}</image:title></image:image>`
                : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n");
          }),
        ];

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
