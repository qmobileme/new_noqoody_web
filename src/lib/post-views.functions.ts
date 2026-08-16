import { createServerFn } from "@tanstack/react-start";

const SLUG_RE = /^[a-z0-9-]{1,200}$/i;

/**
 * Records a page view for a published post. The underlying counter function is
 * no longer executable by browser clients, so the increment runs server-side
 * with a validated slug.
 */
export const incrementPostView = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) => {
    if (!data || typeof data.slug !== "string" || !SLUG_RE.test(data.slug)) {
      throw new Error("Invalid slug");
    }
    return { slug: data.slug };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.rpc("increment_post_views", { _slug: data.slug });
    return { ok: true as const };
  });
