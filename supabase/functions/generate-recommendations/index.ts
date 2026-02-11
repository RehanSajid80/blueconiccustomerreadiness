import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { storeIntelligence } from "../_shared/memory-client.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// The 14 official Growth Plays - AI can ONLY recommend from this list
const GROWTH_PLAYS_CATALOG = [
  "Lookalike & High-Value Prospect Expansion",
  "Intent-Based Media Targeting",
  "Engagement → Identity Conversion",
  "Progressive Identity & Preference Building",
  "First-Purchase Acceleration",
  "Cart Abandonment Recovery",
  "AI-Powered Branded Shopping Assistant",
  "Personalized Basket Expansion",
  "Predictive Replenishment & Stock-Aware Upsell",
  "Churn Prediction & Winback",
  "Loyalty Tier Progression",
  "Dormant Customer Reactivation",
  "Advocacy & Referral",
  "AI Assistant Discovery Presence",
];

const SYSTEM_PROMPT = `You are the BlueConic Customer Readiness Agent. Your role is to analyze customer assessment data and generate personalized "why recommended" explanations for Growth Plays.

## CRITICAL RULES

1. You may ONLY generate recommendations for these 14 official Growth Plays:
${GROWTH_PLAYS_CATALOG.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}

2. You must NEVER:
   - Invent new growth plays
   - Use unofficial play names
   - Ignore the customer's stated challenges and goals

3. For each play, generate a compelling, personalized "why recommended" explanation that:
   - References the customer's specific challenges or goals
   - Explains how the play addresses their needs
   - Uses the customer's industry context when relevant
   - Is 2-3 sentences maximum
   - Avoids generic marketing language

4. Calculate evidence factors (0-100) for each play:
   - relevance: How well the play matches stated challenges/goals
   - evidence_coverage: How many quiz responses support this play
   - consistency: How consistent signals are across different inputs
   - recency: Weight toward current priorities
   - data_strength: Quality of supporting data

## OUTPUT FORMAT

Return valid JSON with this structure:
{
  "recommendations": [
    {
      "play_name": "<exact name from the 14 plays>",
      "why_recommended": "<personalized 2-3 sentence explanation>",
      "evidence_factors": {
        "relevance": <0-100>,
        "evidence_coverage": <0-100>,
        "consistency": <0-100>,
        "recency": <0-100>,
        "data_strength": <0-100>
      },
      "matched_challenges": ["<challenge_ids that match>"],
      "matched_goals": ["<goal_ids that match>"]
    }
  ]
}`;

interface AssessmentInput {
  company_name?: string;
  industry_name?: string;
  persona_type?: string;
  challenges: string[];
  goals: string[];
  data_readiness_score: number;
  activation_score: number;
  decisioning_score: number;
  experimentation_score?: number;
  governance_score: number;
  growth_plays: Array<{
    name: string;
    journey_stage: string;
    jtbd: string;
  }>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: AssessmentInput = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const userPrompt = `
Analyze this customer assessment and generate personalized "why recommended" explanations for applicable Growth Plays.

## CUSTOMER PROFILE
- Company: ${input.company_name || "Unknown"}
- Industry: ${input.industry_name || "Not specified"}
- Role: ${input.persona_type || "Not specified"}

## MATURITY SCORES (1-5 scale)
- Data Readiness: ${input.data_readiness_score || 3}
- Activation: ${input.activation_score || 3}
- Decisioning: ${input.decisioning_score || 3}
- Experimentation: ${input.experimentation_score || 3}
- Governance: ${input.governance_score || 3}

## STATED CHALLENGES
${input.challenges.length > 0 ? input.challenges.map(c => `- ${c}`).join('\n') : "- None specified"}

## STATED GOALS
${input.goals.length > 0 ? input.goals.map(g => `- ${g}`).join('\n') : "- None specified"}

## AVAILABLE GROWTH PLAYS
${input.growth_plays.map(p => `
### ${p.name}
- Stage: ${p.journey_stage}
- JTBD: ${p.jtbd}
`).join('\n')}

Generate personalized recommendations for the most relevant plays (up to 5). Focus on plays that directly address the customer's challenges and goals.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const recommendations = JSON.parse(content);

    // Validate that all recommended plays are from the official catalog
    const validatedRecommendations = recommendations.recommendations?.filter(
      (rec: any) => GROWTH_PLAYS_CATALOG.includes(rec.play_name)
    ) || [];

    // MEMORY WRITE: Store assessment result in shared memory layer
    const topPlays = validatedRecommendations.slice(0, 3).map((r: any) => r.play_name).join(", ");
    const avgScore = Math.round(((input.data_readiness_score || 3) + (input.activation_score || 3) + (input.decisioning_score || 3) + (input.governance_score || 3)) / 4 * 20);
    const memoryContent = `[Assessment] ${input.company_name || "Anonymous"} (${input.industry_name || "Unknown"}, ${input.persona_type || "Unknown"}) scored ${avgScore}/100 readiness. Maturity: Data=${input.data_readiness_score}, Activation=${input.activation_score}, Decisioning=${input.decisioning_score}, Governance=${input.governance_score}. Challenges: ${(input.challenges || []).join(", ")}. Goals: ${(input.goals || []).join(", ")}. Top plays: ${topPlays}.`;
    storeIntelligence(memoryContent, {
      type: "assessment_result",
      company: input.company_name,
      industry: input.industry_name,
      persona: input.persona_type,
      readiness_score: avgScore,
      source: "generate_recommendations",
    }).catch(e => console.warn("[Memory] Failed to store assessment:", e));

    return new Response(
      JSON.stringify({
        success: true,
        recommendations: validatedRecommendations
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        recommendations: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
