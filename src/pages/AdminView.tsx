import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Users, Building2, Target, BarChart3, Loader2 } from "lucide-react";

interface GrowthPlay {
  id: string;
  name: string;
  journey_stage: string | null;
  jtbd: string | null;
  complexity: string | null;
  time_to_value: string | null;
  primary_success_metric: string | null;
  is_active: boolean;
  data_readiness_prereq: number | null;
  activation_prereq: number | null;
  decisioning_prereq: number | null;
  experimentation_prereq: number | null;
  governance_prereq: number | null;
  estimated_impact_min: number | null;
  estimated_impact_max: number | null;
}

interface Industry {
  id: string;
  name: string;
  type: string;
}

interface Persona {
  id: string;
  name: string;
  type: string;
}

interface Benchmark {
  id: string;
  industry_id: string | null;
  consent_rate_avg: number | null;
  declared_data_capture_avg: number | null;
  conversion_lift_min: number | null;
  conversion_lift_max: number | null;
  example_companies: string | null;
}

interface Assessment {
  id: string;
  company_name: string | null;
  email: string | null;
  growth_readiness_score: number | null;
  data_readiness_score: number | null;
  activation_score: number | null;
  decisioning_score: number | null;
  created_at: string;
}

export default function AdminView() {
  const [growthPlays, setGrowthPlays] = useState<GrowthPlay[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      const [playsRes, industriesRes, personasRes, benchmarksRes, assessmentsRes] = await Promise.all([
        supabase.from("growth_plays").select("*").order("name"),
        supabase.from("industries").select("*").order("name"),
        supabase.from("personas").select("*").order("name"),
        supabase.from("benchmarks").select("*"),
        supabase.from("assessments").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      if (playsRes.data) setGrowthPlays(playsRes.data);
      if (industriesRes.data) setIndustries(industriesRes.data);
      if (personasRes.data) setPersonas(personasRes.data);
      if (benchmarksRes.data) setBenchmarks(benchmarksRes.data);
      if (assessmentsRes.data) setAssessments(assessmentsRes.data);

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading database tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
            Admin Preview
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Database Tables Overview
          </h1>
          <p className="text-muted-foreground">
            View the Supabase tables that drive the assessment results and growth plays.
          </p>
        </div>

        <Tabs defaultValue="growth-plays" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            <TabsTrigger value="growth-plays" className="gap-2">
              <Target className="h-4 w-4" />
              Growth Plays ({growthPlays.length})
            </TabsTrigger>
            <TabsTrigger value="industries" className="gap-2">
              <Building2 className="h-4 w-4" />
              Industries ({industries.length})
            </TabsTrigger>
            <TabsTrigger value="personas" className="gap-2">
              <Users className="h-4 w-4" />
              Personas ({personas.length})
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Benchmarks ({benchmarks.length})
            </TabsTrigger>
            <TabsTrigger value="assessments" className="gap-2">
              <Database className="h-4 w-4" />
              Assessments ({assessments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth-plays">
            <Card className="p-6 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Growth Plays Table</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Journey Stage</TableHead>
                    <TableHead>Complexity</TableHead>
                    <TableHead>Time to Value</TableHead>
                    <TableHead>Prerequisites (D/A/De/E/G)</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {growthPlays.map((play) => (
                    <TableRow key={play.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {play.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{play.journey_stage || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>{play.complexity || "N/A"}</TableCell>
                      <TableCell>{play.time_to_value || "N/A"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {play.data_readiness_prereq || "-"}/
                        {play.activation_prereq || "-"}/
                        {play.decisioning_prereq || "-"}/
                        {play.experimentation_prereq || "-"}/
                        {play.governance_prereq || "-"}
                      </TableCell>
                      <TableCell>
                        {play.estimated_impact_min && play.estimated_impact_max
                          ? `${play.estimated_impact_min}-${play.estimated_impact_max}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={play.is_active ? "default" : "secondary"}>
                          {play.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="industries">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Industries Table</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {industries.map((industry) => (
                    <TableRow key={industry.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {industry.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{industry.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{industry.type}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="personas">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personas Table</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personas.map((persona) => (
                    <TableRow key={persona.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {persona.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{persona.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{persona.type}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Benchmarks Table</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Industry ID</TableHead>
                    <TableHead>Consent Rate Avg</TableHead>
                    <TableHead>Data Capture Avg</TableHead>
                    <TableHead>Conversion Lift</TableHead>
                    <TableHead>Example Companies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarks.map((benchmark) => (
                    <TableRow key={benchmark.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {benchmark.industry_id?.slice(0, 8) || "N/A"}...
                      </TableCell>
                      <TableCell>
                        {benchmark.consent_rate_avg ? `${benchmark.consent_rate_avg}%` : "N/A"}
                      </TableCell>
                      <TableCell>
                        {benchmark.declared_data_capture_avg
                          ? `${benchmark.declared_data_capture_avg}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {benchmark.conversion_lift_min && benchmark.conversion_lift_max
                          ? `${benchmark.conversion_lift_min}-${benchmark.conversion_lift_max}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {benchmark.example_companies || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {benchmarks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No benchmarks configured yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Assessments (Last 20)</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Growth Score</TableHead>
                    <TableHead>Maturity (D/A/De)</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {assessment.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {assessment.company_name || "N/A"}
                      </TableCell>
                      <TableCell>{assessment.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10">
                          {assessment.growth_readiness_score || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {assessment.data_readiness_score || "-"}/
                        {assessment.activation_score || "-"}/
                        {assessment.decisioning_score || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {assessments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No assessments completed yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
