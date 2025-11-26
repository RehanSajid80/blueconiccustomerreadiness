import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentResult, GrowthPlay, Benchmark, ScoredGrowthPlay } from "@/types/assessment";
import { scoreGrowthPlays } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Activity,
} from "lucide-react";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [scoredPlays, setScoredPlays] = useState<ScoredGrowthPlay[]>([]);
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    async function loadResults() {
      setLoading(true);

      // Load assessment
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .single();

      if (assessmentError || !assessmentData) {
        navigate("/");
        return;
      }

      setAssessment(assessmentData);

      // Load growth plays with industries and personas
      const { data: playsData } = await supabase
        .from("growth_plays")
        .select(`
          *,
          industries:growth_play_industries(industry:industries(*)),
          personas:growth_play_personas(persona:personas(*))
        `)
        .eq("is_active", true);

      if (playsData) {
        // Transform the nested data structure
        const transformedPlays: GrowthPlay[] = playsData.map((play: any) => ({
          ...play,
          industries: play.industries?.map((i: any) => i.industry) || [],
          personas: play.personas?.map((p: any) => p.persona) || [],
        }));

        const scored = scoreGrowthPlays(
          transformedPlays,
          assessmentData,
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
          .single();

        if (benchmarkData) {
          setBenchmark(benchmarkData);
        }
      }

      setLoading(false);
    }

    loadResults();
  }, [id, navigate]);

  if (loading || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  const readinessScore = assessment.growth_readiness_score || 0;
  const maturityScores = [
    { name: "Data Readiness", score: assessment.data_readiness_score || 0, icon: Database },
    { name: "Activation", score: assessment.activation_score || 0, icon: Zap },
    { name: "Decisioning", score: assessment.decisioning_score || 0, icon: Brain },
    { name: "Experimentation", score: assessment.experimentation_score || 0, icon: Activity },
    { name: "Governance", score: assessment.governance_score || 0, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section with Score */}
        <Card className="p-8 md:p-12 mb-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Your Growth Readiness Results
              </Badge>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {readinessScore}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-1 border-secondary bg-secondary/10">
                {readinessScore >= 70
                  ? "Data Connected"
                  : readinessScore >= 40
                  ? "Getting Started"
                  : "Early Stage"}
              </Badge>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Readiness Snapshot</h2>
              <p className="text-muted-foreground">
                Based on your maturity assessment, we've identified your strengths and 
                high-impact opportunities to accelerate customer growth with first-party data.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pillar Scores */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Maturity by Dimension</h2>
              <div className="space-y-6">
                {maturityScores.map((pillar) => {
                  const scorePercent = ((pillar.score - 1) / 4) * 100;
                  return (
                    <div key={pillar.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <pillar.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{pillar.name}</span>
                        </div>
                        <span className="text-2xl font-bold">{pillar.score}/5</span>
                      </div>
                      <Progress value={scorePercent} className="h-3" />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Benchmark Comparison */}
            {benchmark && (
              <Card className="p-6 border-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold text-lg">Industry Benchmarks</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {benchmark.consent_rate_avg && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Avg Consent Rate</div>
                      <div className="text-2xl font-bold">{benchmark.consent_rate_avg}%</div>
                    </div>
                  )}
                  {benchmark.declared_data_capture_avg && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Data Capture</div>
                      <div className="text-2xl font-bold">{benchmark.declared_data_capture_avg}%</div>
                    </div>
                  )}
                  {benchmark.conversion_lift_min && benchmark.conversion_lift_max && (
                    <div className="p-4 bg-muted/50 rounded-lg md:col-span-2">
                      <div className="text-sm text-muted-foreground mb-1">Conversion Lift Range</div>
                      <div className="text-2xl font-bold">
                        {benchmark.conversion_lift_min}% - {benchmark.conversion_lift_max}%
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Growth Plays */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Personalized Growth Plays</h3>
              </div>
              <div className="space-y-4">
                {scoredPlays.slice(0, 5).map((play) => (
                  <Card
                    key={play.id}
                    className="p-4 border-primary/20 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm flex-1">{play.name}</h4>
                      <Badge variant="outline" className="ml-2">
                        {play.confidence_score}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {play.why_recommended}
                    </p>
                    {play.messaging_block && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {play.messaging_block.slice(0, 100)}...
                      </p>
                    )}
                    {play.estimated_impact_min && play.estimated_impact_max && (
                      <Badge variant="secondary" className="text-xs">
                        +{play.estimated_impact_min}-{play.estimated_impact_max}% impact
                      </Badge>
                    )}
                  </Card>
                ))}
                {scoredPlays.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Complete your maturity assessment to see personalized recommendations
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="p-8 mt-12 text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Ready to Accelerate Your Customer Growth?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get your detailed PDF report with personalized recommendations and book a growth strategy session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Mail className="h-4 w-4 mr-2" />
              Email Me My Report
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Book a Growth Review
            </Button>
          </div>
          <div className="flex gap-4 justify-center mt-6 text-sm">
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share with Team
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
