export type IndustryType = 'retail' | 'dtc' | 'cpg' | 'travel_hospitality' | 'media_subscription';
export type PersonaType = 'digital_marketing' | 'ecommerce' | 'cx_loyalty' | 'growth' | 'data_it';

export interface Industry {
  id: string;
  name: string;
  type: IndustryType;
}

export interface Persona {
  id: string;
  name: string;
  type: PersonaType;
}

export interface MaturityDimension {
  id: string;
  name: string;
  description: string | null;
  level_1_label: string;
  level_2_label: string;
  level_3_label: string;
  level_4_label: string;
  level_5_label: string;
}

export interface GrowthPlay {
  id: string;
  name: string;
  is_active: boolean;
  journey_stage: string | null;
  jtbd: string | null;
  where_to_activate: string | null;
  features_to_use: string | null;
  primary_success_metric: string | null;
  kpis: string | null;
  estimated_impact_min: number | null;
  estimated_impact_max: number | null;
  messaging_block: string | null;
  blueconic_value_map: string | null;
  complexity: string | null;
  risk_mitigation: string | null;
  deliverables: string | null;
  prerequisites: string | null;
  time_to_value: string | null;
  data_readiness_prereq: number | null;
  activation_prereq: number | null;
  decisioning_prereq: number | null;
  experimentation_prereq: number | null;
  governance_prereq: number | null;
  relevance_score: number | null;
  evidence_coverage: number | null;
  consistency_score: number | null;
  recency_score: number | null;
  data_strength: number | null;
  asset_url: string | null;
  icon_name: string | null;
  industries?: Industry[];
  personas?: Persona[];
}

export interface Benchmark {
  id: string;
  industry_id: string;
  consent_rate_avg: number | null;
  declared_data_capture_avg: number | null;
  conversion_lift_min: number | null;
  conversion_lift_max: number | null;
  example_companies: string | null;
}

export interface ContentBlock {
  id: string;
  key: string;
  title: string | null;
  content: string;
}

export interface Logo {
  id: string;
  industry_id: string;
  company_name: string;
  logo_url: string;
  display_order: number;
}

export interface AssessmentData {
  industry_id: string | null;
  persona_id: string | null;
  monthly_web_traffic: number | null;
  known_profile_count: number | null;
  consent_rate: number | null;
  aov: number | null;
  conversion_rate: number | null;
  data_readiness_score: number | null;
  activation_score: number | null;
  decisioning_score: number | null;
  experimentation_score: number | null;
  governance_score: number | null;
  email?: string;
  company_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface AssessmentResult extends AssessmentData {
  id: string;
  growth_readiness_score: number | null;
  share_token: string;
  created_at: string;
}

export interface ScoredGrowthPlay extends GrowthPlay {
  confidence_score: number;
  why_recommended: string;
}
