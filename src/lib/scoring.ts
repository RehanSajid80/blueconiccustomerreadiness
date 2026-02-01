import { GrowthPlay, AssessmentData, ScoredGrowthPlay, ChallengeType, GoalType, CHALLENGE_TO_PLAY_MAPPING, GOAL_TO_PLAY_MAPPING } from "@/types/assessment";

/**
 * Calculate evidence factors based on customer input
 * Returns scores 0-100 for each factor
 */
function calculateEvidenceFactors(
  play: GrowthPlay,
  assessment: AssessmentData
): { relevance: number; coverage: number; consistency: number; recency: number; dataStrength: number } {
  const challenges = assessment.challenges || [];
  const goals = assessment.goals || [];

  // Calculate relevance based on challenge and goal matching
  let relevanceScore = 40; // Base score
  let matchCount = 0;

  // Check if challenges match this play
  challenges.forEach((challenge) => {
    const mappedPlays = CHALLENGE_TO_PLAY_MAPPING[challenge] || [];
    if (mappedPlays.includes(play.name)) {
      relevanceScore += 20; // Strong boost for matching challenges
      matchCount++;
    }
  });

  // Check if goals match this play
  goals.forEach((goal) => {
    const mappedPlays = GOAL_TO_PLAY_MAPPING[goal] || [];
    if (mappedPlays.includes(play.name)) {
      relevanceScore += 15; // Moderate boost for matching goals
      matchCount++;
    }
  });

  relevanceScore = Math.min(100, relevanceScore);

  // Coverage: how many data points support this recommendation
  const dataPoints = [
    assessment.industry_id,
    assessment.persona_id,
    assessment.data_readiness_score,
    assessment.activation_score,
    assessment.decisioning_score,
    assessment.governance_score,
    challenges.length > 0,
    goals.length > 0,
    assessment.company_name,
    assessment.company_url,
  ].filter(Boolean).length;
  const coverage = Math.min(100, (dataPoints / 10) * 100);

  // Consistency: based on match count and alignment
  const consistency = matchCount > 0
    ? Math.min(100, 50 + matchCount * 12)
    : 45;

  // Recency: all data is current from this assessment
  const recency = 85;

  // Data strength: based on completeness
  const hasAllMaturity = [
    assessment.data_readiness_score,
    assessment.activation_score,
    assessment.decisioning_score,
    assessment.governance_score
  ].every(Boolean);
  const hasChallengesAndGoals = challenges.length > 0 && goals.length > 0;
  const dataStrength = hasAllMaturity && hasChallengesAndGoals ? 90 : hasAllMaturity ? 75 : 55;

  return { relevance: relevanceScore, coverage, consistency, recency, dataStrength };
}

/**
 * Generate a dynamic "why recommended" explanation based on matching challenges and goals
 */
