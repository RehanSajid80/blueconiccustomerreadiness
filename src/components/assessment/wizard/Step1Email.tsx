import { useState } from "react";
import { Mail, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { SalesforceLookupData } from "./Step1Industry";

interface Step1EmailProps {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  onEmailChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onSalesforceLookup?: (data: SalesforceLookupData) => void;
}

export function Step1Email({
  email,
  firstName,
  lastName,
  companyName,
  onEmailChange,
  onFirstNameChange,
  onLastNameChange,
  onCompanyNameChange,
  onSalesforceLookup,
}: Step1EmailProps) {
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
    <div className="space-y-8 py-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Free 5-minute assessment
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy">
          Get Your Personalized Growth Readiness Score
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          See exactly where your data, activation, decisioning, and governance stack up — and the top growth plays to unlock your next stage.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <label className="text-sm font-medium text-navy">
              Where should we send your results?
            </label>
          </div>
          <Input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            autoFocus
            className="h-14 text-lg border-2 border-border/50 focus:border-primary rounded-xl"
          />
          {sfLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Looking up your account...
            </div>
          )}
          {sfResult?.found && sfResult.data && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                {sfResult.data.existing_customer
                  ? `Welcome back! We found your account at ${sfResult.data.company_name}.`
                  : `Found you at ${sfResult.data.company_name}.`}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          No credit card. No sales call required. Just insights.
        </p>
      </div>
    </div>
  );
}
