import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Industry, Persona, AssessmentData, ChallengeType, GoalType } from "@/types/assessment";
import { SalesforceLookupData } from "./Step1Industry";
import { Step1Email } from "./Step1Email";
import { Step2Maturity, maturitySections } from "./Step2Maturity";
import { Step3Challenges } from "./Step3Challenges";
import { Step4Profile } from "./Step4Profile";
import { useNavigate } from "react-router-dom";
import { getEligiblePlays } from "@/data/growthPlays";


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
  const [demoMode, setDemoMode] = useState(false);
  const [salesforceData, setSalesforceData] = useState<SalesforceLookupData | null>(null);

  // Demo mode toggle: Ctrl+Alt+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "d") {
        e.preventDefault();
        setDemoMode((prev) => {
          const next = !prev;
          console.log(`Demo mode ${next ? "enabled" : "disabled"}`);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    industry_id: null,
    persona_id: null,
    first_name: "",
    last_name: "",
    company_name: "",
    company_url: "",
    email: "",
    challenges: [],
    goals: [],
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

  const handleChallengesChange = (challenges: ChallengeType[]) => {
    setAssessmentData((prev) => ({ ...prev, challenges }));
  };

  const handleGoalsChange = (goals: GoalType[]) => {
    setAssessmentData((prev) => ({ ...prev, goals }));
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
    if (demoMode) return true;
    if (step === 1) {
      // Email-only entry — minimal friction
      const email = assessmentData.email?.trim() || "";
      return email.length > 0 && email.includes("@");
    }
    if (step === 2) {
      return allMaturityQuestionsAnswered();
    }
    if (step === 3) {
      // Require at least 1 challenge and 1 goal
      return (assessmentData.challenges?.length || 0) >= 1 && (assessmentData.goals?.length || 0) >= 1;
    }
    if (step === 4) {
      // Profile gate before results — required for Salesforce
      return (
        !!assessmentData.industry_id &&
        !!assessmentData.persona_id &&
        !!assessmentData.first_name?.trim() &&
        !!assessmentData.last_name?.trim() &&
        !!assessmentData.company_name?.trim()
      );
    }
    return true;
  };

  const handleNext = () => {
    if (step < 4) {
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
      company_name: assessmentData.company_name,
      company_url: assessmentData.company_url || null,
      email: assessmentData.email,
      challenges: assessmentData.challenges || [],
      goals: assessmentData.goals || [],
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
      setLoading(false);
      return;
    }

    if (data) {
      // Salesforce write-back (fire and forget — don't block the user)
      const resultsUrl = `${window.location.origin}/results/${data.id}`;
      const industryName = industries.find((i) => i.id === assessmentData.industry_id)?.name;
      const personaType = personas.find((p) => p.id === assessmentData.persona_id)?.type;

      // Calculate top growth play recommendations
      const eligiblePlays = getEligiblePlays({
        dataReadiness: dataScore,
        activation: activationScore,
        decisioning: decisioningScore,
        governance: governanceScore,
      });
      const topPlayNames = eligiblePlays.slice(0, 5).map((p) => p.name);

      const urlParams = new URLSearchParams(window.location.search);

      // n8n webhook for Salesforce sync (fire and forget)
      fetch("https://blueconic.app.n8n.cloud/webhook/growth-readiness-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_id: data.id,
          results_url: resultsUrl,
          email: assessmentData.email,
          company_name: assessmentData.company_name,
          first_name: assessmentData.first_name || salesforceData?.data?.first_name || undefined,
          last_name: assessmentData.last_name || salesforceData?.data?.last_name || undefined,
          data_readiness_score: dataScore,
          activation_score: activationScore,
          decisioning_score: decisioningScore,
          governance_score: governanceScore,
          growth_readiness_score: readinessScore,
          industry_name: industryName,
          persona_type: personaType,
          challenges: assessmentData.challenges,
          goals: assessmentData.goals,
          growth_play_recs: topPlayNames,
          utm_source: urlParams.get("utm_source"),
          utm_medium: urlParams.get("utm_medium"),
          utm_campaign: urlParams.get("utm_campaign"),
          utm_content: urlParams.get("utm_content"),
          salesforce_id: salesforceData?.data?.id || undefined,
          salesforce_type: salesforceData?.source || undefined,
        }),
      }).catch((err) => console.warn("n8n Salesforce sync failed:", err));

      onComplete(data.id);
    }
  };

  const stepLabels = ["Email", "Maturity Assessment", "Challenges & Goals", "About You"];
  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Step indicator badge */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            Step {step} of {totalSteps}: {stepLabels[step - 1]}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
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
                  <span className="text-xs mt-2 text-center hidden md:block max-w-[80px]">
                    {label}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div
                    className={`w-12 md:w-16 h-1 mx-2 rounded-full transition-all ${
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
            <Step1Email
              email={assessmentData.email || ""}
              firstName={assessmentData.first_name || ""}
              lastName={assessmentData.last_name || ""}
              companyName={assessmentData.company_name || ""}
              onEmailChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, email: value }))
              }
              onFirstNameChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, first_name: value }))
              }
              onLastNameChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, last_name: value }))
              }
              onCompanyNameChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, company_name: value }))
              }
              onSalesforceLookup={(data) => setSalesforceData(data)}
            />
          )}

          {step === 2 && (
            <Step2Maturity
              scores={maturityScores}
              onScoresChange={setMaturityScores}
            />
          )}

          {step === 3 && (
            <Step3Challenges
              selectedChallenges={assessmentData.challenges || []}
              selectedGoals={assessmentData.goals || []}
              onChallengesChange={handleChallengesChange}
              onGoalsChange={handleGoalsChange}
            />
          )}

          {step === 4 && (
            <Step4Profile
              industries={industries}
              personas={personas}
              selectedIndustry={assessmentData.industry_id}
              selectedPersona={assessmentData.persona_id}
              firstName={assessmentData.first_name || ""}
              lastName={assessmentData.last_name || ""}
              companyName={assessmentData.company_name || ""}
              onIndustryChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, industry_id: value }))
              }
              onPersonaChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, persona_id: value }))
              }
              onFirstNameChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, first_name: value }))
              }
              onLastNameChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, last_name: value }))
              }
              onCompanyNameChange={(value) =>
                setAssessmentData((prev) => ({ ...prev, company_name: value }))
              }
            />
          )}

          {/* Navigation - Show on all steps except step 2 (which has its own nav) */}
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
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : step === totalSteps ? (
                  "See My Results"
                ) : step === 1 ? (
                  "Start Assessment"
                ) : (
                  "Continue"
                )}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          )}

          {/* Step 2 has its own navigation */}
          {step === 2 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                onClick={() => setStep(3)}
                disabled={!demoMode && !allMaturityQuestionsAnswered()}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
              >
                Continue to Challenges
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6 max-w-lg mx-auto">
          Your responses generate a personalized readiness report with actionable growth plays tailored to your specific challenges.
        </p>

        {/* Demo mode indicator */}
        {demoMode && (
          <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            Demo Mode ON (Ctrl+Alt+D to toggle)
          </div>
        )}
      </div>
    </div>
  );
}
