import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentResult, GrowthPlay, Benchmark, ScoredGrowthPlay, Industry, Persona, ChallengeType, GoalType } from "@/types/assessment";
import { scoreGrowthPlays, getMaturityLabel } from "@/lib/scoring";
import { useAIRecommendations, mergeAIRecommendations } from "@/hooks/useAIRecommendations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import blueconicLogo from "@/assets/blueconic-logo.png";
import {
  Download,
  Mail,
  Share2,
  TrendingUp,
  Target,
  Lightbulb,
  Database,
  Zap,
  Brain,
  BarChart3,
  Shield,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Sparkles,
  AlertTriangle,
  Award,
} from "lucide-react";

const getMaturityBand = (score: number): { band: string; description: string } => {
  if (score <= 20) return { band: "Emerging", description: "Early stages of data-driven growth" };
  if (score <= 40) return { band: "Scaling", description: "Building foundational capabilities" };
  if (score <= 60) return { band: "Transforming", description: "Accelerating toward intelligent growth" };
  if (score <= 80) return { band: "Intelligent", description: "Advanced data activation and decisioning" };
  return { band: "Autonomous", description: "AI-driven, self-optimizing growth engine" };
};

const getPillarInsight = (pillar: string, score: number): string => {
  const insights: Record<string, Record<number, string>> = {
    data_readiness: {
      1: "Your data is siloed and fragmented, directly limiting personalization potential and suppressing ROAS.",
      2: "Some data consolidation exists, but gaps in unification are slowing your ability to act on customer signals.",
      3: "Data is mostly unified across major channels—a solid foundation for scaling activation.",
      4: "Strong real-time data foundation enabling responsive customer experiences.",
      5: "Automated, self-maintaining data infrastructure driving continuous optimization.",
    },
    activation: {
      1: "Activation relies on manual pushes and exports, limiting campaign velocity and increasing CAC.",
      2: "Basic automation helps, but static rules prevent real-time responsiveness.",
      3: "Automated flows are operational—ready to layer in behavioral triggers.",
      4: "Personalized journeys react to customer behavior in real time.",
      5: "Predictive, self-optimizing activation maximizing every customer touchpoint.",
    },
    decisioning: {
      1: "Manual, rule-based decisions are blocking true 1:1 experiences and leaving revenue on the table.",
      2: "Basic if/then logic provides structure but misses real-time context.",
      3: "Contextual decisions based on segments show progress toward personalization.",
      4: "Dynamic decisioning adjusts in real time to customer signals.",
      5: "AI-driven next-best-experience selection across all channels.",
    },
    governance: {
      1: "Reactive governance is increasing risk and slowing innovation.",
      2: "Documented processes exist but aren't consistently followed.",
      3: "Cross-functional governance provides real oversight and accountability.",
      4: "Governance is woven into daily workflows, enabling speed with control.",
      5: "Automated, transparent, self-optimizing governance powering compliant growth.",
    },
  };
  return insights[pillar]?.[score] || "Assessment data unavailable.";
};

