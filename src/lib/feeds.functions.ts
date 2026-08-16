import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface FeedTarget {
  path: string;
  label: string;
  ok: boolean;
  status: number;
  bytes: number;
  urls: number;
}

/**
 * Forces a fresh render of the blog sitemap and RSS feed and reports what each
 * one now contains, so an editor can confirm bulk changes are live instead of
 * waiting for a cached copy to expire. Admins only.
 */
export const regenerateFeeds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const origin = new URL(getRequest().url).origin;
    const stamp = Date.now();
    const targets: { path: string; label: string }[] = [
      { path: "/blog-sitemap.xml", label: "Blog sitemap" },
      { path: "/blog/rss.xml", label: "RSS feed" },
    ];

    const results: FeedTarget[] = [];
    for (const target of targets) {
      try {
        const res = await fetch(`${origin}${target.path}?refresh=${stamp}`, {
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        const body = await res.text();
        results.push({
          ...target,
          ok: res.ok,
          status: res.status,
          bytes: body.length,
          urls: (body.match(/<loc>|<item>/g) ?? []).length,
        });
      } catch {
        results.push({ ...target, ok: false, status: 0, bytes: 0, urls: 0 });
      }
    }

    return { generatedAt: new Date().toISOString(), targets: results };
  });
