import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart3, Users, ShieldCheck, DollarSign, TrendingUp } from "lucide-react";

interface Step3BusinessProps {
  data: {
    monthly_web_traffic: number | null;
    known_profile_count: number | null;
    consent_rate: number | null;
    aov: number | null;
    conversion_rate: number | null;
  };
  onChange: (field: string, value: number | null) => void;
}

export function Step3Business({ data, onChange }: Step3BusinessProps) {
  const handleChange = (field: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    onChange(field, numValue);
  };

  const fields = [
    {
      id: "monthly_web_traffic",
      label: "Monthly Web Traffic",
      placeholder: "e.g., 100,000",
      icon: BarChart3,
      type: "number",
      step: "1",
    },
    {
      id: "known_profile_count",
      label: "Known Profile Count",
      placeholder: "e.g., 50,000",
      icon: Users,
      type: "number",
      step: "1",
    },
    {
      id: "consent_rate",
      label: "Consent Rate (%)",
      placeholder: "e.g., 45.5",
      icon: ShieldCheck,
      type: "number",
      step: "0.1",
    },
    {
      id: "aov",
      label: "Average Order Value ($)",
      placeholder: "e.g., 75.50",
      icon: DollarSign,
      type: "number",
      step: "0.01",
    },
    {
      id: "conversion_rate",
      label: "Conversion Rate (%)",
      placeholder: "e.g., 2.5",
      icon: TrendingUp,
      type: "number",
      step: "0.1",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-2">Business Metrics</h2>
        <p className="text-muted-foreground">
          Help us understand your current performance to provide better benchmarks
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          (Optional but recommended for more accurate results)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const Icon = field.icon;
          const value = data[field.id as keyof typeof data];
          
          return (
            <div
              key={field.id}
              className={`space-y-2 ${field.id === "conversion_rate" ? "md:col-span-2" : ""}`}
            >
              <Label
                htmlFor={field.id}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Icon className="w-4 h-4 text-primary" />
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                step={field.step}
                placeholder={field.placeholder}
                value={value || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
              />
            </div>
          );
        })}
      </div>

      {/* Helpful tip */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <p className="text-sm text-navy-light">
          <strong className="text-primary">💡 Why we ask:</strong> These metrics help us compare your performance 
          against industry benchmarks and recommend the most impactful growth plays for your specific situation.
        </p>
      </div>
    </div>
  );
}
