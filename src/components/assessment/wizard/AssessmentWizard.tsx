import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Industry, Persona, MaturityDimension, AssessmentData } from "@/types/assessment";
import { Step1Industry } from "./Step1Industry";
import { Step2Maturity } from "./Step2Maturity";
import { Step3Business } from "./Step3Business";
import { useNavigate } from "react-router-dom";
import { calculateReadinessScore } from "@/lib/scoring";

interface AssessmentWizardProps {
  onComplete: (assessmentId: string) => void;
}

export function AssessmentWizard({ onComplete }: AssessmentWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [dimensions, setDimensions] = useState<MaturityDimension[]>([]);
  const [loading, setLoading] = useState(false);

  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    industry_id: null,
    persona_id: null,
    monthly_web_traffic: null,
    known_profile_count: null,
    consent_rate: null,
    aov: null,
    conversion_rate: null,
    data_readiness_score: null,
    activation_score: null,
    decisioning_score: null,
    experimentation_score: null,
    governance_score: null,
  });

  const [maturityScores, setMaturityScores] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      const [industriesRes, personasRes, dimensionsRes] = await Promise.all([
        supabase.from("industries").select("*").order("name"),
        supabase.from("personas").select("*").order("name"),
        supabase.from("maturity_dimensions").select("*").order("name"),
      ]);

      if (industriesRes.data) setIndustries(industriesRes.data);
      if (personasRes.data) setPersonas(personasRes.data);
      if (dimensionsRes.data) {
        setDimensions(dimensionsRes.data);
        // Initialize scores to 3 (middle value)
        const initialScores: Record<string, number> = {};
        dimensionsRes.data.forEach((dim) => {
          initialScores[dim.name] = 3;
        });
        setMaturityScores(initialScores);
      }
    }
    loadData();
  }, []);

  const handleMaturityScoreChange = (dimensionName: string, value: number) => {
    setMaturityScores((prev) => ({ ...prev, [dimensionName]: value }));
  };

  const handleBusinessDataChange = (field: string, value: number | null) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (step === 1) {
      return assessmentData.industry_id && assessmentData.persona_id;
    }
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Map maturity scores to assessment data
    const finalData: AssessmentData = {
      ...assessmentData,
      data_readiness_score: maturityScores["Data Readiness"] || null,
      activation_score: maturityScores["Activation"] || null,
      decisioning_score: maturityScores["Decisioning"] || null,
      experimentation_score: maturityScores["Experimentation"] || null,
      governance_score: maturityScores["Governance"] || null,
    };

    // Calculate readiness score
    const readinessScore = calculateReadinessScore(finalData);

    // Get UTM parameters
    const params = new URLSearchParams(window.location.search);
    finalData.utm_source = params.get("utm_source") || undefined;
    finalData.utm_medium = params.get("utm_medium") || undefined;
    finalData.utm_campaign = params.get("utm_campaign") || undefined;

    // Save to database
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        ...finalData,
        growth_readiness_score: readinessScore,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("Error saving assessment:", error);
      return;
    }

    if (data) {
      onComplete(data.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto p-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of 3</span>
              <span className="text-sm text-muted-foreground">
                {step === 1 && "Industry & Role"}
                {step === 2 && "Maturity Assessment"}
                {step === 3 && "Business Metrics"}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            {step === 1 && (
              <Step1Industry
                industries={industries}
                personas={personas}
                selectedIndustry={assessmentData.industry_id}
                selectedPersona={assessmentData.persona_id}
                onIndustryChange={(value) =>
                  setAssessmentData((prev) => ({ ...prev, industry_id: value }))
                }
                onPersonaChange={(value) =>
                  setAssessmentData((prev) => ({ ...prev, persona_id: value }))
                }
              />
            )}

            {step === 2 && (
              <Step2Maturity
                dimensions={dimensions}
                scores={maturityScores}
                onScoreChange={handleMaturityScoreChange}
              />
            )}

            {step === 3 && (
              <Step3Business
                data={assessmentData}
                onChange={handleBusinessDataChange}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="bg-gradient-to-r from-primary to-accent"
            >
              {loading ? "Saving..." : step === 3 ? "See My Results" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
