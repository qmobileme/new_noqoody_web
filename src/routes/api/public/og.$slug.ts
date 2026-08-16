import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK = "/og-image.jpg";

/**
 * Stable per-post social thumbnail URL. Resolves the post's cover image
 * (including rotating signed storage URLs) and redirects crawlers to it,
 * falling back to the site card when a post has no cover.
 */
export const Route = createFileRoute("/api/public/og/$slug")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const origin = new URL(request.url).origin;
        const slug = String(params.slug).slice(0, 200).replace(/\.(jpg|jpeg|png|webp)$/i, "");

        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) return Response.redirect(`${origin}${FALLBACK}`, 302);

        const supabasePublic = createClient<Database>(url, key, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
                headers.delete("Authorization");
              }
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const { data } = await supabasePublic
          .from("blog_posts")
          .select("featured_image, updated_at")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();

        const image = data?.featured_image;
        const target = image?.startsWith("http") ? image : `${origin}${image ?? FALLBACK}`;

        return new Response(null, {
          status: 302,
          headers: {
            Location: target,
            // Crawlers/CDNs serve the cached redirect instantly, then refresh in
            // the background so a new cover image propagates without a cold hit.
            "Cache-Control":
              "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=604800",
            ...(data?.updated_at ? { "Last-Modified": new Date(data.updated_at).toUTCString() } : {}),
            Vary: "Accept",
          },
        });
      },
    },
  },
});
