import { useState } from "react";
import { cn } from "@/lib/utils";
import { Industry, Persona } from "@/types/assessment";
import { Check, Building2, User, Building, Mail, Globe, Loader2, CheckCircle2, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export interface SalesforceLookupData {
  found: boolean;
  source: "contact" | "lead" | null;
  data: {
    id?: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    industry?: string;
    account_id?: string;
    owner_name?: string;
    title?: string;
    existing_customer?: boolean;
  } | null;
}

interface Step1IndustryProps {
  industries: Industry[];
  personas: Persona[];
  selectedIndustry: string | null;
  selectedPersona: string | null;
  firstName: string;
  lastName: string;
  companyName: string;
  companyUrl: string;
  email: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onPersonaChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onCompanyUrlChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSalesforceLookup?: (data: SalesforceLookupData) => void;
}

const industryIcons: Record<string, string> = {
  retail: "🏬",
  dtc: "🛒",
  cpg: "🏭",
  travel_hospitality: "✈️",
  media_subscription: "📺",
};

const personaIcons: Record<string, string> = {
  digital_marketing: "📊",
  ecommerce: "👔",
  cx_loyalty: "💝",
  growth: "📈",
  data_it: "💻",
};

export function Step1Industry({
  industries,
  personas,
  selectedIndustry,
  selectedPersona,
  firstName,
  lastName,
  companyName,
  companyUrl,
  email,
  onFirstNameChange,
  onLastNameChange,
  onIndustryChange,
  onPersonaChange,
  onCompanyNameChange,
  onCompanyUrlChange,
  onEmailChange,
  onSalesforceLookup,
}: Step1IndustryProps) {
  const [sfLoading, setSfLoading] = useState(false);
  const [sfResult, setSfResult] = useState<SalesforceLookupData | null>(null);

  const handleEmailBlur = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !onSalesforceLookup) return;

    setSfLoading(true);
    setSfResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("salesforce-lookup", {
        body: { email: trimmed },
      });

      if (!error && data) {
        setSfResult(data);
        onSalesforceLookup(data);

        // Auto-fill fields if found and not already filled
        if (data.found && data.data) {
          if (data.data.company_name && !companyName) {
            onCompanyNameChange(data.data.company_name);
          }
          if (data.data.first_name && !firstName) {
            onFirstNameChange(data.data.first_name);
          }
          if (data.data.last_name && !lastName) {
            onLastNameChange(data.data.last_name);
          }
        }
      }
    } catch (err) {
      console.error("Salesforce lookup failed:", err);
    } finally {
      setSfLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-2">Let's Get Started</h2>
        <p className="text-muted-foreground">
          Tell us about your company to personalize your assessment
        </p>
      </div>

      {/* Name Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy">What's your name?</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="h-12 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="h-12 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
          />
        </div>
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

      {/* Company Website URL Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy">What's your company website?</h3>
        </div>
        <Input
          type="url"
          placeholder="https://www.yourcompany.com"
          value={companyUrl}
          onChange={(e) => onCompanyUrlChange(e.target.value)}
          className="h-12 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
        />
        <p className="text-xs text-muted-foreground">
          We'll analyze your website to provide more tailored recommendations
        </p>
      </div>

      {/* Email Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy">What's your email address?</h3>
        </div>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={handleEmailBlur}
          className="h-12 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
        />
        {sfLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Looking up your account...
          </div>
        )}
        {sfResult?.found && sfResult.data && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            {sfResult.data.existing_customer
              ? `Welcome back! We found your account at ${sfResult.data.company_name}.`
              : `Found you at ${sfResult.data.company_name}. We've pre-filled your details.`}
          </div>
        )}
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-navy">What industry are you in?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {industries.filter((industry) => industry.type !== "media_subscription").map((industry) => (
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
