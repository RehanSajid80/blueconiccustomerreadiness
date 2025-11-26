import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Share2, TrendingUp, Target, Lightbulb, Database, Zap, Brain, BarChart3 } from "lucide-react";

export default function Results() {
  const pillars = [
    { name: "Data Quality", score: 68, icon: Database, color: "text-primary" },
    { name: "Activation", score: 72, icon: Zap, color: "text-secondary" },
    { name: "Intelligence", score: 55, icon: Brain, color: "text-accent" },
    { name: "Impact", score: 78, icon: BarChart3, color: "text-primary" },
  ];

  const recommendations = [
    {
      title: "Unify Your Customer Data",
      pillar: "Data Quality",
      description: "Consolidate siloed data sources into a unified customer data platform to create complete, real-time customer profiles.",
      capabilities: ["Profile Unification", "Real-time Data Sync", "Identity Resolution"]
    },
    {
      title: "Enable Real-Time Personalization",
      pillar: "Activation",
      description: "Activate unified profiles to deliver personalized experiences across web, email, and paid media in real-time.",
      capabilities: ["Dynamic Content", "Cross-Channel Orchestration", "Audience Sync"]
    },
    {
      title: "Implement AI-Powered Predictions",
      pillar: "Intelligence",
      description: "Leverage machine learning to predict customer behavior and automate next-best-action recommendations.",
      capabilities: ["Predictive Modeling", "Recommendation Engine", "Churn Prevention"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <Card className="p-8 md:p-12 mb-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Your Readiness Results
              </Badge>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  72
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-1 border-secondary bg-secondary/10">
                Data Connected
              </Badge>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Readiness Snapshot</h2>
              <p className="text-muted-foreground">
                You're making strong progress in activating customer data across channels and measuring impact. Your biggest opportunity lies in unifying data sources and leveraging AI to unlock predictive insights. With focused improvements in data quality and intelligence, you can accelerate customer growth significantly.
              </p>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pillar Scores */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Readiness by Pillar</h2>
              <div className="space-y-6">
                {pillars.map((pillar) => (
                  <div key={pillar.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <pillar.icon className={`h-5 w-5 ${pillar.color}`} />
                        <span className="font-medium">{pillar.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{pillar.score}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths & Focus Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold">Where You're Ahead</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>Strong impact measurement and KPI tracking across key metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>Multi-channel activation capabilities with good reach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <span>Clear organizational alignment on customer growth priorities</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-accent/30">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold">Where to Focus</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <span>Unify fragmented data sources to build complete customer profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <span>Implement AI and predictive capabilities for proactive engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <span>Reduce time-to-activation for new customer segments</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Priority Recommendations</h3>
              </div>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="p-4 border-primary/20 hover:shadow-md transition-shadow">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {rec.pillar}
                    </Badge>
                    <h4 className="font-semibold text-sm mb-2">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rec.capabilities.map((cap) => (
                        <Badge key={cap} variant="secondary" className="text-xs px-2 py-0">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTAs */}
        <Card className="p-8 mt-12 text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">Ready to Accelerate Your Customer Growth?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Work with a BlueConic expert to create a customized roadmap based on your readiness assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Book a Customer Growth Working Session
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              Email Me This Report
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
