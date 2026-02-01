import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentData, GrowthPlay } from "@/types/assessment";

interface AIRecommendation {
  play_name: string;
  why_recommended: string;
  evidence_factors: {
    relevance: number;
    evidence_coverage: number;
    consistency: number;
    recency: number;
    data_strength: number;
  };
  matched_challenges: string[];
  matched_goals: string[];
}

interface UseAIRecommendationsResult {
  recommendations: AIRecommendation[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch AI-enhanced recommendations from Supabase Edge Function
 */
export function useAIRecommendations(
  assessment: AssessmentData | null,
  growthPlays: GrowthPlay[],
  industryName?: string,
  personaType?: string
): UseAIRecommendationsResult {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessment || growthPlays.length === 0) {
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "generate-recommendations",
          {
            body: {
              company_name: assessment.company_name,
              industry_name: industryName,
              persona_type: personaType,
              challenges: assessment.challenges || [],
              goals: assessment.goals || [],
              data_readiness_score: assessment.data_readiness_score,
              activation_score: assessment.activation_score,
              decisioning_score: assessment.decisioning_score,
              experimentation_score: assessment.experimentation_score,
              governance_score: assessment.governance_score,
              growth_plays: growthPlays.map((p) => ({
                name: p.name,
                journey_stage: p.journey_stage,
                jtbd: p.jtbd,
              })),
            },
          }
        );

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.success && data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error("Error fetching AI recommendations:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [assessment, growthPlays, industryName, personaType]);

  return { recommendations, loading, error };
}

/**
 * Merge AI recommendations with scored plays to enhance why_recommended
 */
export function mergeAIRecommendations(
  scoredPlays: any[],
  aiRecommendations: AIRecommendation[]
): any[] {
  if (aiRecommendations.length === 0) {
    return scoredPlays;
  }

  return scoredPlays.map((play) => {
    const aiRec = aiRecommendations.find((r) => r.play_name === play.name);

    if (aiRec) {
      return {
        ...play,
        why_recommended: aiRec.why_recommended,
        ai_enhanced: true,
      };
    }

    return play;
  });
}
