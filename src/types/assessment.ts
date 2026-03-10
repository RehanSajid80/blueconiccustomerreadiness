export type IndustryType = 'retail' | 'dtc' | 'cpg' | 'travel_hospitality' | 'media_subscription';
export type PersonaType = 'digital_marketing' | 'ecommerce' | 'cx_loyalty' | 'growth' | 'data_it';

// Challenge types - maps to friction points from the meeting
export type ChallengeType =
  | 'high_cac'
  | 'find_prospects'
  | 'anonymous_visitors'
  | 'poor_targeting'
  | 'long_time_to_purchase'
  | 'cart_abandonment'
  | 'low_conversion'
  | 'personalization_difficulty'
  | 'high_churn'
  | 'low_repeat_purchase'
  | 'declining_clv'
  | 'dormant_customers'
  | 'low_loyalty_engagement'
  | 'few_referrals'
  | 'low_aov'
  | 'poor_cross_sell';

// Goal types
export type GoalType =
  | 'reduce_cac'
  | 'increase_conversion'
  | 'improve_retention'
  | 'grow_aov'
  | 'accelerate_time_to_value'
  | 'build_customer_profiles'
  | 'enhance_personalization'
  | 'improve_roi_measurement'
  | 'scale_loyalty'
  | 'leverage_ai';

export interface Challenge {
  id: ChallengeType;
  label: string;
  description: string;
  category: 'acquisition' | 'conversion' | 'retention' | 'loyalty';
}

export interface Goal {
  id: GoalType;
  label: string;
  description: string;
}

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
  product_type: string | null;
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
  first_name?: string;
  last_name?: string;
  company_name?: string;
  company_url?: string;
  email?: string;
  // Challenges and Goals (new fields for growth play mapping)
  challenges?: ChallengeType[];
  goals?: GoalType[];
  // Business Metrics
  monthly_web_traffic: number | null;
  known_profile_count: number | null;
  consent_rate: number | null;
  aov: number | null;
  conversion_rate: number | null;
  // Maturity Scores
  data_readiness_score: number | null;
  activation_score: number | null;
  decisioning_score: number | null;
  experimentation_score: number | null;
  governance_score: number | null;
  // UTM Tracking
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
  matched_challenges?: ChallengeType[];
  matched_goals?: GoalType[];
}

// Challenge-to-Play mapping configuration
export const CHALLENGE_TO_PLAY_MAPPING: Record<ChallengeType, string[]> = {
  high_cac: ['Lookalike & High-Value Prospect Expansion', 'Intent-Based Media Targeting'],
  find_prospects: ['Intent-Based Media Targeting', 'Lookalike & High-Value Prospect Expansion'],
  anonymous_visitors: ['Engagement to Identity Conversion', 'Progressive Identity & Preference Building'],
  poor_targeting: ['Intent-Based Media Targeting', 'Lookalike & High-Value Prospect Expansion'],
  long_time_to_purchase: ['First-Purchase Acceleration', 'Engagement to Identity Conversion'],
  cart_abandonment: ['Cart Abandonment Recovery', 'First-Purchase Acceleration'],
  low_conversion: ['First-Purchase Acceleration', 'AI-Powered Branded Shopping Assistant', 'Cart Abandonment Recovery'],
  personalization_difficulty: ['Progressive Identity & Preference Building', 'Personalized Basket Expansion'],
  high_churn: ['Churn Prediction & Winback', 'Dormant Customer Reactivation'],
  low_repeat_purchase: ['Predictive Replenishment & Stock-Aware Upsell', 'Dormant Customer Reactivation'],
  declining_clv: ['Loyalty Tier Progression', 'Personalized Basket Expansion'],
  dormant_customers: ['Dormant Customer Reactivation', 'Churn Prediction & Winback'],
  low_loyalty_engagement: ['Loyalty Tier Progression', 'Advocacy & Referral'],
  few_referrals: ['Advocacy & Referral', 'Loyalty Tier Progression'],
  low_aov: ['Personalized Basket Expansion', 'First-Purchase Acceleration'],
  poor_cross_sell: ['Personalized Basket Expansion', 'Predictive Replenishment & Stock-Aware Upsell'],
};

