import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Users, Target, Lightbulb, Search, Calendar, Filter, ExternalLink, ChevronRight } from "lucide-react";

const mockAssessments = [
  {
    id: 1,
    company: "Acme Corp",
    contact: "Jane Smith",
    persona: "Digital Marketing",
    vertical: "Retail",
    tier: "Connected",
    score: 72,
    gapPillar: "Intelligence",
    created: "2024-01-15"
  },
  {
    id: 2,
    company: "GlobalTech Inc",
    contact: "John Doe",
    persona: "Customer Experience",
    vertical: "DTC",
    tier: "Data Curious",
    score: 58,
    gapPillar: "Data Quality",
    created: "2024-01-14"
  },
  {
    id: 3,
    company: "RetailMax",
    contact: "Sarah Johnson",
    persona: "Growth",
    vertical: "Ecommerce",
    tier: "Composable",
    score: 85,
    gapPillar: "Impact",
    created: "2024-01-13"
  }
];

const tierColors = {
  "Data Curious": "bg-amber-500/10 text-amber-700 border-amber-500/30",
  "Connected": "bg-blue-500/10 text-blue-700 border-blue-500/30",
  "Composable": "bg-purple-500/10 text-purple-700 border-purple-500/30",
  "Intelligent": "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
};

export default function BlueconicView() {
  const [selectedAssessment, setSelectedAssessment] = useState<typeof mockAssessments[0] | null>(null);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assessment Dashboard</h1>
          <p className="text-muted-foreground">Internal view for sales and marketing teams</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last Quarter</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Personas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Personas</SelectItem>
                <SelectItem value="marketing">Digital Marketing</SelectItem>
                <SelectItem value="cx">Customer Experience</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Verticals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verticals</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="dtc">DTC</SelectItem>
                <SelectItem value="ecommerce">Ecommerce</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="curious">Data Curious</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="composable">Composable</SelectItem>
                <SelectItem value="intelligent">Intelligent</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search company..." className="pl-9" />
            </div>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total Assessments</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">147</span>
              <div className="flex items-center gap-1 text-secondary text-sm">
                <TrendingUp className="h-3 w-3" />
                <span>+12%</span>
              </div>
            </div>
            <div className="mt-4 h-12 flex items-end gap-1">
              {[40, 55, 35, 70, 50, 60, 75].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Avg Readiness Score</span>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">68</span>
              <div className="flex items-center gap-1 text-accent text-sm">
                <TrendingUp className="h-3 w-3" />
                <span>+5 pts</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[68%] rounded-full" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Most Common Tier</span>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <Badge className={tierColors["Connected"] + " text-base px-3 py-1"}>
                Connected
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              42% of assessments fall in this tier
            </p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Table */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-xl font-bold mb-4">Recent Assessments</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Persona</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Gap Pillar</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssessments.map((assessment) => (
                    <TableRow key={assessment.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{assessment.company}</TableCell>
                      <TableCell>{assessment.contact}</TableCell>
                      <TableCell className="text-sm">{assessment.persona}</TableCell>
                      <TableCell className="text-sm">{assessment.vertical}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${assessment.tier === 'Connected' ? 'bg-blue-500' : assessment.tier === 'Data Curious' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                          <span className="text-xs">{assessment.tier}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{assessment.score}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {assessment.gapPillar}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{assessment.created}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAssessment(assessment)}
                        >
                          View
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Segment Insights */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Top Personas Represented</h3>
              <div className="space-y-3">
                {[
                  { name: "Digital Marketing", count: 45, percentage: 31 },
                  { name: "Customer Experience", count: 38, percentage: 26 },
                  { name: "Growth", count: 35, percentage: 24 }
                ].map((persona) => (
                  <div key={persona.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{persona.name}</span>
                      <span className="font-semibold">{persona.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${persona.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Most Common Gaps</h3>
              <div className="space-y-2">
                {[
                  { gap: "Data Unification", count: 58 },
                  { gap: "AI/ML Capabilities", count: 47 },
                  { gap: "Real-time Activation", count: 39 }
                ].map((item) => (
                  <div key={item.gap} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm">{item.gap}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-accent/5 border-accent/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                Quarterly Insight
              </h3>
              <p className="text-sm text-muted-foreground">
                34% of prospects are actively exploring AI use cases this quarter, up from 22% last quarter.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">{selectedAssessment?.company}</SheetTitle>
            <SheetDescription>
              Assessment completed on {selectedAssessment?.created}
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="summary" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="pillars">Pillars</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
              <TabsTrigger value="crm">CRM</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={tierColors[selectedAssessment?.tier as keyof typeof tierColors]}>
                    {selectedAssessment?.tier}
                  </Badge>
                  <span className="text-3xl font-bold">{selectedAssessment?.score}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This prospect shows strong activation capabilities but needs support in data unification and AI implementation. Prime candidate for Customer Growth Workshop.
                </p>
              </Card>

              <div>
                <h3 className="font-semibold mb-3">Key Strengths</h3>
                <ul className="space-y-2">
                  {["Multi-channel activation in place", "Strong impact measurement practices", "Leadership buy-in on customer growth"].map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Priority Gaps</h3>
                <ul className="space-y-2">
                  {["Fragmented data sources", "Limited AI/ML capabilities", "Slow segment activation"].map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="pillars" className="space-y-4 mt-4">
              {[
                { name: "Data Quality", score: 65, description: "Partially unified data with some integration gaps" },
                { name: "Activation", score: 78, description: "Strong multi-channel capabilities" },
                { name: "Intelligence", score: 52, description: "Limited AI usage, exploring use cases" },
                { name: "Impact", score: 75, description: "Good KPI tracking and measurement" }
              ].map((pillar) => (
                <Card key={pillar.name} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{pillar.name}</h4>
                    <span className="text-2xl font-bold">{pillar.score}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{pillar.description}</p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="signals" className="space-y-3 mt-4">
              {[
                { signal: "Downloaded AI playbook", date: "2 days ago", type: "high" },
                { signal: "Attended webinar on real-time personalization", date: "1 week ago", type: "medium" },
                { signal: "Multiple team members viewed pricing page", date: "3 days ago", type: "high" }
              ].map((signal, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{signal.signal}</p>
                      <p className="text-xs text-muted-foreground mt-1">{signal.date}</p>
                    </div>
                    <Badge variant={signal.type === "high" ? "default" : "secondary"}>
                      {signal.type}
                    </Badge>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="crm" className="space-y-4 mt-4">
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                View in Salesforce
              </Button>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Account Owner</Label>
                  <Select defaultValue="john">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith (AE)</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson (AE)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Lifecycle Stage</Label>
                  <Select defaultValue="mql">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="mql">MQL</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="opportunity">Opportunity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Suggested Next Play</Label>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <p className="text-sm font-medium mb-2">Invite to Customer Growth Workshop</p>
                    <p className="text-xs text-muted-foreground">
                      High-scoring prospect with clear data unification needs. Workshop will demonstrate BlueConic's unified profile capabilities and AI features.
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={className} {...props}>{children}</label>;
}
