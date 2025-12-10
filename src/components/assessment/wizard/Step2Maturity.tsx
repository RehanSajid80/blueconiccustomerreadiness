import { useState } from "react";
import { cn } from "@/lib/utils";
import { MaturityQuestion } from "./MaturityQuestion";
import { Database, Zap, Brain, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaturityScores {
  data_readiness: number[];
  activation: number[];
  decisioning: number[];
  governance: number[];
}

interface Step2MaturityProps {
  scores: MaturityScores;
  onScoresChange: (scores: MaturityScores) => void;
}

const sections = [
  {
    id: "data_readiness",
    title: "Data Readiness",
    subtitle: "How your customer data actually lives, breathes, and behaves.",
    icon: Database,
    color: "from-blue-500 to-blue-600",
    questions: [
    {
        question: "Be honest… how does your customer data actually behave day-to-day?",
        options: [
          { value: 1, label: "It's living its best siloed life. Totally disconnected." },
          { value: 2, label: "We've herded some of it together, but it still wanders." },
          { value: 3, label: "Mostly unified… as long as no one bumps anything." },
          { value: 4, label: "Real-time(ish) and flowing across teams pretty smoothly." },
          { value: 5, label: "Automated, real-time, and basically self-maintaining. Dreamy." },
        ],
      },
      {
        question: "How easy is it for your teams to spin up the audiences they actually want?",
        options: [
          { value: 1, label: "Every request goes through IT. Enough said." },
          { value: 2, label: "Some self-service, but it's… clunky." },
          { value: 3, label: "Marketing builds most audiences on their own (bless)." },
          { value: 4, label: "Audiences update automatically based on behavior." },
          { value: 5, label: "Audiences update themselves. It's genuinely adaptive and magical." },
        ],
      },
      {
        question: "How solid is your ability to stitch together a single customer view?",
        options: [
          { value: 1, label: "Duplicates, gaps, mystery emails. It's chaos." },
          { value: 2, label: "Some matching, but inconsistent." },
          { value: 3, label: "Mostly unified across major channels." },
          { value: 4, label: "Strong identity resolution with automation." },
          { value: 5, label: "A continuously learning, always-evolving identity graph." },
        ],
      },
    ],
  },
  {
    id: "activation",
    title: "Activation",
    subtitle: "How you bring your customer data to life.",
    icon: Zap,
    color: "from-green-500 to-green-600",
    questions: [
      {
        question: "When you activate campaigns, what does it look like in real life?",
        options: [
          { value: 1, label: "Manual pushes and spreadsheets. We do what we must." },
          { value: 2, label: "Simple rules help, but it's still 'set it and hope.'" },
          { value: 3, label: "Automated flows across channels. We're getting somewhere." },
          { value: 4, label: "Personalized journeys reacting to customer behavior (Woohoo!)." },
          { value: 5, label: "Predictive, self-optimizing activation. We're basically clairvoyant." },
        ],
      },
      {
        question: "How easily can your team test and try new personalization or targeting ideas?",
        options: [
          { value: 1, label: "Painful. Requires setup, approvals, and too many emails." },
          { value: 2, label: "Possible, but cumbersome." },
          { value: 3, label: "We run experiments regularly." },
          { value: 4, label: "Testing is baked into our workflows." },
          { value: 5, label: "Always-on optimization feeding continuous improvement." },
        ],
      },
      {
        question: "How connected are your activation channels to your customer data?",
        options: [
          { value: 1, label: "Mostly disconnected. Manual exports rule the land." },
          { value: 2, label: "A few connections, but patchy at best." },
          { value: 3, label: "Most channels pull from unified data. Progress!" },
          { value: 4, label: "Channels react to customer signals in real time." },
          { value: 5, label: "Channel orchestration is fully automated and adaptive." },
        ],
      },
    ],
  },
  {
    id: "decisioning",
    title: "Decisioning",
    subtitle: "How you decide what happens next for each customer.",
    icon: Brain,
    color: "from-purple-500 to-purple-600",
    questions: [
      {
        question: "How would you describe your approach to customer decisioning today?",
        options: [
          { value: 1, label: "Manual decisions all the way." },
          { value: 2, label: "Basic if/then rules. You know, the classics." },
          { value: 3, label: "Contextual decisions based on segments or behaviors." },
          { value: 4, label: "Dynamic decisions adjusting in real time." },
          { value: 5, label: "AI-driven decisioning. We guide; it decides." },
        ],
      },
      {
        question: "How do you decide what a customer should see next?",
        options: [
          { value: 1, label: "Everyone gets the same thing… we try our best." },
          { value: 2, label: "Personas guide the way, still pretty broad." },
          { value: 3, label: "Personalized based on real customer data (heck yeah)." },
          { value: 4, label: "Context-aware experiences shifting in real time." },
          { value: 5, label: "AI handles next-best-experience selection." },
        ],
      },
      {
        question: "How do you measure the impact of your customer interactions?",
        options: [
          { value: 1, label: "Ad hoc reporting. We call it vibes-based measurement." },
          { value: 2, label: "Basic KPIs tracked inconsistently." },
          { value: 3, label: "Defined measurement frameworks." },
          { value: 4, label: "Real-time dashboards tied to customer behavior." },
          { value: 5, label: "Continuous learning loops fueling predictive models." },
        ],
      },
    ],
  },
  {
    id: "governance",
    title: "Governance",
    subtitle: "How your organization manages, protects, and shares customer data + responsibility.",
    icon: Shield,
    color: "from-orange-500 to-orange-600",
    questions: [
      {
        question: "How formalized is your approach to data governance and privacy?",
        options: [
          { value: 1, label: "Reactive. We deal with issues when they're on fire." },
          { value: 2, label: "Documented processes, lightly followed." },
          { value: 3, label: "Cross-functional governance with real oversight." },
          { value: 4, label: "Governance woven into daily workflows." },
          { value: 5, label: "Automated, transparent, self-optimizing governance." },
        ],
      },
      {
        question: "How well do teams share ownership of customer data and customer experience outcomes?",
        options: [
          { value: 1, label: "Silo city. Everyone has their own kingdom." },
          { value: 2, label: "Some shared processes, but blurry ownership." },
          { value: 3, label: "Clear responsibilities across teams." },
          { value: 4, label: "Strong cross-functional alignment + shared KPIs." },
          { value: 5, label: "Fully integrated operating model. One team. One dream." },
        ],
      },
      {
        question: "How confident are you in maintaining consistent, high-quality customer data across systems?",
        options: [
          { value: 1, label: "No real process. It's inconsistent at best." },
          { value: 2, label: "Some manual checks, but unpredictable." },
          { value: 3, label: "Regular quality processes in place." },
          { value: 4, label: "Automated quality monitoring running in the background." },
          { value: 5, label: "Continuous, ML-driven quality optimization." },
        ],
      },
    ],
  },
];

export function Step2Maturity({ scores, onScoresChange }: Step2MaturityProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const section = sections[currentSection];
  const question = section.questions[currentQuestion];
  const sectionKey = section.id as keyof MaturityScores;
  const currentValue = scores[sectionKey][currentQuestion];

  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = Object.values(scores).flat().filter((v) => v > 0).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleSelect = (value: number) => {
    const newScores = { ...scores };
    newScores[sectionKey][currentQuestion] = value;
    onScoresChange(newScores);
  };

  const handleNext = () => {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(sections[currentSection - 1].questions.length - 1);
    }
  };

  const isFirst = currentSection === 0 && currentQuestion === 0;
  const isLast =
    currentSection === sections.length - 1 &&
    currentQuestion === section.questions.length - 1;

  const globalQuestionIndex =
    sections.slice(0, currentSection).reduce((sum, s) => sum + s.questions.length, 0) +
    currentQuestion +
    1;

  const Icon = section.icon;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
            section.color
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">{section.title}</h2>
          <p className="text-sm text-muted-foreground">{section.subtitle}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {globalQuestionIndex} of {totalQuestions}
          </span>
          <span className="font-medium text-primary">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2">
        {sections.map((s, idx) => {
          const sKey = s.id as keyof MaturityScores;
          const sectionAnswered = scores[sKey].filter((v) => v > 0).length;
          const sectionTotal = s.questions.length;
          const isComplete = sectionAnswered === sectionTotal;
          const isCurrent = idx === currentSection;

          return (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSection(idx);
                setCurrentQuestion(0);
              }}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                isCurrent
                  ? "bg-primary text-white shadow-md"
                  : isComplete
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {s.title}
              {isComplete && !isCurrent && " ✓"}
            </button>
          );
        })}
      </div>

      {/* Question */}
      <div className="min-h-[400px]">
        <MaturityQuestion
          question={question.question}
          options={question.options}
          selectedValue={currentValue}
          onSelect={handleSelect}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={isFirst}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentValue === 0 || isLast}
          className="gap-2 bg-gradient-to-r from-primary to-secondary"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Export the sections for use in the wizard
export { sections as maturitySections };