function generateWhyRecommended(
  play: GrowthPlay,
  assessment: AssessmentData,
  matchedChallenges: ChallengeType[],
  matchedGoals: GoalType[]
): string {
  const challenges = assessment.challenges || [];
  const goals = assessment.goals || [];

  // Find which challenges and goals match this play
  const challengeMatches: string[] = [];
  const goalMatches: string[] = [];

  const challengeLabels: Record<ChallengeType, string> = {
    high_cac: "high acquisition costs",
    find_prospects: "finding quality prospects",
    anonymous_visitors: "anonymous visitor conversion",
    poor_targeting: "ad targeting",
    long_time_to_purchase: "slow purchase cycles",
    cart_abandonment: "cart abandonment",
    low_conversion: "conversion rates",
    personalization_difficulty: "personalization at scale",
    high_churn: "customer churn",
    low_repeat_purchase: "repeat purchases",
    declining_clv: "customer lifetime value",
    dormant_customers: "dormant customers",
    low_loyalty_engagement: "loyalty engagement",
    few_referrals: "customer referrals",
    low_aov: "average order value",
    poor_cross_sell: "cross-sell performance",
  };

  const goalLabels: Record<GoalType, string> = {
    reduce_cac: "reducing acquisition costs",
    increase_conversion: "increasing conversions",
    improve_retention: "improving retention",
    grow_aov: "growing AOV",
    accelerate_time_to_value: "accelerating time-to-value",
    build_customer_profiles: "building customer profiles",
    enhance_personalization: "enhancing personalization",
    improve_roi_measurement: "improving ROI measurement",
    scale_loyalty: "scaling loyalty programs",
    leverage_ai: "leveraging AI",
  };

  challenges.forEach((challenge) => {
    const mappedPlays = CHALLENGE_TO_PLAY_MAPPING[challenge] || [];
    if (mappedPlays.includes(play.name)) {
      challengeMatches.push(challengeLabels[challenge] || challenge);
    }
  });

  goals.forEach((goal) => {
    const mappedPlays = GOAL_TO_PLAY_MAPPING[goal] || [];
    if (mappedPlays.includes(play.name)) {
      goalMatches.push(goalLabels[goal] || goal);
    }
  });

  // Build explanation
  if (challengeMatches.length > 0 && goalMatches.length > 0) {
    return `Directly addresses your ${challengeMatches[0]} challenge while supporting your goal of ${goalMatches[0]}. This play aligns with your current maturity level and can deliver measurable results.`;
  } else if (challengeMatches.length > 0) {
    return `Recommended because it directly tackles your ${challengeMatches.slice(0, 2).join(" and ")} challenge${challengeMatches.length > 1 ? "s" : ""}. Customers with similar profiles have seen significant improvements.`;
  } else if (goalMatches.length > 0) {
    return `Supports your goal of ${goalMatches[0]}. This play leverages BlueConic's core capabilities to drive measurable business outcomes.`;
  } else {
    return `Recommended based on your maturity profile. This play can help establish foundational capabilities for customer growth.`;
  }
}

/**
 * Calculate confidence score for a growth play
 * Based on 5 factors with specific weights:
 * - Relevance: 45%
 * - Evidence Coverage: 20%
 * - Consistency: 15%
 * - Recency: 10%
 * - Data Strength: 10%
 *
 * Score is clamped between 5% and 95%
 */
export function calculateConfidenceScore(
  play: GrowthPlay,
  assessment: AssessmentData
): number {
  // Calculate dynamic evidence factors based on customer input
  const evidence = calculateEvidenceFactors(play, assessment);

  // Use calculated values primarily, stored values as fallback
  const relevance = evidence.relevance;
  const coverage = evidence.coverage;
  const consistency = evidence.consistency;
  const recency = evidence.recency;
  const dataStrength = evidence.dataStrength;

  // Weighted sum
  const baseScore = (
    relevance * 0.45 +
    coverage * 0.20 +
    consistency * 0.15 +
    recency * 0.10 +
    dataStrength * 0.10
  );

  // Adjust based on maturity alignment
  const maturityBonus = calculateMaturityAlignment(play, assessment);
  const adjustedScore = baseScore * (1 + maturityBonus / 100);

  // Clamp between 5 and 95
  return Math.max(5, Math.min(95, Math.round(adjustedScore)));
}

/**
 * Calculate maturity alignment bonus/penalty
 * Returns percentage adjustment (-20 to +20)
 */
function calculateMaturityAlignment(
  play: GrowthPlay,
  assessment: AssessmentData
): number {
  const dimensions = [
    { prereq: play.data_readiness_prereq, actual: assessment.data_readiness_score },
    { prereq: play.activation_prereq, actual: assessment.activation_score },
    { prereq: play.decisioning_prereq, actual: assessment.decisioning_score },
    { prereq: play.experimentation_prereq, actual: assessment.experimentation_score },
    { prereq: play.governance_prereq, actual: assessment.governance_score },
  ];

  let totalDiff = 0;
  let count = 0;

  dimensions.forEach(({ prereq, actual }) => {
    if (prereq && actual) {
      totalDiff += actual - prereq;
      count++;
    }
  });

  if (count === 0) return 0;

  const avgDiff = totalDiff / count;
  // Convert to percentage bonus/penalty (-20 to +20)
  return Math.max(-20, Math.min(20, avgDiff * 5));
}

