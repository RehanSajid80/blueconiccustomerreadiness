import { cn } from "@/lib/utils";
import { ChallengeType, GoalType, CHALLENGES, GOALS } from "@/types/assessment";
import { Check, AlertTriangle, Target, TrendingDown, ShoppingCart, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Step3ChallengesProps {
  selectedChallenges: ChallengeType[];
  selectedGoals: GoalType[];
  onChallengesChange: (challenges: ChallengeType[]) => void;
  onGoalsChange: (goals: GoalType[]) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  acquisition: <TrendingDown className="w-4 h-4" />,
  conversion: <ShoppingCart className="w-4 h-4" />,
  retention: <Users className="w-4 h-4" />,
  loyalty: <Heart className="w-4 h-4" />,
};

const categoryLabels: Record<string, string> = {
  acquisition: "Acquisition Challenges",
  conversion: "Conversion Challenges",
  retention: "Retention Challenges",
  loyalty: "Loyalty Challenges",
};

const categoryColors: Record<string, string> = {
  acquisition: "bg-blue-50 border-blue-200 text-blue-700",
  conversion: "bg-green-50 border-green-200 text-green-700",
  retention: "bg-orange-50 border-orange-200 text-orange-700",
  loyalty: "bg-purple-50 border-purple-200 text-purple-700",
};

export function Step3Challenges({
  selectedChallenges,
  selectedGoals,
  onChallengesChange,
  onGoalsChange,
}: Step3ChallengesProps) {
  const toggleChallenge = (challengeId: ChallengeType) => {
    if (selectedChallenges.includes(challengeId)) {
      onChallengesChange(selectedChallenges.filter((c) => c !== challengeId));
    } else if (selectedChallenges.length < 3) {
      onChallengesChange([...selectedChallenges, challengeId]);
    }
  };

  const toggleGoal = (goalId: GoalType) => {
    if (selectedGoals.includes(goalId)) {
      onGoalsChange(selectedGoals.filter((g) => g !== goalId));
    } else if (selectedGoals.length < 3) {
      onGoalsChange([...selectedGoals, goalId]);
    }
  };

  // Group challenges by category
  const challengesByCategory = CHALLENGES.reduce((acc, challenge) => {
    if (!acc[challenge.category]) {
      acc[challenge.category] = [];
    }
    acc[challenge.category].push(challenge);
    return acc;
  }, {} as Record<string, typeof CHALLENGES>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-2">
          What Challenges Are You Facing?
        </h2>
        <p className="text-muted-foreground">
          Select up to 3 challenges that resonate most with your business
        </p>
      </div>

      {/* Challenges Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-navy">Your Top Challenges</h3>
          </div>
          <Badge variant="outline" className={cn(
            "font-medium",
            selectedChallenges.length === 3 ? "bg-green-50 text-green-700 border-green-200" : ""
          )}>
            {selectedChallenges.length} / 3 selected
          </Badge>
        </div>

        {/* Challenge categories */}
        <div className="space-y-6">
          {Object.entries(challengesByCategory).map(([category, challenges]) => (
            <div key={category} className="space-y-3">
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
                categoryColors[category]
              )}>
                {categoryIcons[category]}
                {categoryLabels[category]}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {challenges.map((challenge) => {
                  const isSelected = selectedChallenges.includes(challenge.id);
                  const isDisabled = !isSelected && selectedChallenges.length >= 3;

                  return (
                    <button
                      key={challenge.id}
                      onClick={() => toggleChallenge(challenge.id)}
                      disabled={isDisabled}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : isDisabled
                          ? "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed"
                          : "border-border/50 hover:border-primary/50 hover:bg-primary/[0.02]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground block truncate">
                          {challenge.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-muted-foreground font-medium">
            And your priorities
          </span>
        </div>
      </div>

      {/* Goals Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" />
            <h3 className="font-semibold text-navy">What Are Your Primary Goals?</h3>
          </div>
          <Badge variant="outline" className={cn(
            "font-medium",
            selectedGoals.length === 3 ? "bg-green-50 text-green-700 border-green-200" : ""
          )}>
            {selectedGoals.length} / 3 selected
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          Select up to 3 goals you want to achieve
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            const isDisabled = !isSelected && selectedGoals.length >= 3;

            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left",
                  isSelected
                    ? "border-secondary bg-secondary/5 shadow-sm"
                    : isDisabled
                    ? "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed"
                    : "border-border/50 hover:border-secondary/50 hover:bg-secondary/[0.02]"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected
                      ? "border-secondary bg-secondary text-white"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground block">
                    {goal.label}
                  </span>
                  <span className="text-xs text-muted-foreground block truncate">
                    {goal.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helpful tip */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
        <p className="text-sm text-navy-light">
          <strong className="text-primary">Why we ask:</strong> Your challenges and goals help us map you to the most relevant
          BlueConic Growth Plays. We'll show you exactly which plays address your specific friction points.
        </p>
      </div>
    </div>
  );
}
