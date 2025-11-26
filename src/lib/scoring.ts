import { GrowthPlay, AssessmentData, ScoredGrowthPlay } from "@/types/assessment";

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
  const relevance = play.relevance_score || 50;
  const coverage = play.evidence_coverage || 50;
  const consistency = play.consistency_score || 50;
  const recency = play.recency_score || 50;
  const dataStrength = play.data_strength || 50;

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
      
      // Check industry/persona match for prioritization
      const industryMatch = play.industries?.some(i => i.id === selectedIndustryId) ?? true;
      const personaMatch = play.personas?.some(p => p.id === selectedPersonaId) ?? true;
      
      let whyRecommended = "";
      if (industryMatch && personaMatch) {
        whyRecommended = "Perfect fit for your industry and role";
      } else if (industryMatch) {
        whyRecommended = "Tailored for your industry";
      } else if (personaMatch) {
        whyRecommended = "Aligned with your role";
      } else {
        whyRecommended = "High potential based on your maturity level";
      }

      return {
        ...play,
        confidence_score: confidence,
        why_recommended: whyRecommended,
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
