import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const steps = [
  "About You",
  "Data Quality",
  "Activation",
  "Intelligence",
  "Impact",
  "Review & Submit"
];

export default function Assessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Customer Growth Readiness Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Assess your readiness across data, activation, AI, and impact in under 5 minutes.
            </p>
          </div>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <Sparkles className="h-8 w-8 text-primary mb-3" />
            <p className="text-sm italic text-muted-foreground">
              "Understanding your customer growth readiness is the first step toward building unified, real-time customer experiences that drive measurable results."
            </p>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mb-1 transition-all ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs text-center hidden md:block">{step}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-4xl mx-auto p-8 shadow-lg">
          {currentStep === 0 && <StepAboutYou />}
          {currentStep === 1 && <StepDataQuality />}
          {currentStep === 2 && <StepActivation />}
          {currentStep === 3 && <StepIntelligence />}
          {currentStep === 4 && <StepImpact />}
          {currentStep === 5 && <StepReview onSubmit={handleSubmit} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your responses generate a personalized readiness report.
        </p>
      </div>
    </div>
  );
}

function StepAboutYou() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">About You</h2>
        <p className="text-muted-foreground">Tell us about yourself and your organization.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input id="company" placeholder="Acme Corporation" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" placeholder="Jane Smith" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <Input id="email" type="email" placeholder="jane@acme.com" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="persona">Your Role/Persona</Label>
          <Select>
            <SelectTrigger id="persona">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketing">Digital Marketing</SelectItem>
              <SelectItem value="ecommerce">Ecommerce</SelectItem>
              <SelectItem value="cx">Customer Experience</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="data">Data/IT</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vertical">Vertical</Label>
          <Select>
            <SelectTrigger id="vertical">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="dtc">DTC</SelectItem>
              <SelectItem value="consumer">Consumer Goods</SelectItem>
              <SelectItem value="travel">Travel & Hospitality</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="size">Company Size</Label>
          <Select>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-100">&lt;100</SelectItem>
              <SelectItem value="100-499">100-499</SelectItem>
              <SelectItem value="500-1999">500-1,999</SelectItem>
              <SelectItem value="2000-9999">2,000-9,999</SelectItem>
              <SelectItem value="10000+">10,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="na">North America</SelectItem>
              <SelectItem value="emea">EMEA</SelectItem>
              <SelectItem value="apac">APAC</SelectItem>
              <SelectItem value="latam">LATAM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function StepDataQuality() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Data Quality</h2>
            <p className="text-muted-foreground">How unified and accessible is your customer data?</p>
          </div>

          <div className="space-y-4">
            <Label>How would you describe your customer data landscape?</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="siloed" id="siloed" />
                <Label htmlFor="siloed" className="cursor-pointer flex-1">
                  Siloed across multiple systems
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="partially" id="partially" />
                <Label htmlFor="partially" className="cursor-pointer flex-1">
                  Partially unified with some integration
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="unified" id="unified" />
                <Label htmlFor="unified" className="cursor-pointer flex-1">
                  Unified in a central customer data platform
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Which data sources do you currently integrate? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {["Web Analytics", "Email Platform", "CRM", "E-commerce", "Mobile App", "Paid Media"].map((source) => (
                <div key={source} className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox id={source} />
                  <Label htmlFor={source} className="cursor-pointer text-sm">
                    {source}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-challenges">What are your biggest data quality challenges?</Label>
            <Textarea
              id="data-challenges"
              placeholder="e.g., Duplicate records, incomplete profiles, data latency..."
              rows={3}
            />
          </div>
        </div>

        <Card className="p-4 bg-secondary/5 border-secondary/20 h-fit">
          <h3 className="font-semibold text-sm mb-2 text-secondary">Agent Insight Preview</h3>
          <p className="text-xs text-muted-foreground">
            Based on your responses, our AI agent will identify specific data unification opportunities and provide recommendations for building a unified customer view.
          </p>
        </Card>
      </div>
    </div>
  );
}

function StepActivation() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Activation</h2>
            <p className="text-muted-foreground">How effectively do you activate customer insights?</p>
          </div>

          <div className="space-y-3">
            <Label>Which channels can you currently activate customer data in?</Label>
            <div className="flex flex-wrap gap-2">
              {["Email", "Web", "Paid Media", "In-Store", "Mobile App", "SMS", "Push Notifications"].map((channel) => (
                <div
                  key={channel}
                  className="px-4 py-2 rounded-full border bg-card hover:bg-primary/10 hover:border-primary/50 cursor-pointer transition-all text-sm"
                >
                  {channel}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>How quickly can you activate a new customer segment?</Label>
            <RadioGroup>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="weeks" id="weeks" />
                <Label htmlFor="weeks" className="cursor-pointer flex-1">
                  Days to weeks (requires IT/development)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="hours" id="hours" />
                <Label htmlFor="hours" className="cursor-pointer flex-1">
                  Hours to days (some manual work)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="realtime" id="realtime" />
                <Label htmlFor="realtime" className="cursor-pointer flex-1">
                  Real-time or near real-time
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activation-goals">What activation capabilities would most impact your business?</Label>
            <Textarea
              id="activation-goals"
              placeholder="e.g., Real-time personalization, cross-channel orchestration, dynamic content..."
              rows={3}
            />
          </div>
        </div>

        <Card className="p-4 bg-secondary/5 border-secondary/20 h-fit">
          <h3 className="font-semibold text-sm mb-2 text-secondary">Agent Insight Preview</h3>
          <p className="text-xs text-muted-foreground">
            We'll analyze your activation maturity and suggest specific use cases where improved activation could drive customer growth.
          </p>
        </Card>
      </div>
    </div>
  );
}

function StepIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Intelligence</h2>
        <p className="text-muted-foreground">How do you leverage AI and experimentation?</p>
      </div>

      <div className="space-y-4">
        <Label>How are you currently using AI for customer experiences?</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="not-using" id="not-using" />
            <Label htmlFor="not-using" className="cursor-pointer flex-1">
              Not currently using AI
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="exploring" id="exploring" />
            <Label htmlFor="exploring" className="cursor-pointer flex-1">
              Exploring AI use cases
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="using" id="using" />
            <Label htmlFor="using" className="cursor-pointer flex-1">
              Using AI for specific use cases (recommendations, predictions, etc.)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="cursor-pointer flex-1">
              Advanced AI integration across customer journey
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>How mature is your experimentation practice?</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="cursor-pointer flex-1">
              Limited or no A/B testing
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="basic" id="basic" />
            <Label htmlFor="basic" className="cursor-pointer flex-1">
              Basic A/B testing on key channels
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="mature" id="mature" />
            <Label htmlFor="mature" className="cursor-pointer flex-1">
              Mature experimentation program with continuous testing
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-goals">What AI or intelligence capabilities are you most interested in?</Label>
        <Textarea
          id="ai-goals"
          placeholder="e.g., Predictive analytics, next-best-action recommendations, churn prevention..."
          rows={3}
        />
      </div>
    </div>
  );
}

