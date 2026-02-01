/**
 * BlueConic Growth Plays - Official Catalog
 *
 * IMPORTANT: The AI can ONLY recommend from these 14 official Growth Plays.
 * Never invent new plays or use unofficial names.
 */

export interface GrowthPlayDefinition {
  id: string;
  name: string;
  journeyStage: string;
  jtbd: string;
  activationChannels: string[];
  featuresUsed: string[];
  primaryMetric: string;
  kpis: string[];
  productType: "CDP only" | "Cross" | "VWAM";
  maturityRequirements: {
    dataReadiness: number;
    activation: number;
    decisioning: number;
    experimentation: number;
    governance: number;
  };
  timeToValue: string;
}

export const GROWTH_PLAYS: GrowthPlayDefinition[] = [
  {
    id: "play_001",
    name: "Lookalike & High-Value Prospect Expansion",
    journeyStage: "Prospecting & Awareness",
    jtbd: "When I need to grow my customer base efficiently, I want to find and target new audiences that behave like my best customers so I can reduce acquisition costs and scale revenue from high-value segments",
    activationChannels: ["Ads", "Display", "Social", "CRM"],
    featuresUsed: ["Insight", "Listener", "Connection", "Segmentation", "AIWB"],
    primaryMetric: "Incremental Revenue Lift",
    kpis: ["CTR", "CAC", "ROAS", "CPA", "AOV"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 3, activation: 2, decisioning: 2, experimentation: 1, governance: 1 },
    timeToValue: "~7 weeks",
  },
  {
    id: "play_002",
    name: "Intent-Based Media Targeting",
    journeyStage: "Prospecting & Awareness",
    jtbd: "When I invest in paid media, I want to identify and prioritize audiences that show genuine intent so I can optimize spend toward buyers who are most likely to convert",
    activationChannels: ["Social", "Ads", "Display", "CTV", "Paid Search", "DSP"],
    featuresUsed: ["Connection", "Segmentation", "Listener", "AIWB"],
    primaryMetric: "Incremental Media Efficiency",
    kpis: ["CPM", "CPA", "CPL", "CPC", "ROAS"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 2, activation: 2, decisioning: 2, experimentation: 1, governance: 1 },
    timeToValue: "~7 weeks",
  },
  {
    id: "play_003",
    name: "Engagement → Identity Conversion",
    journeyStage: "Engagement to Identity",
    jtbd: "When visitors engage with my content anonymously, I want to turn that engagement into identity capture so I can connect behavior to individuals and personalize future experiences",
    activationChannels: ["Web"],
    featuresUsed: ["Experience (XP)", "Dialogue", "Listeners", "Profile Merging", "Consent Management"],
    primaryMetric: "Incremental Identity Conversion Rate",
    kpis: ["Known-to-anonymous ratio", "Profile Merge rate", "Consent Capture Rate"],
    productType: "Cross",
    maturityRequirements: { dataReadiness: 2, activation: 1, decisioning: 1, experimentation: 1, governance: 1 },
    timeToValue: "~6 weeks",
  },
  {
    id: "play_004",
    name: "Progressive Identity & Preference Building",
    journeyStage: "Engagement to Identity",
    jtbd: "When customers start interacting with my brand, I want to capture their preferences and consent gradually so I can personalize responsibly and strengthen trust over time",
    activationChannels: ["Web", "Email"],
    featuresUsed: ["Experience (XP)", "Dialogue", "AIWB", "Listeners", "Consent Management"],
    primaryMetric: "Incremental Profile Enrichment Rate",
    kpis: ["AOV", "Conversion Rate", "CTR", "Completion rate", "Opt-in rate"],
    productType: "Cross",
    maturityRequirements: { dataReadiness: 2, activation: 2, decisioning: 2, experimentation: 1, governance: 1 },
    timeToValue: "~6 weeks",
  },
  {
    id: "play_005",
    name: "First-Purchase Acceleration",
    journeyStage: "Conversion",
    jtbd: "When a prospect shows interest but hasn't purchased yet, I want to personalize the next step in their journey so I can shorten the time-to-first-purchase and improve conversion rates",
    activationChannels: ["Web", "QR Code", "Push", "Ad Platforms"],
    featuresUsed: ["Product Recommendations", "XP", "Dialogue", "Listeners", "AIWB"],
    primaryMetric: "Time to first purchase reduction",
    kpis: ["Conversion Rate", "Time to first purchase", "AOV"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 2, activation: 2, decisioning: 2, experimentation: 1, governance: 1 },
    timeToValue: "~5 weeks",
  },
  {
    id: "play_006",
    name: "Cart Abandonment Recovery",
    journeyStage: "Conversion",
    jtbd: "When shoppers leave items in their cart, I want to re-engage them with timely, context-aware reminders or offers so I can recover lost revenue and protect margins",
    activationChannels: ["Web", "Social", "Ads", "Display", "Email", "Mobile App", "Push"],
    featuresUsed: ["Dialogues", "Connection", "Product Recommendations", "Product Store"],
    primaryMetric: "Incremental cart recovery revenue",
    kpis: ["Conversion Rate", "CTR", "AOV", "Recovery Rate"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 2, activation: 2, decisioning: 1, experimentation: 1, governance: 1 },
    timeToValue: "~5 weeks",
  },
  {
    id: "play_007",
    name: "AI-Powered Branded Shopping Assistant",
    journeyStage: "Conversion",
    jtbd: "When customers are browsing products, I want to provide conversational, personalized guidance so I can increase conversion and differentiate the brand experience",
    activationChannels: ["Web"],
    featuresUsed: ["VWAM"],
    primaryMetric: "Incremental Conversion Value",
    kpis: ["Conversion rate", "Revenue", "AOV", "Engagement Rate"],
    productType: "VWAM",
    maturityRequirements: { dataReadiness: 3, activation: 3, decisioning: 4, experimentation: 2, governance: 2 },
    timeToValue: "TBD",
  },
  {
    id: "play_008",
    name: "Personalized Basket Expansion",
    journeyStage: "Post Purchase Growth",
    jtbd: "When customers are shopping or checking out, I want to recommend personalized bundles or add-ons so I can increase average order value and customer satisfaction",
    activationChannels: ["Web", "Email", "Mobile App"],
    featuresUsed: ["Dialogue", "Connection", "Product Recommendations", "AIWB"],
    primaryMetric: "Incremental AOV",
    kpis: ["AOV", "Bundle Conversion"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 3, activation: 3, decisioning: 3, experimentation: 2, governance: 2 },
    timeToValue: "~9 weeks",
  },
  {
    id: "play_009",
    name: "Predictive Replenishment & Stock-Aware Upsell",
    journeyStage: "Post Purchase Growth",
    jtbd: "When customers are likely to run out of a product or when stock levels shift, I want to automatically prompt the right replenishment or upsell offer so I can increase repeat purchases and prevent lost sales",
    activationChannels: ["Web", "Email", "Push", "SMS", "Mobile App"],
    featuresUsed: ["Dialogue", "Connection", "Product Recommendations", "Product Store", "AIWB"],
    primaryMetric: "Repeat Purchase Rate Uplift",
    kpis: ["Repurchasing rate", "AOV", "CLV"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 4, activation: 3, decisioning: 4, experimentation: 2, governance: 2 },
    timeToValue: "~10 weeks",
  },
  {
    id: "play_010",
    name: "Churn Prediction & Winback",
    journeyStage: "Retention",
    jtbd: "When customer engagement starts declining, I want to detect early signals and trigger personalized winback actions so I can retain revenue and reduce reacquisition costs",
    activationChannels: ["Web", "App Push", "Mobile App", "SMS", "Email", "Ads", "Social", "Display"],
    featuresUsed: ["Experience (XP)", "Dialogue", "Connection", "AIWB", "Listeners", "Segments"],
    primaryMetric: "Incremental Reactivation Revenue",
    kpis: ["CTR", "Conversion Rate", "LTV", "Retention Rate"],
    productType: "Cross",
    maturityRequirements: { dataReadiness: 3, activation: 3, decisioning: 3, experimentation: 2, governance: 2 },
    timeToValue: "~9 weeks",
  },
  {
    id: "play_011",
    name: "Loyalty Tier Progression",
    journeyStage: "Loyalty & Advocacy",
    jtbd: "When customers participate in my loyalty program, I want to personalize incentives and surface progress meaningfully so I can increase participation and repeat purchase frequency",
    activationChannels: ["Web", "Mobile App"],
    featuresUsed: ["Experience (XP)", "Dialogue", "Connection", "AIWB", "Listeners", "Segments"],
    primaryMetric: "Incremental LTV growth",
    kpis: ["Loyalty tier rate", "Tier advancement rate", "Repeat purchase frequency"],
    productType: "Cross",
    maturityRequirements: { dataReadiness: 2, activation: 2, decisioning: 2, experimentation: 1, governance: 1 },
    timeToValue: "~7 weeks",
  },
  {
    id: "play_012",
    name: "Dormant Customer Reactivation",
    journeyStage: "Loyalty & Advocacy",
    jtbd: "When customers haven't purchased in a while, I want to re-engage them with relevant content or offers so I can revive inactive shoppers and restore their purchase frequency",
    activationChannels: ["Web", "App Push", "Mobile App", "SMS", "Email", "Ads", "Social", "Display"],
    featuresUsed: ["Dialogues", "XP", "Connections", "AIWB", "Segments", "Listeners"],
    primaryMetric: "Reactivated Customer Revenue",
    kpis: ["Reactivation Rate", "CPA"],
    productType: "Cross",
    maturityRequirements: { dataReadiness: 3, activation: 3, decisioning: 3, experimentation: 2, governance: 2 },
    timeToValue: "~9 weeks",
  },
  {
    id: "play_013",
    name: "Advocacy & Referral",
    journeyStage: "Loyalty & Advocacy",
    jtbd: "When customers are satisfied, I want to prompt and reward advocacy so I can grow through referrals and strengthen brand trust",
    activationChannels: ["Web"],
    featuresUsed: ["Dialogues", "XP", "Connections", "AIWB", "Segments", "Listeners"],
    primaryMetric: "Incremental Referral Revenue",
    kpis: ["Referral rate", "CPA", "NPS"],
    productType: "Cross",
    maturityRequirements: { dataReadiness: 2, activation: 2, decisioning: 2, experimentation: 1, governance: 1 },
    timeToValue: "~6 weeks",
  },
  {
    id: "play_014",
    name: "AI Assistant Discovery Presence",
    journeyStage: "AI Discovery",
    jtbd: "When customers use AI assistants to explore products, I want my brand's offers and content to appear intelligently in those interactions so I can capture demand in new discovery channels",
    activationChannels: ["Web", "Social", "Ads", "Display", "QR Code"],
    featuresUsed: ["MCP Server"],
    primaryMetric: "Incremental Assistant-Attributed Revenue",
    kpis: ["Views", "CTR", "Newsletter subscribers"],
    productType: "CDP only",
    maturityRequirements: { dataReadiness: 3, activation: 2, decisioning: 3, experimentation: 1, governance: 1 },
    timeToValue: "TBD",
  },
];

