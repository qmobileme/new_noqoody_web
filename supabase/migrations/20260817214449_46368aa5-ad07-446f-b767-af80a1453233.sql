CREATE TABLE public.email_settings (
  id boolean PRIMARY KEY DEFAULT true,
  provider text NOT NULL DEFAULT 'managed',
  api_endpoint text,
  from_email text NOT NULL DEFAULT 'no-reply@sub.noqoody.com',
  from_name text NOT NULL DEFAULT 'No Reply',
  reply_to text,
  notification_recipient text NOT NULL DEFAULT 'info@noqoody.com',
  smtp_host text NOT NULL DEFAULT 'mail.noqoodypay.com',
  smtp_port_ssl integer NOT NULL DEFAULT 465,
  smtp_port_starttls integer NOT NULL DEFAULT 587,
  imap_host text NOT NULL DEFAULT 'mail.noqoodypay.com',
  imap_port integer NOT NULL DEFAULT 993,
  pop3_port integer NOT NULL DEFAULT 995,
  quota text NOT NULL DEFAULT '1 GB',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_settings_singleton CHECK (id),
  CONSTRAINT email_settings_provider_check CHECK (provider IN ('managed','http_api'))
);

GRANT SELECT, INSERT, UPDATE ON public.email_settings TO authenticated;
GRANT ALL ON public.email_settings TO service_role;

ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email settings" ON public.email_settings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can insert email settings" ON public.email_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update email settings" ON public.email_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

INSERT INTO public.email_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;