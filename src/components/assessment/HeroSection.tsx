import { Button } from "@/components/ui/button";
import { ArrowRight, Target, BarChart3, FileText } from "lucide-react";
import blueconicLogo from "@/assets/blueconic-logo.png";

interface HeroSectionProps {
  onStartAssessment: () => void;
}

export function HeroSection({ onStartAssessment }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(210_100%_97%)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_hsl(195_100%_97%)_0%,_transparent_50%)]" />
      
      {/* Floating circles - BlueConic style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-secondary/15 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img src={blueconicLogo} alt="BlueConic" className="h-10 md:h-12 opacity-90" />
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-navy leading-tight mb-6">
            Intelligent Growth{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Maturity Calculator
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-navy-light/80 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            A five-minute reality check for your data, AI, and everything else powering your customer growth strategy. Get a quick, no-nonsense look at how your data, activation, decisioning, and governance work today, and where your biggest growth opportunities actually are.
          </p>

          {/* 3-Step Overview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(74,159,245,0.08)] border border-primary/10 hover:shadow-[0_8px_24px_rgba(74,159,245,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(74,159,245,0.25)]">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-navy">Assess Your Readiness</h3>
              <p className="text-sm text-navy-light/70 leading-relaxed">
                A fast, four-dimensional pulse check on how intelligently your data, activation, decisioning, and governance are working today.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(74,159,245,0.08)] border border-primary/10 hover:shadow-[0_8px_24px_rgba(74,159,245,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(0,191,243,0.25)]">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-navy">Benchmark Your Potential</h3>
              <p className="text-sm text-navy-light/70 leading-relaxed">
                See how your growth engine stacks up against what high-performing brands are doing right now.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(74,159,245,0.08)] border border-primary/10 hover:shadow-[0_8px_24px_rgba(74,159,245,0.12)] transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary via-secondary to-primary rounded-full flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(74,159,245,0.25)]">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-navy">Get Your Growth Playbook</h3>
              <p className="text-sm text-navy-light/70 leading-relaxed">
                Walk away with personalized, high-impact plays designed to boost your customer engagement and revenue momentum immediately.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={onStartAssessment}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_8px_24px_rgba(74,159,245,0.3)] text-white text-base md:text-lg px-10 py-6 h-auto rounded-full font-semibold group transition-all duration-300 hover:scale-105"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-navy-light/50 mt-6 italic">
              Think of it as a vibe check for your martech maturity (but, you know… actually useful).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
