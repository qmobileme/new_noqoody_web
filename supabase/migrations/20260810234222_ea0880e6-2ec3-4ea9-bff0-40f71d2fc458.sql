REVOKE ALL ON FUNCTION public.log_blog_post_revision() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.publish_scheduled_posts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_scheduled_posts() TO service_role;