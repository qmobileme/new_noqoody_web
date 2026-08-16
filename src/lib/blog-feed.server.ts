import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const SITE_URL = "https://noqoody.lovable.app";

export interface FeedPost {
  slug: string;
  title_en: string;
  title_ar: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  featured_image: string | null;
  category: string | null;
  author: string | null;
  keywords: string[] | null;
  published_at: string | null;
  updated_at: string;
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Published posts for the RSS feed and blog sitemap (public, anon-readable). */
export async function getPublishedPosts(): Promise<FeedPost[]> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return [];

  const supabasePublic = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
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

  const { data, error } = await supabasePublic
    .from("blog_posts")
    .select(
      "slug, title_en, title_ar, excerpt_en, excerpt_ar, featured_image, category, author, keywords, published_at, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return data as FeedPost[];
}
