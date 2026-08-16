CREATE OR REPLACE FUNCTION public.enforce_publish_permission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Server-side/service contexts (no JWT) are unaffected.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' AND NEW.published THEN
    RAISE EXCEPTION 'Only admins can publish posts';
  END IF;

  IF TG_OP = 'UPDATE' AND (OLD.published IS DISTINCT FROM NEW.published) THEN
    RAISE EXCEPTION 'Only admins can publish or unpublish posts';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_publish_permission() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS blog_posts_publish_permission ON public.blog_posts;
CREATE TRIGGER blog_posts_publish_permission
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.enforce_publish_permission();