CREATE TABLE public.pod_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pod_categories_status_check CHECK (status IN ('draft', 'published', 'archived'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pod_categories TO authenticated;
GRANT SELECT ON public.pod_categories TO anon;
GRANT ALL ON public.pod_categories TO service_role;
ALTER TABLE public.pod_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published Podium categories are public" ON public.pod_categories FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins manage Podium categories" ON public.pod_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.pod_experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  portrait_url text NOT NULL DEFAULT '',
  portfolio_url text NOT NULL DEFAULT '',
  consent text NOT NULL DEFAULT 'pending',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pod_experts_consent_check CHECK (consent IN ('pending', 'granted', 'withdrawn')),
  CONSTRAINT pod_experts_status_check CHECK (status IN ('draft', 'published', 'archived'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pod_experts TO authenticated;
GRANT SELECT ON public.pod_experts TO anon;
GRANT ALL ON public.pod_experts TO service_role;
ALTER TABLE public.pod_experts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Consented published experts are public" ON public.pod_experts FOR SELECT TO anon, authenticated USING ((status = 'published' AND consent = 'granted') OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins manage Podium experts" ON public.pod_experts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.pod_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.pod_categories(id) ON DELETE SET NULL,
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  duration text NOT NULL DEFAULT '',
  experts jsonb NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url text NOT NULL DEFAULT '',
  fiverr_url text NOT NULL DEFAULT '',
  upwork_url text NOT NULL DEFAULT '',
  whatsapp_url text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  primary_cta text NOT NULL DEFAULT 'whatsapp',
  cta_label text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  revisions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pod_services_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT pod_services_primary_cta_check CHECK (primary_cta IN ('fiverr', 'upwork', 'whatsapp', 'email'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pod_services TO authenticated;
GRANT SELECT ON public.pod_services TO anon;
GRANT ALL ON public.pod_services TO service_role;
ALTER TABLE public.pod_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published Podium services are public" ON public.pod_services FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins manage Podium services" ON public.pod_services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE INDEX pod_services_category_sort_idx ON public.pod_services(category_id, sort_order);

CREATE TABLE public.pod_settings (
  id text PRIMARY KEY,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pod_settings TO authenticated;
GRANT ALL ON public.pod_settings TO service_role;
ALTER TABLE public.pod_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage Podium settings" ON public.pod_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.pod_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  resource_slug text NOT NULL DEFAULT '',
  device text NOT NULL DEFAULT 'unknown',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.pod_events TO authenticated;
GRANT INSERT ON public.pod_events TO anon;
GRANT ALL ON public.pod_events TO service_role;
ALTER TABLE public.pod_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can record Podium events" ON public.pod_events FOR INSERT TO anon, authenticated WITH CHECK (length(event_type) <= 60 AND length(resource_slug) <= 160);
CREATE POLICY "Admins read Podium analytics" ON public.pod_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE public.pod_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  resource_name text NOT NULL DEFAULT '',
  details text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.pod_audit TO authenticated;
GRANT ALL ON public.pod_audit TO service_role;
ALTER TABLE public.pod_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read Podium audit history" ON public.pod_audit FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins create Podium audit history" ON public.pod_audit FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
