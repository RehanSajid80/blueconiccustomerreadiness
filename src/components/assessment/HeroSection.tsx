import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Zap, Target } from "lucide-react";
import blueconicLogo from "@/assets/blueconic-logo.png";

interface HeroSectionProps {
  onStartAssessment: () => void;
}

export function HeroSection({ onStartAssessment }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={blueconicLogo} alt="BlueConic" className="h-12 md:h-16" />
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Discover Hidden Revenue & Personalization Lift with BlueConic
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            An interactive, personalized growth assessment based on first-party data, 
            declared preferences, and identity resolution—used by retail, DTC, CPG, and travel leaders.
          </p>

          {/* 3-Step Overview */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:shadow-lg transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Assess Maturity</h3>
              <p className="text-sm text-muted-foreground">
                Quick 4-dimension maturity evaluation
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-secondary/20 hover:shadow-lg transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/60 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Database className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Data Readiness</h3>
              <p className="text-sm text-muted-foreground">
                Benchmark your data capabilities
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-accent/20 hover:shadow-lg transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Growth Plays</h3>
              <p className="text-sm text-muted-foreground">
                Personalized actionable recommendations
              </p>
            </div>
          </div>

          {/* CTA */}
          <div>
            <Button 
              size="lg" 
              onClick={onStartAssessment}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 h-auto group"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Takes only 2-3 minutes • No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
