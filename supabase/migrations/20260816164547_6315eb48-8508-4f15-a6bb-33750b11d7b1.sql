CREATE POLICY "Customers can view their own orders"
ON public.pos_orders
FOR SELECT
TO authenticated
USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email'), '')));