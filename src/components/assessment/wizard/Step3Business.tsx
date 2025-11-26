import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Business Metrics</h2>
        <p className="text-muted-foreground">
          Help us understand your current performance (optional but recommended)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="traffic">Monthly Web Traffic</Label>
          <Input
            id="traffic"
            type="number"
            placeholder="e.g., 100000"
            value={data.monthly_web_traffic || ""}
            onChange={(e) => handleChange("monthly_web_traffic", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profiles">Known Profile Count</Label>
          <Input
            id="profiles"
            type="number"
            placeholder="e.g., 50000"
            value={data.known_profile_count || ""}
            onChange={(e) => handleChange("known_profile_count", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consent">Consent Rate (%)</Label>
          <Input
            id="consent"
            type="number"
            step="0.1"
            placeholder="e.g., 45.5"
            value={data.consent_rate || ""}
            onChange={(e) => handleChange("consent_rate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aov">Average Order Value ($)</Label>
          <Input
            id="aov"
            type="number"
            step="0.01"
            placeholder="e.g., 75.50"
            value={data.aov || ""}
            onChange={(e) => handleChange("aov", e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="conversion">Conversion Rate (%)</Label>
          <Input
            id="conversion"
            type="number"
            step="0.1"
            placeholder="e.g., 2.5"
            value={data.conversion_rate || ""}
            onChange={(e) => handleChange("conversion_rate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
