import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MaturityOption {
  value: number;
  label: string;
}

interface MaturityQuestionProps {
  question: string;
  options: MaturityOption[];
  selectedValue: number;
  onSelect: (value: number) => void;
}

export function MaturityQuestion({
  question,
  options,
  selectedValue,
  onSelect,
}: MaturityQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-navy leading-relaxed">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group",
              selectedValue === option.value
                ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary))]"
                : "border-border/50 hover:border-primary/50 hover:bg-primary/[0.02]"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedValue === option.value
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
              >
                {selectedValue === option.value && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-navy-light/60 mr-2">({option.value})</span>
                <span className="text-foreground">{option.label}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
