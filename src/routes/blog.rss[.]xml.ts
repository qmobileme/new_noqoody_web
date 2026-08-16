import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getPublishedPosts, xmlEscape, SITE_URL } from "@/lib/blog-feed.server";

/** RSS 2.0 feed of published Noqoody blog articles (English items with Arabic titles noted). */
export const Route = createFileRoute("/blog/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getPublishedPosts();
        const now = new Date().toUTCString();

        const items = posts.map((post) => {
          const link = `${SITE_URL}/blog/${post.slug}`;
          const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : now;
          return [
            `    <item>`,
            `      <title>${xmlEscape(post.title_en)}</title>`,
            `      <link>${xmlEscape(link)}</link>`,
            `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
            `      <pubDate>${pubDate}</pubDate>`,
            post.author ? `      <dc:creator>${xmlEscape(post.author)}</dc:creator>` : null,
            post.category ? `      <category>${xmlEscape(post.category)}</category>` : null,
            post.excerpt_en
              ? `      <description>${xmlEscape(post.excerpt_en)}</description>`
              : null,
            post.title_ar
              ? `      <content:encoded><![CDATA[${post.excerpt_en ?? ""}<p lang="ar" dir="rtl">${post.title_ar}${post.excerpt_ar ? ` — ${post.excerpt_ar}` : ""}</p>]]></content:encoded>`
              : null,
            post.featured_image
              ? `      <enclosure url="${xmlEscape(post.featured_image)}" type="image/jpeg" />`
              : null,
            `    </item>`,
          ]
            .filter(Boolean)
            .join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">`,
          `  <channel>`,
          `    <title>Noqoody Blog</title>`,
          `    <link>${SITE_URL}/blog</link>`,
          `    <description>Payments, POS and fintech insights from Noqoody in Qatar.</description>`,
          `    <language>en</language>`,
          `    <lastBuildDate>${now}</lastBuildDate>`,
          `    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
          ...items,
          `  </channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
