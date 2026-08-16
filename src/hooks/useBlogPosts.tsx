import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type BlogPost = Tables<"blog_posts">;
export type BlogPostInsert = TablesInsert<"blog_posts">;
export type BlogPostUpdate = TablesUpdate<"blog_posts">;

/**
 * Columns readable by anonymous visitors. `preview_token` is intentionally
 * excluded — it is the credential for unpublished draft previews and anon no
 * longer holds a column grant for it.
 */
export const PUBLIC_POST_COLUMNS =
  "id, title_en, title_ar, slug, excerpt_en, excerpt_ar, content_en, content_ar, featured_image, meta_description_en, meta_description_ar, keywords, category, author, published, published_at, created_at, updated_at, view_count, scheduled_at";

/**
 * Columns editors read in the admin UI. Same set as above: `preview_token` is
 * server-only and fetched through a verified server function when needed.
 */
export const ADMIN_POST_COLUMNS = PUBLIC_POST_COLUMNS;

export function usePublishedPosts() {
  return useQuery({
    queryKey: ["blog-posts", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(PUBLIC_POST_COLUMNS)
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as unknown as BlogPost[];
    },
  });
}

export function useAllPosts() {
  return useQuery({
    queryKey: ["blog-posts", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(ADMIN_POST_COLUMNS)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as BlogPost[];
    },
  });
}

export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: ["blog-posts", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(PUBLIC_POST_COLUMNS)
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as unknown as BlogPost;
    },
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: BlogPostInsert) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(post)
        .select(ADMIN_POST_COLUMNS)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: BlogPostUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select(ADMIN_POST_COLUMNS)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export type BlogRevision = Tables<"blog_post_revisions">;

/** Version history for a single post (newest first). */
export function usePostRevisions(postId: string | undefined) {
  return useQuery({
    queryKey: ["blog-revisions", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_post_revisions")
        .select("*")
        .eq("post_id", postId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as BlogRevision[];
    },
    enabled: !!postId,
  });
}

/** Site-wide activity log across all blog posts. */
export function useBlogActivity(limit = 100) {
  return useQuery({
    queryKey: ["blog-activity", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_post_revisions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as BlogRevision[];
    },
  });
}
