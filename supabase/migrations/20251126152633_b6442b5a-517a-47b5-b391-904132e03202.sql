-- Create enums for industries and personas
CREATE TYPE public.industry_type AS ENUM ('retail', 'dtc', 'cpg', 'travel_hospitality', 'media_subscription');
CREATE TYPE public.persona_type AS ENUM ('digital_marketing', 'ecommerce', 'cx_loyalty', 'growth', 'data_it');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Industries table
CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type industry_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Personas table
CREATE TABLE public.personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type persona_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Maturity dimensions
CREATE TABLE public.maturity_dimensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  level_1_label TEXT NOT NULL,
  level_2_label TEXT NOT NULL,
  level_3_label TEXT NOT NULL,
  level_4_label TEXT NOT NULL,
  level_5_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Growth Plays Library
CREATE TABLE public.growth_plays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  journey_stage TEXT,
  jtbd TEXT,
  where_to_activate TEXT,
  features_to_use TEXT,
  primary_success_metric TEXT,
  kpis TEXT,
  estimated_impact_min INTEGER,
  estimated_impact_max INTEGER,
  messaging_block TEXT,
  blueconic_value_map TEXT,
  complexity TEXT,
  risk_mitigation TEXT,
  deliverables TEXT,
  prerequisites TEXT,
  time_to_value TEXT,
  -- Maturity prerequisites (1-5 for each dimension)
  data_readiness_prereq INTEGER CHECK (data_readiness_prereq BETWEEN 1 AND 5),
  activation_prereq INTEGER CHECK (activation_prereq BETWEEN 1 AND 5),
  decisioning_prereq INTEGER CHECK (decisioning_prereq BETWEEN 1 AND 5),
  experimentation_prereq INTEGER CHECK (experimentation_prereq BETWEEN 1 AND 5),
  governance_prereq INTEGER CHECK (governance_prereq BETWEEN 1 AND 5),
  -- Confidence scoring multipliers
  relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
  evidence_coverage INTEGER CHECK (evidence_coverage BETWEEN 0 AND 100),
  consistency_score INTEGER CHECK (consistency_score BETWEEN 0 AND 100),
  recency_score INTEGER CHECK (recency_score BETWEEN 0 AND 100),
  data_strength INTEGER CHECK (data_strength BETWEEN 0 AND 100),
  asset_url TEXT,
  icon_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Growth play industry applicability (many-to-many)
CREATE TABLE public.growth_play_industries (
  growth_play_id UUID REFERENCES public.growth_plays(id) ON DELETE CASCADE,
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  PRIMARY KEY (growth_play_id, industry_id)
);

