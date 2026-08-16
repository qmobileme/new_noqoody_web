CREATE TABLE public.shortlink_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  reference text NOT NULL,
  amount_minor integer NOT NULL CHECK (amount_minor > 0),
  currency text NOT NULL DEFAULT 'QAR',
  merchant_name text NOT NULL DEFAULT 'Noqoody Demo Merchant',
  description text,
  customer_masked text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','paid','failed','expired')),
  failure_reason text,
  provider_event_id text UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 minutes',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.shortlink_payments TO service_role;

ALTER TABLE public.shortlink_payments ENABLE ROW LEVEL SECURITY;

CREATE INDEX shortlink_payments_status_idx ON public.shortlink_payments (status, created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER shortlink_payments_set_updated_at
BEFORE UPDATE ON public.shortlink_payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();