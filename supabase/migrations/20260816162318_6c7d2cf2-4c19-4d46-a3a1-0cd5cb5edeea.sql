-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  description text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  cover_image text,
  registration_url text,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published events" ON public.events FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- POS product library
CREATE TABLE public.pos_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  best_for text,
  hero_image text,
  gallery text[] NOT NULL DEFAULT '{}',
  accent_color text NOT NULL DEFAULT '#dd8127',
  intro_headline text,
  intro_body text,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  checklist text[] NOT NULL DEFAULT '{}',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  datasheet_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pos_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pos_products TO authenticated;
GRANT ALL ON public.pos_products TO service_role;
ALTER TABLE public.pos_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published pos products" ON public.pos_products FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage pos products" ON public.pos_products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER pos_products_set_updated_at BEFORE UPDATE ON public.pos_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Order Now catalogue
CREATE TABLE public.order_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  image text,
  description text,
  specs text[] NOT NULL DEFAULT '{}',
  min_quantity integer NOT NULL DEFAULT 1,
  max_quantity integer NOT NULL DEFAULT 50,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_products TO authenticated;
GRANT ALL ON public.order_products TO service_role;
ALTER TABLE public.order_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active order products" ON public.order_products FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage order products" ON public.order_products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER order_products_set_updated_at BEFORE UPDATE ON public.order_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();