// Goal-to-Play mapping
export const GOAL_TO_PLAY_MAPPING: Record<GoalType, string[]> = {
  reduce_cac: ['Lookalike & High-Value Prospect Expansion', 'Intent-Based Media Targeting'],
  increase_conversion: ['First-Purchase Acceleration', 'Cart Abandonment Recovery', 'AI-Powered Branded Shopping Assistant'],
  improve_retention: ['Churn Prediction & Winback', 'Dormant Customer Reactivation', 'Loyalty Tier Progression'],
  grow_aov: ['Personalized Basket Expansion', 'First-Purchase Acceleration'],
  accelerate_time_to_value: ['First-Purchase Acceleration', 'Engagement to Identity Conversion'],
  build_customer_profiles: ['Engagement to Identity Conversion', 'Progressive Identity & Preference Building'],
  enhance_personalization: ['Progressive Identity & Preference Building', 'Personalized Basket Expansion'],
  improve_roi_measurement: ['Intent-Based Media Targeting', 'Lookalike & High-Value Prospect Expansion'],
  scale_loyalty: ['Loyalty Tier Progression', 'Advocacy & Referral'],
  leverage_ai: ['AI-Powered Branded Shopping Assistant', 'AI Assistant Discovery Presence', 'Churn Prediction & Winback'],
};

// Predefined challenges list
export const CHALLENGES: Challenge[] = [
  { id: 'high_cac', label: 'High customer acquisition costs (CAC)', description: 'Spending too much to acquire new customers', category: 'acquisition' },
  { id: 'find_prospects', label: 'Difficulty finding high-value prospects', description: 'Struggling to identify and reach ideal customers', category: 'acquisition' },
  { id: 'anonymous_visitors', label: 'Low anonymous-to-known conversion', description: 'Most website visitors remain unidentified', category: 'acquisition' },
  { id: 'poor_targeting', label: 'Poor ad targeting performance', description: 'Ads not reaching the right audiences', category: 'acquisition' },
  { id: 'long_time_to_purchase', label: 'Long time-to-first-purchase', description: 'Prospects take too long to convert', category: 'conversion' },
  { id: 'cart_abandonment', label: 'High cart abandonment rates', description: 'Shoppers leave without completing purchase', category: 'conversion' },
  { id: 'low_conversion', label: 'Low conversion rates on website', description: 'Website visitors not converting to customers', category: 'conversion' },
  { id: 'personalization_difficulty', label: 'Difficulty personalizing at scale', description: 'Cannot deliver personalized experiences efficiently', category: 'conversion' },
  { id: 'high_churn', label: 'High customer churn rate', description: 'Losing too many customers over time', category: 'retention' },
  { id: 'low_repeat_purchase', label: 'Low repeat purchase frequency', description: 'Customers not coming back to buy again', category: 'retention' },
  { id: 'declining_clv', label: 'Declining customer lifetime value (CLV)', description: 'Customer value decreasing over time', category: 'retention' },
  { id: 'dormant_customers', label: 'Dormant/inactive customer base', description: 'Large portion of customers no longer engaged', category: 'retention' },
  { id: 'low_loyalty_engagement', label: 'Low loyalty program engagement', description: 'Loyalty members not actively participating', category: 'loyalty' },
  { id: 'few_referrals', label: 'Few customer referrals', description: 'Customers not recommending your brand', category: 'loyalty' },
  { id: 'low_aov', label: 'Difficulty increasing AOV', description: 'Average order value remains flat', category: 'loyalty' },
  { id: 'poor_cross_sell', label: 'Poor cross-sell/upsell performance', description: 'Not maximizing revenue per customer', category: 'loyalty' },
];

// Predefined goals list
export const GOALS: Goal[] = [
  { id: 'reduce_cac', label: 'Reduce customer acquisition costs', description: 'Lower the cost to acquire new customers' },
  { id: 'increase_conversion', label: 'Increase conversion rates', description: 'Turn more visitors into customers' },
  { id: 'improve_retention', label: 'Improve customer retention', description: 'Keep customers engaged longer' },
  { id: 'grow_aov', label: 'Grow average order value', description: 'Increase revenue per transaction' },
  { id: 'accelerate_time_to_value', label: 'Accelerate time-to-value for new customers', description: 'Get customers to first purchase faster' },
  { id: 'build_customer_profiles', label: 'Build stronger customer identity/profiles', description: 'Know your customers better' },
  { id: 'enhance_personalization', label: 'Enhance personalization capabilities', description: 'Deliver more relevant experiences' },
  { id: 'improve_roi_measurement', label: 'Improve marketing ROI measurement', description: 'Better track marketing effectiveness' },
  { id: 'scale_loyalty', label: 'Scale loyalty and advocacy programs', description: 'Grow loyal customer base' },
  { id: 'leverage_ai', label: 'Leverage AI for marketing automation', description: 'Use AI to automate and optimize' },
];
