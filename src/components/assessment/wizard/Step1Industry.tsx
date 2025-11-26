import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Industry, Persona } from "@/types/assessment";

interface Step1IndustryProps {
  industries: Industry[];
  personas: Persona[];
  selectedIndustry: string | null;
  selectedPersona: string | null;
  onIndustryChange: (value: string) => void;
  onPersonaChange: (value: string) => void;
}

export function Step1Industry({
  industries,
  personas,
  selectedIndustry,
  selectedPersona,
  onIndustryChange,
  onPersonaChange,
}: Step1IndustryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Let's Get Started</h2>
        <p className="text-muted-foreground">
          Tell us about your industry and role to personalize your assessment
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={selectedIndustry || ""} onValueChange={onIndustryChange}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="persona">Your Role</Label>
          <Select value={selectedPersona || ""} onValueChange={onPersonaChange}>
            <SelectTrigger id="persona">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {personas.map((persona) => (
                <SelectItem key={persona.id} value={persona.id}>
                  {persona.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
