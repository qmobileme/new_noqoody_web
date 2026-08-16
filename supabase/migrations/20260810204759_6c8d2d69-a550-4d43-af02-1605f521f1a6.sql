CREATE TABLE public.pos_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  existing_merchant BOOLEAN NOT NULL DEFAULT false,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  monthly_volume TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_units INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.pos_orders TO anon;
GRANT INSERT ON public.pos_orders TO authenticated;
GRANT ALL ON public.pos_orders TO service_role;

ALTER TABLE public.pos_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a POS order"
  ON public.pos_orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);