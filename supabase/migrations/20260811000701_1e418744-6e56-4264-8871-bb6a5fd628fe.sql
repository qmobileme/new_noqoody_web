CREATE TABLE public.blog_post_slug_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  old_slug text NOT NULL UNIQUE,
  new_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX blog_post_slug_redirects_old_slug_idx ON public.blog_post_slug_redirects (old_slug);

GRANT SELECT ON public.blog_post_slug_redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_post_slug_redirects TO authenticated;
GRANT ALL ON public.blog_post_slug_redirects TO service_role;

ALTER TABLE public.blog_post_slug_redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read slug redirects"
  ON public.blog_post_slug_redirects FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage slug redirects"
  ON public.blog_post_slug_redirects FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE OR REPLACE FUNCTION public.record_blog_slug_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    UPDATE public.blog_post_slug_redirects
       SET new_slug = NEW.slug
     WHERE new_slug = OLD.slug;

    DELETE FROM public.blog_post_slug_redirects
     WHERE old_slug = NEW.slug;

    INSERT INTO public.blog_post_slug_redirects (post_id, old_slug, new_slug)
    VALUES (NEW.id, OLD.slug, NEW.slug)
    ON CONFLICT (old_slug) DO UPDATE
      SET new_slug = EXCLUDED.new_slug,
          post_id = EXCLUDED.post_id,
          created_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_slug_redirect
  AFTER UPDATE OF slug ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.record_blog_slug_change();

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);