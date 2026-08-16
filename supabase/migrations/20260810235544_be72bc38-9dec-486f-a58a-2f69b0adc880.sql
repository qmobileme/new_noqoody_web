ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_form_type_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_form_type_check CHECK (form_type IN ('contact', 'apply', 'newsletter'));