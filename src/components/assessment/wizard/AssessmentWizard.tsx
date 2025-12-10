import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Industry, Persona, AssessmentData } from "@/types/assessment";
import { Step1Industry } from "./Step1Industry";
import { Step2Maturity, maturitySections } from "./Step2Maturity";
import { Step3Business } from "./Step3Business";
import { useNavigate } from "react-router-dom";
import blueconicLogo from "@/assets/blueconic-logo.png";

interface AssessmentWizardProps {
  onComplete: (assessmentId: string) => void;
}

interface MaturityScores {
  data_readiness: number[];
  activation: number[];
  decisioning: number[];
  governance: number[];
}

export function AssessmentWizard({ onComplete }: AssessmentWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
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

  const [maturityScores, setMaturityScores] = useState<MaturityScores>({
    data_readiness: [0, 0, 0],
    activation: [0, 0, 0],
    decisioning: [0, 0, 0],
    governance: [0, 0, 0],
  });

  useEffect(() => {
    async function loadData() {
      const [industriesRes, personasRes] = await Promise.all([
        supabase.from("industries").select("*").order("name"),
        supabase.from("personas").select("*").order("name"),
      ]);

      if (industriesRes.data) setIndustries(industriesRes.data);
      if (personasRes.data) setPersonas(personasRes.data);
    }
    loadData();
  }, []);

  const handleBusinessDataChange = (field: string, value: number | null) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateDimensionScore = (answers: number[]): number => {
    const validAnswers = answers.filter((a) => a > 0);
    if (validAnswers.length === 0) return 3;
    return Math.round(validAnswers.reduce((sum, a) => sum + a, 0) / validAnswers.length);
  };

  const allMaturityQuestionsAnswered = () => {
    return Object.values(maturityScores).every((arr) => arr.every((v) => v > 0));
  };

  const canProceed = () => {
    if (step === 1) {
      return assessmentData.industry_id && assessmentData.persona_id;
    }
    if (step === 2) {
      return allMaturityQuestionsAnswered();
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

  const calculateReadinessScore = (): number => {
    const dataScore = calculateDimensionScore(maturityScores.data_readiness);
    const activationScore = calculateDimensionScore(maturityScores.activation);
    const decisioningScore = calculateDimensionScore(maturityScores.decisioning);
    const governanceScore = calculateDimensionScore(maturityScores.governance);

    const avgScore = (dataScore + activationScore + decisioningScore + governanceScore) / 4;
    return Math.round((avgScore / 5) * 100);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const dataScore = calculateDimensionScore(maturityScores.data_readiness);
    const activationScore = calculateDimensionScore(maturityScores.activation);
    const decisioningScore = calculateDimensionScore(maturityScores.decisioning);
    const governanceScore = calculateDimensionScore(maturityScores.governance);
    const readinessScore = calculateReadinessScore();

    const finalData = {
      industry_id: assessmentData.industry_id,
      persona_id: assessmentData.persona_id,
      monthly_web_traffic: assessmentData.monthly_web_traffic,
      known_profile_count: assessmentData.known_profile_count,
      consent_rate: assessmentData.consent_rate,
      aov: assessmentData.aov,
      conversion_rate: assessmentData.conversion_rate,
      data_readiness_score: dataScore,
      activation_score: activationScore,
      decisioning_score: decisioningScore,
      governance_score: governanceScore,
      growth_readiness_score: readinessScore,
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
      utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
      utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
    };

    const { data, error } = await supabase
      .from("assessments")
      .insert(finalData)
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

  const stepLabels = ["Industry & Role", "Maturity Assessment", "Business Metrics"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={blueconicLogo} alt="BlueConic" className="h-8" />
            <div className="text-sm text-muted-foreground">
              Step {step} of 3: {stepLabels[step - 1]}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      idx + 1 <= step
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-xs mt-2 text-center hidden md:block max-w-[100px]">
                    {label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 rounded-full transition-all ${
                      idx + 1 < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-xl border-0 bg-white">
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
              scores={maturityScores}
              onScoresChange={setMaturityScores}
            />
          )}

          {step === 3 && (
            <Step3Business
              data={assessmentData}
              onChange={handleBusinessDataChange}
            />
          )}

          {/* Navigation - Only show on steps 1 and 3 */}
          {step !== 2 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
                disabled={loading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {step === 1 ? "Cancel" : "Back"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
              >
                {loading ? "Saving..." : step === 3 ? "See My Results" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2 has its own navigation, but we need global nav too */}
          {step === 2 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Industry
              </Button>

              <Button
                onClick={() => setStep(3)}
                disabled={!allMaturityQuestionsAnswered()}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
              >
                Continue to Business Metrics
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6 max-w-lg mx-auto">
          Your responses generate a personalized readiness report with actionable growth plays.
        </p>
      </div>
    </div>
  );
}
