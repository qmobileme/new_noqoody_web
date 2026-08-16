CREATE TABLE public.event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  event_name text NOT NULL,
  guests text NOT NULL DEFAULT '1',
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX event_rsvps_email_event_key
  ON public.event_rsvps (lower(email), event_name);
CREATE INDEX event_rsvps_created_at_idx ON public.event_rsvps (created_at DESC);

GRANT INSERT ON public.event_rsvps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_rsvps TO authenticated;
GRANT ALL ON public.event_rsvps TO service_role;

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an RSVP"
  ON public.event_rsvps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff can view RSVPs"
  ON public.event_rsvps FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can update RSVPs"
  ON public.event_rsvps FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete RSVPs"
  ON public.event_rsvps FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_post_views(_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.blog_posts
     SET view_count = view_count + 1
   WHERE slug = _slug AND published = true;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_post_views(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_views(text) TO anon, authenticated, service_role;