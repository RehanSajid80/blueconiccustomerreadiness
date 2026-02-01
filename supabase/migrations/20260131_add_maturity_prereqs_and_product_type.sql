-- Add product_type column to growth_plays
ALTER TABLE public.growth_plays ADD COLUMN IF NOT EXISTS product_type TEXT;

-- Add challenges and goals columns to assessments (as JSONB arrays)
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS challenges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS company_url TEXT;

-- Update growth plays with maturity prerequisites and product type
UPDATE public.growth_plays SET
  data_readiness_prereq = 3,
  activation_prereq = 2,
  decisioning_prereq = 2,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'CDP only'
WHERE name = 'Lookalike & High-Value Prospect Expansion';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 2,
  decisioning_prereq = 2,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'CDP only'
WHERE name = 'Intent-Based Media Targeting';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 1,
  decisioning_prereq = 1,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'Cross'
WHERE name = 'Engagement → Identity Conversion';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 2,
  decisioning_prereq = 2,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'Cross'
WHERE name = 'Progressive Identity & Preference Building';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 2,
  decisioning_prereq = 2,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'CDP only'
WHERE name = 'First-Purchase Acceleration';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 2,
  decisioning_prereq = 1,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'CDP only'
WHERE name = 'Cart Abandonment Recovery';

UPDATE public.growth_plays SET
  data_readiness_prereq = 3,
  activation_prereq = 3,
  decisioning_prereq = 4,
  experimentation_prereq = 2,
  governance_prereq = 2,
  product_type = 'VWAM'
WHERE name = 'AI-Powered Branded Shopping Assistant';

UPDATE public.growth_plays SET
  data_readiness_prereq = 3,
  activation_prereq = 3,
  decisioning_prereq = 3,
  experimentation_prereq = 2,
  governance_prereq = 2,
  product_type = 'CDP only'
WHERE name = 'Personalized Basket Expansion';

UPDATE public.growth_plays SET
  data_readiness_prereq = 4,
  activation_prereq = 3,
  decisioning_prereq = 4,
  experimentation_prereq = 2,
  governance_prereq = 2,
  product_type = 'CDP only'
WHERE name = 'Predictive Replenishment & Stock-Aware Upsell';

UPDATE public.growth_plays SET
  data_readiness_prereq = 3,
  activation_prereq = 3,
  decisioning_prereq = 3,
  experimentation_prereq = 2,
  governance_prereq = 2,
  product_type = 'Cross'
WHERE name = 'Churn Prediction & Winback';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 2,
  decisioning_prereq = 2,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'Cross'
WHERE name = 'Loyalty Tier Progression';

UPDATE public.growth_plays SET
  data_readiness_prereq = 3,
  activation_prereq = 3,
  decisioning_prereq = 3,
  experimentation_prereq = 2,
  governance_prereq = 2,
  product_type = 'Cross'
WHERE name = 'Dormant Customer Reactivation';

UPDATE public.growth_plays SET
  data_readiness_prereq = 2,
  activation_prereq = 2,
  decisioning_prereq = 2,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'Cross'
WHERE name = 'Advocacy & Referral';

UPDATE public.growth_plays SET
  data_readiness_prereq = 3,
  activation_prereq = 2,
  decisioning_prereq = 3,
  experimentation_prereq = 1,
  governance_prereq = 1,
  product_type = 'CDP only',
  journey_stage = 'AI Discovery'
WHERE name = 'AI Assistant Discovery Presence';
