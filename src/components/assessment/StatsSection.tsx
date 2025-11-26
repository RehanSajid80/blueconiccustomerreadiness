import { TrendingUp, Users, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "73%",
      label: "of customers expect personalized experiences",
      color: "text-primary"
    },
    {
      icon: Target,
      value: "80/20",
      label: "of revenue comes from 20% of customers",
      color: "text-secondary"
    },
    {
      icon: TrendingUp,
      value: "2.9x",
      label: "more revenue with first-party data strategies",
      color: "text-accent"
    }
  ];

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Why This Matters
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          The data-driven brands are winning. Here's why first-party data and personalization matter.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow border-2">
              <div className={`w-16 h-16 ${stat.color} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
