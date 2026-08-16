CREATE TABLE public.submission_throttle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint text NOT NULL,
  form_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.submission_throttle TO service_role;

ALTER TABLE public.submission_throttle ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to throttle log"
  ON public.submission_throttle FOR ALL
  TO authenticated
  USING (false) WITH CHECK (false);

CREATE INDEX submission_throttle_lookup_idx
  ON public.submission_throttle (fingerprint, form_type, created_at DESC);