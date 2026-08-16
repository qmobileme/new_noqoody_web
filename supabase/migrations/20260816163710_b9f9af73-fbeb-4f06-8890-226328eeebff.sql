ALTER TABLE public.pos_orders
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS staff_note text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.pos_orders DROP CONSTRAINT IF EXISTS pos_orders_status_check;
ALTER TABLE public.pos_orders ADD CONSTRAINT pos_orders_status_check
  CHECK (status IN ('pending','confirmed','preparing','dispatched','completed','cancelled'));

CREATE INDEX IF NOT EXISTS pos_orders_status_idx ON public.pos_orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS pos_orders_reference_idx ON public.pos_orders (reference);

DROP TRIGGER IF EXISTS pos_orders_set_updated_at ON public.pos_orders;
CREATE TRIGGER pos_orders_set_updated_at BEFORE UPDATE ON public.pos_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT, UPDATE ON public.pos_orders TO authenticated;
GRANT ALL ON public.pos_orders TO service_role;

DROP POLICY IF EXISTS "Staff can view POS orders" ON public.pos_orders;
CREATE POLICY "Staff can view POS orders" ON public.pos_orders
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

DROP POLICY IF EXISTS "Admins can update POS orders" ON public.pos_orders;
CREATE POLICY "Admins can update POS orders" ON public.pos_orders
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));