import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { storeIntelligence } from "../_shared/memory-client.ts";

const SF_CLIENT_ID = Deno.env.get("SALESFORCE_CLIENT_ID");
const SF_CLIENT_SECRET = Deno.env.get("SALESFORCE_CLIENT_SECRET");
const SF_USERNAME = Deno.env.get("SALESFORCE_USERNAME");
const SF_PASSWORD = Deno.env.get("SALESFORCE_PASSWORD");
const SF_LOGIN_URL = Deno.env.get("SALESFORCE_LOGIN_URL") || "https://login.salesforce.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssessmentPayload {
  // Assessment identifiers
  assessment_id: string;
  results_url: string;

  // Contact info
  email: string;
  company_name: string;
  first_name?: string;
  last_name?: string;

  // Scores
  data_readiness_score: number;
  activation_score: number;
  decisioning_score: number;
  governance_score: number;
  growth_readiness_score: number;

  // Context
  industry_name?: string;
  persona_type?: string;
  challenges?: string[];
  goals?: string[];
  growth_play_recs?: string[];

  // UTM tracking
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;

  // If we already found them in Salesforce during lookup
  salesforce_id?: string;
  salesforce_type?: "contact" | "lead";
}

/**
 * Build the custom field data for Salesforce Lead/Contact
 */
function buildCustomFields(payload: AssessmentPayload): Record<string, any> {
  const maturityBand = getMaturityBand(payload.growth_readiness_score);
  const today = new Date().toISOString().split("T")[0];

  return {
    // Data Maturity custom fields
    Data_Maturity_Activation_Score__c: payload.activation_score,
    Data_Maturity_Assessment_Date__c: today,
    Data_Maturity_Assessment_Results_URL__c: payload.results_url,
    Data_Maturity_Challenges__c: payload.challenges?.join(", ") || null,
    Data_Maturity_Data_Readiness_Score__c: payload.data_readiness_score,
    Data_Maturity_Decisioning_Score__c: payload.decisioning_score,
    Data_Maturity_Goals__c: payload.goals?.join(", ") || null,
    Data_Maturity_Governance_Score__c: payload.governance_score,
    Data_Maturity_Growth_Play_Recs__c: payload.growth_play_recs?.join("; ") || null,
    Data_Maturity_Growth_Readiness_Score__c: payload.growth_readiness_score,
    Data_Maturity_Maturity_Band__c: maturityBand,

    // UTM tracking fields
    utm_source__c: payload.utm_source || null,
    Medium_utm__c: payload.utm_medium || null,
    Campaign_utm__c: payload.utm_campaign || null,
    Content_utm__c: payload.utm_content || null,
  };
}

async function getSalesforceToken(): Promise<{ access_token: string; instance_url: string }> {
  const params = new URLSearchParams();
  params.set("grant_type", "password");
  params.set("client_id", SF_CLIENT_ID || "");
  params.set("client_secret", SF_CLIENT_SECRET || "");
  params.set("username", SF_USERNAME || "");
  params.set("password", SF_PASSWORD || "");

  const response = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce auth failed: ${errorText}`);
  }

  return response.json();
}

/**
 * Create a new Lead in Salesforce
 */
async function createLead(
  instanceUrl: string,
  accessToken: string,
  payload: AssessmentPayload
): Promise<{ id: string; success: boolean }> {
  const leadData: Record<string, any> = {
    FirstName: payload.first_name || "Assessment",
    LastName: payload.last_name || "Participant",
    Email: payload.email,
    Company: payload.company_name || "Unknown",
    LeadSource: "Growth Readiness Assessment",
    Industry: payload.industry_name || null,
    Description: buildDescription(payload),
    ...buildCustomFields(payload),
  };

  const response = await fetch(`${instanceUrl}/services/data/v59.0/sobjects/Lead`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Lead: ${errorText}`);
  }

  return response.json();
}

/**
 * Update an existing Lead or Contact with assessment data
 */
async function updateRecord(
  instanceUrl: string,
  accessToken: string,
  recordType: "Lead" | "Contact",
  recordId: string,
  payload: AssessmentPayload
): Promise<void> {
  const updateData: Record<string, any> = {
    Description: buildDescription(payload),
    ...buildCustomFields(payload),
  };

  // If updating a Lead, also set LeadSource
  if (recordType === "Lead") {
    updateData.LeadSource = "Growth Readiness Assessment";
  }

  const response = await fetch(
    `${instanceUrl}/services/data/v59.0/sobjects/${recordType}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update ${recordType}: ${errorText}`);
  }
}

