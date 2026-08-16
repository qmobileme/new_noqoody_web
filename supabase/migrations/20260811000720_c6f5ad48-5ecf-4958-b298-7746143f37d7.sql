REVOKE EXECUTE ON FUNCTION public.record_blog_slug_change() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_blog_post_revision() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.publish_scheduled_posts() FROM anon, authenticated, public;