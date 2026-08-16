import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns the secret draft-preview token for a post. The token is no longer
 * readable through the Data API, so only verified admins/editors can obtain it
 * here.
 */
export const getPostPreviewToken = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { postId: string }) => {
    if (!data || typeof data.postId !== "string" || !UUID_RE.test(data.postId)) {
      throw new Error("Invalid post id");
    }
    return { postId: data.postId };
  })
  .handler(async ({ data, context }) => {
    // Role check runs as the caller, so RLS applies.
    const { data: roles, error: roleError } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleError) throw new Error("Unauthorized");
    const allowed = (roles ?? []).some((r) => r.role === "admin" || r.role === "editor");
    if (!allowed) throw new Error("Unauthorized");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("preview_token")
      .eq("id", data.postId)
      .maybeSingle();
    if (error || !post) throw new Error("Post not found");
    return { token: post.preview_token as string };
  });