/**
 * Build a readable description with all assessment data.
 * This goes into the Description field. If you create custom fields later,
 * you can write scores directly to those fields instead.
 */
function buildDescription(payload: AssessmentPayload): string {
  const maturityBand = getMaturityBand(payload.growth_readiness_score);
  const lines = [
    `=== BlueConic Growth Readiness Assessment ===`,
    `Date: ${new Date().toISOString().split("T")[0]}`,
    `Report: ${payload.results_url}`,
    ``,
    `Overall Readiness: ${payload.growth_readiness_score}/100 (${maturityBand})`,
    ``,
    `Pillar Scores (1-5):`,
    `  Data Readiness: ${payload.data_readiness_score}`,
    `  Activation: ${payload.activation_score}`,
    `  Decisioning: ${payload.decisioning_score}`,
    `  Governance: ${payload.governance_score}`,
  ];

  if (payload.industry_name) {
    lines.push(``, `Industry: ${payload.industry_name}`);
  }
  if (payload.persona_type) {
    lines.push(`Persona: ${payload.persona_type}`);
  }
  if (payload.challenges?.length) {
    lines.push(``, `Challenges: ${payload.challenges.join(", ")}`);
  }
  if (payload.goals?.length) {
    lines.push(`Goals: ${payload.goals.join(", ")}`);
  }

  return lines.join("\n");
}

function getMaturityBand(score: number): string {
  if (score <= 20) return "Emerging";
  if (score <= 40) return "Scaling";
  if (score <= 60) return "Transforming";
  if (score <= 80) return "Intelligent";
  return "Autonomous";
}

/**
 * Create a Task on the Lead/Contact so the AE gets notified
 */
async function createTask(
  instanceUrl: string,
  accessToken: string,
  whoId: string,
  payload: AssessmentPayload
): Promise<void> {
  const maturityBand = getMaturityBand(payload.growth_readiness_score);
  const taskData = {
    Subject: `Growth Readiness Assessment: ${payload.company_name} (${maturityBand})`,
    Description: `${payload.company_name} completed the Growth Readiness Assessment.\n\nScore: ${payload.growth_readiness_score}/100 (${maturityBand})\nReport: ${payload.results_url}\n\nReview their results and follow up within 24 hours.`,
    WhoId: whoId,
    Status: "Not Started",
    Priority: payload.growth_readiness_score >= 40 ? "High" : "Normal",
    ActivityDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Due tomorrow
  };

  const response = await fetch(`${instanceUrl}/services/data/v59.0/sobjects/Task`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    // Don't fail the whole request if task creation fails
    const errorText = await response.text();
    console.warn(`[salesforce-writeback] Task creation failed: ${errorText}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AssessmentPayload = await req.json();

    if (!payload.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SF_CLIENT_ID || !SF_CLIENT_SECRET) {
      throw new Error("Salesforce credentials not configured");
    }

    // 1. Authenticate to Salesforce
    const { access_token, instance_url } = await getSalesforceToken();

    let recordId = payload.salesforce_id;
    let recordType: "Lead" | "Contact" = payload.salesforce_type === "contact" ? "Contact" : "Lead";

    // 2. Create or update
    if (recordId) {
      // We already know who they are from the lookup step
      await updateRecord(instance_url, access_token, recordType, recordId, payload);
    } else {
      // New person — create a Lead
      const result = await createLead(instance_url, access_token, payload);
      recordId = result.id;
      recordType = "Lead";
    }

    // 3. Create a follow-up Task for the AE
    if (recordId) {
      await createTask(instance_url, access_token, recordId, payload);
    }

    // 4. Store in cross-agent memory
    const maturityBand = getMaturityBand(payload.growth_readiness_score);
    storeIntelligence(
      `[Salesforce Sync] ${payload.company_name} (${payload.industry_name || "Unknown"}) assessment synced to Salesforce as ${recordType} ${recordId}. Score: ${payload.growth_readiness_score}/100 (${maturityBand}). AE task created.`,
      {
        type: "salesforce_sync",
        company: payload.company_name,
        salesforce_id: recordId,
        salesforce_type: recordType,
        readiness_score: payload.growth_readiness_score,
      }
    ).catch((e) => console.warn("[salesforce-writeback] Memory store failed:", e));

    return new Response(
      JSON.stringify({
        success: true,
        salesforce_id: recordId,
        salesforce_type: recordType,
        action: payload.salesforce_id ? "updated" : "created",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[salesforce-writeback] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
