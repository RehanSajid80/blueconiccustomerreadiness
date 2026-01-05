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
    <div className="py-20 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4 text-navy">
          Why First-Party Data Matters
        </h2>
        <p className="text-navy-light/70 text-center mb-16 max-w-2xl mx-auto text-lg">
          Leading brands are winning with first-party data strategies. Here's what the data shows.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="p-8 text-center bg-white border-primary/10 hover:shadow-[0_8px_24px_rgba(74,159,245,0.12)] transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <div className={`w-16 h-16 ${stat.color} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_4px_12px_rgba(74,159,245,0.15)]`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-navy-light/70 leading-relaxed">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