/**
 * Calculate overall growth readiness score (0-100)
 */
export function calculateReadinessScore(assessment: AssessmentData): number {
  const scores = [
    assessment.data_readiness_score,
    assessment.activation_score,
    assessment.decisioning_score,
    assessment.experimentation_score,
    assessment.governance_score,
  ].filter((s): s is number => s !== null);

  if (scores.length === 0) return 0;

  // Convert 1-5 scale to 0-100
  const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return Math.round(((avgScore - 1) / 4) * 100);
}

/**
 * Filter and score growth plays based on assessment
 */
export function scoreGrowthPlays(
  plays: GrowthPlay[],
  assessment: AssessmentData,
  selectedIndustryId: string | null,
  selectedPersonaId: string | null
): ScoredGrowthPlay[] {
  const challenges = assessment.challenges || [];
  const goals = assessment.goals || [];

  return plays
    .filter(play => {
      // Filter by maturity prerequisites
      if (play.data_readiness_prereq && assessment.data_readiness_score) {
        if (assessment.data_readiness_score < play.data_readiness_prereq) return false;
      }
      if (play.activation_prereq && assessment.activation_score) {
        if (assessment.activation_score < play.activation_prereq) return false;
      }
      if (play.decisioning_prereq && assessment.decisioning_score) {
        if (assessment.decisioning_score < play.decisioning_prereq) return false;
      }
      if (play.experimentation_prereq && assessment.experimentation_score) {
        if (assessment.experimentation_score < play.experimentation_prereq) return false;
      }
      if (play.governance_prereq && assessment.governance_score) {
        if (assessment.governance_score < play.governance_prereq) return false;
      }
      return true;
    })
    .map(play => {
      const confidence = calculateConfidenceScore(play, assessment);

      // Find matched challenges and goals
      const matchedChallenges = challenges.filter((challenge) => {
        const mappedPlays = CHALLENGE_TO_PLAY_MAPPING[challenge] || [];
        return mappedPlays.includes(play.name);
      });

      const matchedGoals = goals.filter((goal) => {
        const mappedPlays = GOAL_TO_PLAY_MAPPING[goal] || [];
        return mappedPlays.includes(play.name);
      });

      // Generate dynamic why_recommended based on matches
      const whyRecommended = generateWhyRecommended(play, assessment, matchedChallenges, matchedGoals);

      return {
        ...play,
        confidence_score: confidence,
        why_recommended: whyRecommended,
        matched_challenges: matchedChallenges,
        matched_goals: matchedGoals,
      };
    })
    .filter(play => play.confidence_score >= 50)
    .sort((a, b) => b.confidence_score - a.confidence_score);
}

/**
 * Get maturity level label
 */
export function getMaturityLabel(score: number | null): string {
  if (!score) return "Not assessed";
  const labels = ["Siloed", "Consolidated", "Unified", "Real-time", "Agentic"];
  return labels[score - 1] || "Unknown";
}

/**
 * Get maturity level labels for all dimensions
 */
export const MATURITY_LABELS: Record<string, string[]> = {
  data_readiness: ["Siloed", "Consolidated", "Unified", "Real-time", "Agentic"],
  activation: ["Manual", "Rules-based", "Automated", "Personalized", "Predictive"],
  decisioning: ["None", "Basic", "Contextual", "Dynamic", "AI-driven"],
  experimentation: ["Ad hoc", "Campaign-level", "Frameworked", "Always-on", "Continuous Learning"],
  governance: ["Reactive", "Process-defined", "Cross-functional", "Transparent", "Self-optimizing"],
};

export function getDimensionLabel(dimension: string, score: number | null): string {
  if (!score) return "Not assessed";
  const labels = MATURITY_LABELS[dimension];
  if (!labels) return "Unknown";
  return labels[score - 1] || "Unknown";
}
