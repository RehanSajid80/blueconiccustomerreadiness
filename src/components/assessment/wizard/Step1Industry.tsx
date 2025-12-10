import { cn } from "@/lib/utils";
import { Industry, Persona } from "@/types/assessment";
import { Check, Building2, User, Building } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Step1IndustryProps {
  industries: Industry[];
  personas: Persona[];
  selectedIndustry: string | null;
  selectedPersona: string | null;
  companyName: string;
  onIndustryChange: (value: string) => void;
  onPersonaChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
}

const industryIcons: Record<string, string> = {
  retail: "🏬",
  dtc: "📦",
  cpg: "🛒",
  travel_hospitality: "✈️",
  media_subscription: "📺",
};

const personaIcons: Record<string, string> = {
  digital_marketing: "📊",
  ecommerce: "🛍️",
  cx_loyalty: "💝",
  growth: "📈",
  data_it: "💻",
};

export function Step1Industry({
  industries,
  personas,
  selectedIndustry,
  selectedPersona,
  companyName,
  onIndustryChange,
  onPersonaChange,
  onCompanyNameChange,
}: Step1IndustryProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">Let's Get Started</h2>
        <p className="text-muted-foreground">
          Tell us about your company to personalize your assessment
        </p>
      </div>

      {/* Company Name Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy">What's your company name?</h3>
        </div>
        <Input
          placeholder="Enter your company name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          className="h-12 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
        />
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy">What industry are you in?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => onIndustryChange(industry.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                selectedIndustry === industry.id
                  ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]"
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/[0.02]"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                  selectedIndustry === industry.id
                    ? "bg-primary/10"
                    : "bg-muted group-hover:bg-primary/5"
                )}
              >
                {industryIcons[industry.type] || "🏢"}
              </div>
              <div className="flex-1">
                <span className="font-medium text-foreground">{industry.name}</span>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedIndustry === industry.id
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
              >
                {selectedIndustry === industry.id && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Persona Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold text-navy">What best describes your role?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onPersonaChange(persona.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                selectedPersona === persona.id
                  ? "border-secondary bg-secondary/5 shadow-[0_0_0_1px_hsl(var(--secondary))]"
                  : "border-border/50 hover:border-secondary/50 hover:bg-secondary/[0.02]"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                  selectedPersona === persona.id
                    ? "bg-secondary/10"
                    : "bg-muted group-hover:bg-secondary/5"
                )}
              >
                {personaIcons[persona.type] || "👤"}
              </div>
              <div className="flex-1">
                <span className="font-medium text-foreground">{persona.name}</span>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedPersona === persona.id
                    ? "border-secondary bg-secondary text-white"
                    : "border-muted-foreground/30 group-hover:border-secondary/50"
                )}
              >
                {selectedPersona === persona.id && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
