import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MaturityDimension } from "@/types/assessment";
import { Card } from "@/components/ui/card";

interface Step2MaturityProps {
  dimensions: MaturityDimension[];
  scores: Record<string, number>;
  onScoreChange: (dimensionName: string, value: number) => void;
}

export function Step2Maturity({
  dimensions,
  scores,
  onScoreChange,
}: Step2MaturityProps) {
  const getLabel = (dimension: MaturityDimension, value: number): string => {
    const labels = [
      dimension.level_1_label,
      dimension.level_2_label,
      dimension.level_3_label,
      dimension.level_4_label,
      dimension.level_5_label,
    ];
    return labels[value - 1] || "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Assess Your Maturity</h2>
        <p className="text-muted-foreground">
          Rate your organization's capabilities on a scale of 1-5
        </p>
      </div>

      <div className="space-y-6">
        {dimensions.map((dimension) => {
          const score = scores[dimension.name] || 3;
          return (
            <Card key={dimension.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Label className="text-lg font-semibold">{dimension.name}</Label>
                    {dimension.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {dimension.description}
                      </p>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-primary ml-4">
                    {score}
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[score]}
                    onValueChange={(values) => onScoreChange(dimension.name, values[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 - {dimension.level_1_label}</span>
                    <span className="font-medium text-foreground">
                      {getLabel(dimension, score)}
                    </span>
                    <span>5 - {dimension.level_5_label}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
