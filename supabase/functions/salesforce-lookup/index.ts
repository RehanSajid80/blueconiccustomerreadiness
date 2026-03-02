import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SF_CLIENT_ID = Deno.env.get("SALESFORCE_CLIENT_ID");
const SF_CLIENT_SECRET = Deno.env.get("SALESFORCE_CLIENT_SECRET");
const SF_USERNAME = Deno.env.get("SALESFORCE_USERNAME");
const SF_PASSWORD = Deno.env.get("SALESFORCE_PASSWORD");
const SF_LOGIN_URL = Deno.env.get("SALESFORCE_LOGIN_URL") || "https://login.salesforce.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SalesforceTokenResponse {
  access_token: string;
  instance_url: string;
}

interface LookupResult {
  found: boolean;
  source: "contact" | "lead" | null;
  data: {
    id?: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    industry?: string;
    account_id?: string;
    owner_name?: string;
    title?: string;
    existing_customer?: boolean;
  } | null;
}

/**
 * Authenticate to Salesforce via OAuth2 Username-Password flow.
 * If you use Client Credentials flow instead, swap grant_type and remove username/password.
 */
async function getSalesforceToken(): Promise<SalesforceTokenResponse> {
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
 * Query Salesforce using SOQL
 */
async function querySalesforce(
  instanceUrl: string,
  accessToken: string,
  soql: string
): Promise<any> {
  const url = `${instanceUrl}/services/data/v59.0/query?q=${encodeURIComponent(soql)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Salesforce query failed: ${errorText}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ found: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SF_CLIENT_ID || !SF_CLIENT_SECRET) {
      throw new Error("Salesforce credentials not configured");
    }

    // 1. Authenticate
    const { access_token, instance_url } = await getSalesforceToken();

    // 2. Search Contacts first (existing customers)
    const sanitizedEmail = email.replace(/'/g, "\\'");
    const contactQuery = `
      SELECT Id, FirstName, LastName, Title, Email,
             Account.Name, Account.Industry, Account.Id,
             Owner.Name
      FROM Contact
      WHERE Email = '${sanitizedEmail}'
      LIMIT 1
    `;

    const contactResult = await querySalesforce(instance_url, access_token, contactQuery);

    if (contactResult.totalSize > 0) {
      const contact = contactResult.records[0];
      const result: LookupResult = {
        found: true,
        source: "contact",
        data: {
          id: contact.Id,
          first_name: contact.FirstName,
          last_name: contact.LastName,
          company_name: contact.Account?.Name || null,
          industry: contact.Account?.Industry || null,
          account_id: contact.Account?.Id || null,
          owner_name: contact.Owner?.Name || null,
          title: contact.Title,
          existing_customer: true,
        },
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Search Leads (prospects)
    const leadQuery = `
      SELECT Id, FirstName, LastName, Title, Email,
             Company, Industry, Owner.Name, Status
      FROM Lead
      WHERE Email = '${sanitizedEmail}'
      LIMIT 1
    `;

    const leadResult = await querySalesforce(instance_url, access_token, leadQuery);

    if (leadResult.totalSize > 0) {
      const lead = leadResult.records[0];
      const result: LookupResult = {
        found: true,
        source: "lead",
        data: {
          id: lead.Id,
          first_name: lead.FirstName,
          last_name: lead.LastName,
          company_name: lead.Company || null,
          industry: lead.Industry || null,
          owner_name: lead.Owner?.Name || null,
          title: lead.Title,
          existing_customer: false,
        },
      };

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Not found
    return new Response(
      JSON.stringify({ found: false, source: null, data: null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[salesforce-lookup] Error:", error);
    return new Response(
      JSON.stringify({ found: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