function StepImpact() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Impact</h2>
        <p className="text-muted-foreground">How do you measure and communicate customer growth impact?</p>
      </div>

      <div className="space-y-4">
        <Label>How do you currently attribute customer growth outcomes?</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="limited" id="limited" />
            <Label htmlFor="limited" className="cursor-pointer flex-1">
              Limited attribution (last-touch or no attribution)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="multi" id="multi" />
            <Label htmlFor="multi" className="cursor-pointer flex-1">
              Multi-touch attribution models
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="cursor-pointer flex-1">
              Advanced attribution with incrementality testing
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Which KPIs do you actively track? (Select all that apply)</Label>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Customer Lifetime Value",
            "Conversion Rate",
            "Customer Acquisition Cost",
            "Retention Rate",
            "Revenue per Customer",
            "Engagement Metrics"
          ].map((kpi) => (
            <div key={kpi} className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox id={kpi} />
              <Label htmlFor={kpi} className="cursor-pointer text-sm">
                {kpi}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="impact-challenges">What are your biggest challenges in demonstrating customer growth impact?</Label>
        <Textarea
          id="impact-challenges"
          placeholder="e.g., Connecting activities to outcomes, executive reporting, proving ROI..."
          rows={3}
        />
      </div>
    </div>
  );
}

function StepReview({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">Review your responses before generating your readiness report.</p>
      </div>

      <div className="space-y-4">
        {steps.slice(0, -1).map((step, index) => (
          <Card key={step} className="p-4 border-l-4 border-l-primary/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{step}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {index === 0 && "Company info and contact details completed"}
                  {index === 1 && "Data quality assessment completed"}
                  {index === 2 && "Activation capabilities documented"}
                  {index === 3 && "Intelligence maturity assessed"}
                  {index === 4 && "Impact measurement practices captured"}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/30">
        <div className="flex items-start space-x-3">
          <Checkbox id="consent" className="mt-1" />
          <Label htmlFor="consent" className="text-sm cursor-pointer">
            I consent to BlueConic using my responses to generate a personalized readiness report and to contact me about customer growth solutions.
          </Label>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onSubmit} size="lg" className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90">
          Generate My Readiness Report
        </Button>
        <Button variant="ghost" size="lg">
          Start Over
        </Button>
      </div>
    </div>
  );
}