/**
 * Get a Growth Play by name
 */
export function getGrowthPlayByName(name: string): GrowthPlayDefinition | undefined {
  return GROWTH_PLAYS.find((p) => p.name === name);
}

/**
 * Get Growth Plays by journey stage
 */
export function getGrowthPlaysByStage(stage: string): GrowthPlayDefinition[] {
  return GROWTH_PLAYS.filter((p) => p.journeyStage === stage);
}

/**
 * Get all journey stages
 */
export function getJourneyStages(): string[] {
  return [...new Set(GROWTH_PLAYS.map((p) => p.journeyStage))];
}

/**
 * Check if a play name is valid (from the official catalog)
 */
export function isValidGrowthPlay(name: string): boolean {
  return GROWTH_PLAYS.some((p) => p.name === name);
}

/**
 * Get plays that meet maturity requirements
 */
export function getEligiblePlays(maturityScores: {
  dataReadiness: number;
  activation: number;
  decisioning: number;
  experimentation?: number;
  governance: number;
}): GrowthPlayDefinition[] {
  return GROWTH_PLAYS.filter((play) => {
    const req = play.maturityRequirements;
    return (
      maturityScores.dataReadiness >= req.dataReadiness &&
      maturityScores.activation >= req.activation &&
      maturityScores.decisioning >= req.decisioning &&
      (maturityScores.experimentation ?? 3) >= req.experimentation &&
      maturityScores.governance >= req.governance
    );
  });
}
