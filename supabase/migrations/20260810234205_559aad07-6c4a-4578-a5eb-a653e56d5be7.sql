-- 1. Scheduled publishing
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
CREATE INDEX IF NOT EXISTS blog_posts_scheduled_at_idx ON public.blog_posts (scheduled_at) WHERE published = false;

-- 2. Revision / activity history
CREATE TABLE public.blog_post_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  slug text NOT NULL,
  title_en text,
  action text NOT NULL,
  changed_fields text[] NOT NULL DEFAULT '{}'::text[],
  snapshot jsonb NOT NULL,
  actor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_post_revisions TO authenticated;
GRANT ALL ON public.blog_post_revisions TO service_role;

ALTER TABLE public.blog_post_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read revisions"
  ON public.blog_post_revisions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role));

CREATE INDEX blog_post_revisions_post_idx ON public.blog_post_revisions (post_id, created_at DESC);
CREATE INDEX blog_post_revisions_created_idx ON public.blog_post_revisions (created_at DESC);

-- 3. Trigger that snapshots every change
CREATE OR REPLACE FUNCTION public.log_blog_post_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.blog_posts;
  act text;
  changed text[] := '{}'::text[];
  old_json jsonb;
  new_json jsonb;
  k text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    rec := OLD;
    act := 'deleted';
  ELSIF TG_OP = 'INSERT' THEN
    rec := NEW;
    act := 'created';
  ELSE
    rec := NEW;
    old_json := to_jsonb(OLD) - 'updated_at' - 'view_count';
    new_json := to_jsonb(NEW) - 'updated_at' - 'view_count';
    FOR k IN SELECT jsonb_object_keys(new_json) LOOP
      IF (new_json -> k) IS DISTINCT FROM (old_json -> k) THEN
        changed := array_append(changed, k);
      END IF;
    END LOOP;
    IF array_length(changed, 1) IS NULL THEN
      RETURN NEW;
    END IF;
    IF OLD.published IS DISTINCT FROM NEW.published THEN
      act := CASE WHEN NEW.published THEN 'published' ELSE 'unpublished' END;
    ELSE
      act := 'updated';
    END IF;
  END IF;

  INSERT INTO public.blog_post_revisions (post_id, slug, title_en, action, changed_fields, snapshot, actor_id)
  VALUES (rec.id, rec.slug, rec.title_en, act, changed, to_jsonb(rec), auth.uid());

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_revision_log
AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.log_blog_post_revision();

-- 4. Scheduled publishing job
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n integer;
BEGIN
  UPDATE public.blog_posts
     SET published = true,
         published_at = COALESCE(published_at, scheduled_at, now()),
         scheduled_at = NULL
   WHERE published = false
     AND scheduled_at IS NOT NULL
     AND scheduled_at <= now();
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.publish_scheduled_posts() FROM PUBLIC, anon;

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  PERFORM cron.unschedule('publish-scheduled-blog-posts');
EXCEPTION WHEN OTHERS THEN NULL;
END;
$$;

SELECT cron.schedule(
  'publish-scheduled-blog-posts',
  '*/5 * * * *',
  $$SELECT public.publish_scheduled_posts();$$
);