const getPersonaLabel = (type: string): string => {
  const labels: Record<string, string> = {
    digital_marketing: "Digital Marketing",
    ecommerce: "Leadership",
    cx_loyalty: "Customer Experience",
    growth: "Growth",
    data_it: "Data/IT",
  };
  return labels[type] || type;
};

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [scoredPlays, setScoredPlays] = useState<ScoredGrowthPlay[]>([]);
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [allGrowthPlays, setAllGrowthPlays] = useState<GrowthPlay[]>([]);

  // AI-enhanced recommendations from the generate-recommendations edge function
  const { recommendations: aiRecommendations } = useAIRecommendations(
    assessment,
    allGrowthPlays,
    industry?.name,
    persona?.type
  );

  // Merge AI "why_recommended" into scored plays when available
  useEffect(() => {
    if (aiRecommendations.length > 0 && scoredPlays.length > 0) {
      const merged = mergeAIRecommendations(scoredPlays, aiRecommendations);
      setScoredPlays(merged);
    }
    // Only re-merge when AI recommendations arrive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiRecommendations]);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    async function loadResults() {
      setLoading(true);

      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .single();

      if (assessmentError || !assessmentData) {
        navigate("/");
        return;
      }

      const formattedAssessment = {
        ...assessmentData,
        challenges: (assessmentData.challenges as unknown as ChallengeType[]) || [],
        goals: (assessmentData.goals as unknown as GoalType[]) || [],
      };
      setAssessment(formattedAssessment);

      // Load industry and persona details
      if (assessmentData.industry_id) {
        const { data: industryData } = await supabase
          .from("industries")
          .select("*")
          .eq("id", assessmentData.industry_id)
          .single();
        if (industryData) setIndustry(industryData);
      }

      if (assessmentData.persona_id) {
        const { data: personaData } = await supabase
          .from("personas")
          .select("*")
          .eq("id", assessmentData.persona_id)
          .single();
        if (personaData) setPersona(personaData);
      }

      // Load growth plays
      const { data: playsData } = await supabase
        .from("growth_plays")
        .select(`
          *,
          industries:growth_play_industries(industry:industries(*)),
          personas:growth_play_personas(persona:personas(*))
        `)
        .eq("is_active", true);

      if (playsData) {
        const transformedPlays: GrowthPlay[] = playsData.map((play: any) => ({
          ...play,
          industries: play.industries?.map((i: any) => i.industry) || [],
          personas: play.personas?.map((p: any) => p.persona) || [],
        }));

        setAllGrowthPlays(transformedPlays);

        const scored = scoreGrowthPlays(
          transformedPlays,
          formattedAssessment,
          assessmentData.industry_id,
          assessmentData.persona_id
        );
        setScoredPlays(scored);
      }

      // Load benchmark
      if (assessmentData.industry_id) {
        const { data: benchmarkData } = await supabase
          .from("benchmarks")
          .select("*")
          .eq("industry_id", assessmentData.industry_id)
          .maybeSingle();

        if (benchmarkData) setBenchmark(benchmarkData);
      }

      setLoading(false);
    }

    loadResults();
  }, [id, navigate]);

  if (loading || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating your personalized report...</p>
        </div>
      </div>
    );
  }

  const readinessScore = assessment.growth_readiness_score || 0;
  const avgMaturityScore = (
    (assessment.data_readiness_score || 0) +
    (assessment.activation_score || 0) +
    (assessment.decisioning_score || 0) +
    (assessment.governance_score || 0)
  ) / 4;
  const { band, description } = getMaturityBand(readinessScore);
  const companyName = assessment.company_name || "Your Organization";

  const maturityPillars = [
    { key: "data_readiness", name: "Data Readiness", score: assessment.data_readiness_score || 0, icon: Database, color: "text-blue-600" },
    { key: "activation", name: "Activation", score: assessment.activation_score || 0, icon: Zap, color: "text-green-600" },
    { key: "decisioning", name: "Decisioning", score: assessment.decisioning_score || 0, icon: Brain, color: "text-purple-600" },
    { key: "governance", name: "Governance", score: assessment.governance_score || 0, icon: Shield, color: "text-orange-600" },
  ];

  const highValueOpportunities = [
    {
      title: "Identity Resolution",
      description: "Convert anonymous traffic into known customers through progressive profiling and cross-device identity stitching.",
      impact: "Brands at your maturity level typically unlock 20 to 35% revenue lift through identity resolution and cart rescue optimization.",
    },
    {
      title: "Zero/First Party Data Capture",
      description: "Build richer customer profiles through declared preferences, reducing dependency on third-party data and lowering CAC.",
      impact: "First-party audience building reduces acquisition costs by 15 to 25% compared to third-party data strategies.",
    },
    {
      title: "Dynamic Media Suppression",
      description: "Stop wasting ad spend on converted customers and high-intent visitors already in your funnel.",
      impact: "Dynamic suppression alone saves 7.5 to 18% of media spend for similar organizations.",
    },
    {
      title: "Real-Time Cross-Channel Activation",
      description: "Orchestrate consistent experiences across email, web, ads, and mobile based on live customer signals.",
      impact: "Real-time activation typically drives 40 to 60% improvement in campaign performance metrics.",
    },
    {
      title: "Unified Governance and PII Automation",
      description: "Automate consent management and privacy compliance across all customer touchpoints.",
      impact: "Automated governance reduces compliance risk while enabling faster speed to market.",
    },
  ];

  const roadmapStages = [
    {
      stage: "Stage 1",
      title: "Unify + Identify",
      description: "Fix fragmentation, unify profiles across touchpoints, implement identity resolution.",
      outcomes: ["Single customer view", "Identity graph foundation", "Reduced data silos"],
      icon: Database,
    },
    {
      stage: "Stage 2",
      title: "Activate + Personalize",
      description: "Move from manual campaigns to real-time journeys with dynamic audiences.",
      outcomes: ["ROAS ↑ 25-40%", "Campaign velocity ↑", "CAC ↓ 15-20%"],
      icon: Zap,
    },
    {
      stage: "Stage 3",
      title: "Optimize + Learn",
      description: "Deploy always-on testing, behavioral triggers, and rapid experiment cycles.",
      outcomes: ["AOV ↑ 10-20%", "Conversion rate ↑", "Test velocity 3x"],
      icon: TrendingUp,
    },
    {
      stage: "Stage 4",
      title: "Intelligent Decisioning",
      description: "Introduce AI-driven next-best-experience and cross-channel orchestration.",
      outcomes: ["Churn ↓ 20-30%", "LTV ↑", "Autonomous optimization"],
      icon: Brain,
    },
  ];

  const recommendedCapabilities = [
    "Real-time identity resolution",
    "Progressive profiling",
    "First-party data capture",
    "Predictive activation + orchestration",
    "Unified data governance",
    "Cross-channel decisioning",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={blueconicLogo} alt="BlueConic" className="h-8" />
            <Badge variant="outline" className="text-primary border-primary/30">
              Intelligent Growth Maturity Report
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Section 1: Executive Summary */}
        <section className="mb-12">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <Award className="h-6 w-6 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-navy">
                Intelligent Growth Maturity Report
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-navy mb-4">
              Executive Summary for {companyName}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {avgMaturityScore.toFixed(1)}
                  </span>
                  <span className="text-xl text-muted-foreground">/5</span>
                </div>
                <Badge className="text-base px-4 py-1.5 mb-4 bg-primary/10 text-primary border-primary/30">
                  {band}
                </Badge>
                <p className="text-muted-foreground">{description}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-foreground leading-relaxed">
                  Based on your responses, <strong>{companyName}</strong> is operating at a{" "}
                  <strong>Level {avgMaturityScore.toFixed(1)}</strong> maturity, placing you in the{" "}
                  <strong>{band}</strong> band.
                </p>
                {persona && (
                  <p className="text-muted-foreground">
                    As a <strong>{getPersonaLabel(persona.type)}</strong> leader
                    {industry && <> in <strong>{industry.name}</strong></>}, your biggest opportunities 
                    lie in accelerating customer acquisition efficiency, improving personalization velocity, 
                    and building a unified data foundation for intelligent growth.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2: Maturity Score Breakdown */}
        <section className="mb-12">
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-navy">Maturity Score Breakdown</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-muted/30 rounded-xl text-center">
                <div className="text-4xl font-bold text-primary mb-1">{readinessScore}</div>
                <div className="text-sm text-muted-foreground">Overall Growth Readiness Score</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl text-center">
                <div className="text-4xl font-bold text-secondary mb-1">{avgMaturityScore.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average Pillar Score (1-5)</div>
              </div>
            </div>

            <div className="space-y-6">
              {maturityPillars.map((pillar) => (
                <div key={pillar.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <pillar.icon className={`h-5 w-5 ${pillar.color}`} />
                      <span className="font-semibold">{pillar.name}</span>
                    </div>
                    <span className="text-2xl font-bold">{pillar.score}/5</span>
                  </div>
                  <Progress value={((pillar.score - 1) / 4) * 100} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {getPillarInsight(pillar.key, pillar.score)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 3: Strategic Diagnosis by Pillar */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Strategic Diagnosis by Pillar
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {maturityPillars.map((pillar) => (
              <Card key={pillar.key} className="p-5 border-l-4" style={{ borderLeftColor: pillar.color.replace('text-', 'var(--') }}>
                <div className="flex items-center gap-2 mb-3">
                  <pillar.icon className={`h-5 w-5 ${pillar.color}`} />
                  <h3 className="font-semibold">{pillar.name}</h3>
                  <Badge variant="outline" className="ml-auto">{getMaturityLabel(pillar.score)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getPillarInsight(pillar.key, pillar.score)}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4: High-Value Opportunities */}
        <section className="mb-12">
          <Card className="p-6 md:p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-green-200/50">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-navy">High-Value Opportunities for {companyName}</h2>
            </div>
            
            <div className="space-y-4">
              {highValueOpportunities.slice(0, 4).map((opportunity, idx) => (
                <div key={idx} className="p-4 bg-white/70 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-navy mb-2">{opportunity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{opportunity.description}</p>
                  <p className="text-sm text-green-700 font-medium flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {opportunity.impact}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 5: 90-Day Roadmap */}
        <section className="mb-12">
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-navy">Your Personalized 90-Day Intelligent Growth Roadmap</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {roadmapStages.map((stage, idx) => (
                <Card key={idx} className="p-5 border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <stage.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">{stage.stage}</div>
                      <h3 className="font-semibold text-navy">{stage.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.outcomes.map((outcome, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 6: ROI Projection */}
        <section className="mb-12">
          <Card className="p-6 md:p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border-blue-200/50">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-navy">ROI Projection Based on Benchmarks</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white/70 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">35%</div>
                <div className="text-sm text-muted-foreground">Revenue Lift Potential</div>
              </div>
              <div className="p-4 bg-white/70 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">80%</div>
                <div className="text-sm text-muted-foreground">Conversion Lift Potential</div>
              </div>
              <div className="p-4 bg-white/70 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">15 to 25%</div>
                <div className="text-sm text-muted-foreground">CAC Reduction</div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              With your current maturity profile, organizations typically unlock{" "}
              <strong className="text-foreground">25 to 40% revenue impact</strong> by progressing to the next 
              maturity stage. High-performing brands in your category have achieved up to{" "}
              <strong className="text-foreground">80% conversion lift</strong> through unified customer data 
              and intelligent activation strategies.
            </p>
          </Card>
        </section>

        {/* Section 7: Recommended Capabilities */}
        <section className="mb-12">
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-navy">Recommended Capabilities</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {recommendedCapabilities.map((capability, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{capability}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 8: Recommended Growth Plays - MAIN OUTPUT */}
        {scoredPlays.length > 0 && (
          <section className="mb-12">
            <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-navy">Your Recommended Growth Plays</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Based on your challenges, goals, and maturity profile, these BlueConic Growth Plays are recommended for your organization.
              </p>

              <div className="space-y-4">
                {scoredPlays.slice(0, 5).map((play, index) => (
                  <Card
                    key={play.id}
                    className={`p-5 bg-white border-l-4 hover:shadow-md transition-all ${
                      index === 0 ? "border-l-primary shadow-md" : "border-l-secondary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy text-lg">{play.name}</h3>
                          {play.journey_stage && (
                            <span className="text-xs text-muted-foreground">{play.journey_stage}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          className={`${
                            play.confidence_score >= 70
                              ? "bg-green-100 text-green-800 border-green-200"
                              : play.confidence_score >= 60
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : "bg-orange-100 text-orange-800 border-orange-200"
                          }`}
                        >
                          {play.confidence_score}% confidence
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs border-primary text-primary">
                            Top Recommendation
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-foreground mb-3 leading-relaxed">
                      {play.why_recommended}
                    </p>

                    {play.jtbd && (
                      <div className="bg-muted/30 rounded-lg p-3 mb-3">
                        <p className="text-xs text-muted-foreground">
                          <strong className="text-foreground">Job to be done:</strong> {play.jtbd}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {play.primary_success_metric && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium">Key Metric:</span>
                          <span>{play.primary_success_metric.split(":")[0]}</span>
                        </div>
                      )}
                      {play.time_to_value && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">TTV:</span>
                          <span>{play.time_to_value.split(",")[0]}</span>
                        </div>
                      )}
                    </div>

                    {play.kpis && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex flex-wrap gap-1.5">
                          {play.kpis.split(",").slice(0, 4).map((kpi, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {kpi.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {scoredPlays.length > 5 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  + {scoredPlays.length - 5} more plays available based on your profile
                </p>
              )}
            </Card>
          </section>
        )}

        {/* Section 9: CTA */}
        <section>
          <Card className="p-8 md:p-12 text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              Ready to Accelerate Your Intelligent Growth?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get your detailed PDF report with personalized recommendations and discover how 
              leading brands in your industry are achieving breakthrough results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="https://www.blueconic.com/request-demo?utm_source=growth_readiness_assessment&utm_medium=calculator&utm_campaign=data_maturity&utm_content=download_blueprint_results" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-8">
                  <Download className="h-4 w-4" />
                  Download Your Full Blueprint
                </Button>
              </a>
              <a href="https://www.blueconic.com/request-demo?utm_source=growth_readiness_assessment&utm_medium=calculator&utm_campaign=data_maturity&utm_content=book_strategy_review_results" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  <Calendar className="h-4 w-4" />
                  Book a Growth Strategy Review
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground mt-8">
              See how your maturity profile compares to leaders in your category
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}