import { createServerFn } from "@tanstack/react-start";
import type { Tables } from "@/integrations/supabase/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PreviewPost = Tables<"blog_posts">;

/**
 * Public draft preview: resolves a post by its unguessable preview token so an
 * unpublished draft can be reviewed before publishing. The token is the only
 * credential, so it is validated as a UUID before hitting the database and the
 * route that renders it is marked noindex.
 */
export const getDraftPreview = createServerFn({ method: "GET" })
  .inputValidator((data: { token: string }) => {
    if (!data || typeof data.token !== "string" || !UUID_RE.test(data.token)) {
      throw new Error("Invalid preview token");
    }
    return { token: data.token };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("preview_token", data.token)
      .maybeSingle();
    if (error || !post) return { ok: false as const };

    // Last published version, taken from the revision log so the draft can be
    // compared against what visitors currently see.
    const { data: revisions } = await supabaseAdmin
      .from("blog_post_revisions")
      .select("snapshot, created_at")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      .limit(40);

    const publishedRow = (revisions ?? []).find(
      (r) => (r.snapshot as Record<string, unknown> | null)?.["published"] === true,
    );

    return {
      ok: true as const,
      post: post as PreviewPost,
      lastPublished: publishedRow
        ? {
            post: publishedRow.snapshot as unknown as PreviewPost,
            capturedAt: publishedRow.created_at,
          }
        : null,
    };
  });