-- Growth play persona applicability (many-to-many)
CREATE TABLE public.growth_play_personas (
  growth_play_id UUID REFERENCES public.growth_plays(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES public.personas(id) ON DELETE CASCADE,
  PRIMARY KEY (growth_play_id, persona_id)
);

-- Benchmarks by industry
CREATE TABLE public.benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  consent_rate_avg DECIMAL(5,2),
  declared_data_capture_avg DECIMAL(5,2),
  conversion_lift_min DECIMAL(5,2),
  conversion_lift_max DECIMAL(5,2),
  example_companies TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Content blocks (for hero, descriptions, CTAs, etc.)
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Logos and social proof assets
CREATE TABLE public.logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User assessments (leads)
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID REFERENCES public.industries(id),
  persona_id UUID REFERENCES public.personas(id),
  -- Business inputs
  monthly_web_traffic INTEGER,
  known_profile_count INTEGER,
  consent_rate DECIMAL(5,2),
  aov DECIMAL(10,2),
  conversion_rate DECIMAL(5,2),
  -- Maturity scores (1-5)
  data_readiness_score INTEGER CHECK (data_readiness_score BETWEEN 1 AND 5),
  activation_score INTEGER CHECK (activation_score BETWEEN 1 AND 5),
  decisioning_score INTEGER CHECK (decisioning_score BETWEEN 1 AND 5),
  experimentation_score INTEGER CHECK (experimentation_score BETWEEN 1 AND 5),
  governance_score INTEGER CHECK (governance_score BETWEEN 1 AND 5),
  -- Calculated readiness score
  growth_readiness_score INTEGER,
  -- Lead info
  email TEXT,
  company_name TEXT,
  -- Tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  share_token UUID UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maturity_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_play_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_play_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for read access (public for most reference data)
CREATE POLICY "Anyone can read industries" ON public.industries FOR SELECT USING (true);
CREATE POLICY "Anyone can read personas" ON public.personas FOR SELECT USING (true);
CREATE POLICY "Anyone can read maturity dimensions" ON public.maturity_dimensions FOR SELECT USING (true);
CREATE POLICY "Anyone can read active growth plays" ON public.growth_plays FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read growth play industries" ON public.growth_play_industries FOR SELECT USING (true);
CREATE POLICY "Anyone can read growth play personas" ON public.growth_play_personas FOR SELECT USING (true);
CREATE POLICY "Anyone can read benchmarks" ON public.benchmarks FOR SELECT USING (true);
CREATE POLICY "Anyone can read content blocks" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "Anyone can read logos" ON public.logos FOR SELECT USING (true);

-- Assessments: anyone can insert (leads), read own via token
CREATE POLICY "Anyone can insert assessments" ON public.assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read assessments by share token" ON public.assessments FOR SELECT USING (true);

-- Admin policies for write access
CREATE POLICY "Admins can update industries" ON public.industries FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update personas" ON public.personas FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update maturity dimensions" ON public.maturity_dimensions FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update growth plays" ON public.growth_plays FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update growth play industries" ON public.growth_play_industries FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update growth play personas" ON public.growth_play_personas FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update benchmarks" ON public.benchmarks FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update content blocks" ON public.content_blocks FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update logos" ON public.logos FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can read all assessments" ON public.assessments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_growth_plays_updated_at BEFORE UPDATE ON public.growth_plays
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_benchmarks_updated_at BEFORE UPDATE ON public.benchmarks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert seed data for industries
INSERT INTO public.industries (name, type) VALUES
  ('Retail', 'retail'),
  ('DTC (Direct-to-Consumer)', 'dtc'),
  ('CPG (Consumer Packaged Goods)', 'cpg'),
  ('Travel & Hospitality', 'travel_hospitality'),
  ('Media/Subscription', 'media_subscription');

-- Insert seed data for personas
INSERT INTO public.personas (name, type) VALUES
  ('Digital Marketing', 'digital_marketing'),
  ('Ecommerce', 'ecommerce'),
  ('CX / Loyalty', 'cx_loyalty'),
  ('Growth', 'growth'),
  ('Data/IT', 'data_it');

-- Insert seed data for maturity dimensions
INSERT INTO public.maturity_dimensions (name, description, level_1_label, level_2_label, level_3_label, level_4_label, level_5_label) VALUES
  ('Data Readiness', 'Data consolidation and quality', 'Siloed', 'Consolidated', 'Unified', 'Real-time', 'Agentic'),
  ('Activation', 'Campaign execution capabilities', 'Manual', 'Rules-based', 'Automated', 'Personalized', 'Predictive'),
  ('Decisioning', 'Decision-making sophistication', 'None', 'Basic', 'Contextual', 'Dynamic', 'AI-driven'),
  ('Experimentation', 'Testing and optimization maturity', 'Ad hoc', 'Campaign-level', 'Frameworked', 'Always-on', 'Continuous Learning'),
  ('Governance', 'Data governance and compliance', 'Reactive', 'Process-defined', 'Cross-functional', 'Transparent', 'Self-optimizing');

-- Insert default content blocks
INSERT INTO public.content_blocks (key, title, content) VALUES
  ('hero_title', 'Hero Title', 'Discover Hidden Revenue & Personalization Lift with BlueConic'),
  ('hero_subtitle', 'Hero Subtitle', 'An interactive, personalized growth assessment based on first-party data, declared preferences, and identity resolution—used by retail, DTC, CPG, and travel leaders.'),
  ('why_matters_stat_1', 'Why This Matters - Stat 1', '73% of customers expect personalized experiences'),
  ('why_matters_stat_2', 'Why This Matters - Stat 2', '80% of revenue comes from 20% of customers'),
  ('why_matters_stat_3', 'Why This Matters - Stat 3', 'First-party data strategies drive 2.9x more revenue'),
  ('pdf_cta_primary', 'PDF CTA Primary', 'Get my report'),
  ('pdf_cta_secondary', 'PDF CTA Secondary', 'Book a Growth Review');