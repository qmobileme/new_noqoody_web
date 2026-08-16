-- 1. Stop public/anon clients from executing SECURITY DEFINER helpers directly
REVOKE EXECUTE ON FUNCTION public.increment_post_views(text) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.increment_post_views(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 2. Hide the draft preview token from anonymous readers (column-level grants)
REVOKE SELECT ON public.blog_posts FROM anon;
GRANT SELECT (id, title_en, title_ar, slug, excerpt_en, excerpt_ar, content_en, content_ar,
  featured_image, meta_description_en, meta_description_ar, keywords, category, author,
  published, published_at, created_at, updated_at, view_count, scheduled_at)
  ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;