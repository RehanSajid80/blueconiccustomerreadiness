import { useState } from "react";
import { HeroSection } from "@/components/assessment/HeroSection";
import { SocialProof } from "@/components/assessment/SocialProof";
import { StatsSection } from "@/components/assessment/StatsSection";
import { AssessmentWizard } from "@/components/assessment/wizard/AssessmentWizard";
import { useNavigate } from "react-router-dom";

export default function AssessmentPage() {
  const [showWizard, setShowWizard] = useState(false);
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    setShowWizard(true);
  };

  const handleComplete = (assessmentId: string) => {
    navigate(`/results/${assessmentId}`);
  };

  if (showWizard) {
    return <AssessmentWizard onComplete={handleComplete} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection onStartAssessment={handleStartAssessment} />
      <SocialProof />
      <StatsSection />
    </div>
  );
}
