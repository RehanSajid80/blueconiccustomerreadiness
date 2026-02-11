// ============================================================================
// Universal Memory Client for AnalyzeLens Command Centre
// Drop this into any agent's supabase/functions/_shared/ directory
// All agents call the central Command Centre memory-api
// ============================================================================

const COMMAND_CENTRE_URL = Deno.env.get('COMMAND_CENTRE_URL') || 'https://euyaexzjdsaiiryvufqq.supabase.co';
const COMMAND_CENTRE_KEY = Deno.env.get('COMMAND_CENTRE_SERVICE_KEY') || '';
const ORG_ID = Deno.env.get('BLUECONIC_ORG_ID') || '11111111-1111-1111-1111-111111111111';
const AGENT_ID = Deno.env.get('AGENT_TEMPLATE_ID') || '';

interface MemorySearchResult {
  memory_id: string;
  content: string;
  content_summary?: string;
  memory_type: string;
  importance_score: number;
  similarity: number;
  tags: string[];
  agent_template_id?: string;
  created_at: string;
}

interface MemoryAddResponse {
  success: boolean;
  memories_added: number;
  memory_ids: string[];
}

interface MemoryContextResponse {
  success: boolean;
  is_memory_enabled: boolean;
  memories: Array<{
    id: string;
    content: string;
    memory_type: string;
    importance_score: number;
    created_at: string;
    agent_template_id?: string;
  }>;
  brain_context?: {
    brand_voice?: string;
    tone_attributes?: string[];
    writing_dos?: string[];
    writing_donts?: string[];
    primary_icp?: {
      name: string;
      pain_points: Array<{ point: string }>;
      goals: Array<{ goal: string }>;
      keywords: string[];
    };
    learnings?: Array<{
      title: string;
      recommendation: string;
      confidence_score: number;
    }>;
  };
  formatted_context?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function callMemoryApi(action: string, body: Record<string, unknown> = {}, agentId?: string): Promise<Response> {
  const url = `${COMMAND_CENTRE_URL}/functions/v1/memory-api/${action}`;
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${COMMAND_CENTRE_KEY}`,
      'x-organization-id': ORG_ID,
      'x-agent-id': agentId || AGENT_ID,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Search memories semantically. Omit agentId to search across ALL agents (cross-agent intelligence).
 */
export async function searchMemories(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
    agentId?: string | null; // null = cross-agent search, undefined = this agent only
    userId?: string;
  } = {}
): Promise<{ memories: MemorySearchResult[]; searchTimeMs: number }> {
  const start = Date.now();
  try {
    const body: Record<string, unknown> = {
      query,
      limit: options.limit || 10,
      threshold: options.threshold || 0.6,
    };
    if (options.userId) body.user_id = options.userId;

    // If agentId is explicitly null, don't pass it (cross-agent search)
    // If agentId is a string, pass it (agent-specific search)
    // If undefined, use default AGENT_ID
    const agentIdToUse = options.agentId === null ? '' : (options.agentId || AGENT_ID);

    const response = await callMemoryApi('search', body, agentIdToUse);
    const data = await response.json();

    if (!data.success) {
      console.warn('[Memory] Search failed:', data.message);
      return { memories: [], searchTimeMs: Date.now() - start };
    }

    return {
      memories: data.memories || [],
      searchTimeMs: Date.now() - start,
    };
  } catch (error) {
    console.error('[Memory] Search error:', error);
    return { memories: [], searchTimeMs: Date.now() - start };
  }
}

/**
 * Add memories from a conversation. The memory-api will auto-extract facts/patterns/insights.
 */
export async function addMemories(
  messages: ChatMessage[],
  metadata: Record<string, unknown> = {}
): Promise<MemoryAddResponse> {
  try {
    const body = {
      messages,
      metadata: {
        ...metadata,
        agent_id: AGENT_ID,
        timestamp: new Date().toISOString(),
      },
    };

    const response = await callMemoryApi('add', body);
    const data = await response.json();

    if (!data.success) {
      console.warn('[Memory] Add failed:', data.message);
      return { success: false, memories_added: 0, memory_ids: [] };
    }

    return {
      success: true,
      memories_added: data.memories_added || 0,
      memory_ids: data.memory_ids || [],
    };
  } catch (error) {
    console.error('[Memory] Add error:', error);
    return { success: false, memories_added: 0, memory_ids: [] };
  }
}

/**
 * Store a specific piece of intelligence as a memory (bypass auto-extraction).
 * Use this for structured data like market moves, assessment results, KPI summaries.
 */
export async function storeIntelligence(
  content: string,
  metadata: Record<string, unknown> = {}
): Promise<MemoryAddResponse> {
  // Wrap as a conversation so memory-api can extract and embed
  return addMemories(
    [
      { role: 'user', content: 'Store this intelligence' },
      { role: 'assistant', content },
    ],
    { ...metadata, source: 'background_intelligence' }
  );
}

/**
 * Get full context: recent memories + Organization Brain (brand voice, ICP, positioning).
 * Use this to build enriched system prompts for AI calls.
 */
export async function getContext(
  options: {
    userId?: string;
    sessionId?: string;
    includeBrain?: boolean;
  } = {}
): Promise<MemoryContextResponse> {
  try {
    const body: Record<string, unknown> = {
      include_brain: options.includeBrain !== false, // default true
    };
    if (options.userId) body.user_id = options.userId;
    if (options.sessionId) body.session_id = options.sessionId;

    const response = await callMemoryApi('context', body);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('[Memory] Context error:', error);
    return {
      success: false,
      is_memory_enabled: false,
      memories: [],
    };
  }
}

/**
 * Log feedback on memory quality.
 */
export async function logFeedback(
  memoryId: string,
  wasHelpful: boolean,
  feedbackText?: string
): Promise<void> {
  try {
    await callMemoryApi('feedback', {
      memory_id: memoryId,
      action_type: wasHelpful ? 'helpful' : 'not_helpful',
      was_helpful: wasHelpful,
      feedback_text: feedbackText,
    });
  } catch (error) {
    console.error('[Memory] Feedback error:', error);
  }
}

/**
 * Check if memory layer is enabled and get settings.
 */
export async function getMemoryStatus(): Promise<{
  enabled: boolean;
  crossAgentSharing: boolean;
  settings: Record<string, unknown>;
}> {
  try {
    const response = await callMemoryApi('status', {});
    const data = await response.json();
    return {
      enabled: data.is_memory_enabled || false,
      crossAgentSharing: data.settings?.cross_agent_sharing || false,
      settings: data.settings || {},
    };
  } catch (error) {
    console.error('[Memory] Status error:', error);
    return { enabled: false, crossAgentSharing: false, settings: {} };
  }
}

/**
 * Format memories into a context string for injection into AI system prompts.
 */
export function formatMemoriesForPrompt(memories: MemorySearchResult[]): string {
  if (!memories.length) return '';

  const agentNames: Record<string, string> = {
    'bc000001-0001-0001-0001-000000000001': 'CI Agent',
    'bc000001-0001-0001-0001-000000000002': 'Events Scout',
    'bc000001-0001-0001-0001-000000000003': 'POV Agent',
    'bc000001-0001-0001-0001-000000000004': 'KPI Dashboard',
    'bc000001-0001-0001-0001-000000000005': 'Customer Readiness',
  };

  const lines = memories.map((m, i) => {
    const source = m.agent_template_id ? agentNames[m.agent_template_id] || 'Agent' : 'System';
    const relevance = Math.round(m.similarity * 100);
    return `[Memory ${i + 1} | ${source} | ${relevance}% relevant]: ${m.content}`;
  });

  return `## Cross-Agent Intelligence (${memories.length} relevant memories)\n${lines.join('\n')}`;
}

/**
 * Format brain context into a system prompt section.
 */
export function formatBrainForPrompt(ctx: MemoryContextResponse): string {
  if (!ctx.brain_context) return '';

  const parts: string[] = ['## Organization Context'];

  if (ctx.brain_context.brand_voice) {
    parts.push(`**Brand Voice**: ${ctx.brain_context.brand_voice}`);
  }
  if (ctx.brain_context.tone_attributes?.length) {
    parts.push(`**Tone**: ${ctx.brain_context.tone_attributes.join(', ')}`);
  }
  if (ctx.brain_context.primary_icp) {
    const icp = ctx.brain_context.primary_icp;
    parts.push(`**Target Persona**: ${icp.name}`);
    if (icp.pain_points?.length) {
      parts.push(`**Pain Points**: ${icp.pain_points.map(p => p.point).join('; ')}`);
    }
    if (icp.keywords?.length) {
      parts.push(`**Keywords**: ${icp.keywords.join(', ')}`);
    }
  }
  if (ctx.brain_context.writing_dos?.length) {
    parts.push(`**Writing Guidelines**: ${ctx.brain_context.writing_dos.join('; ')}`);
  }

  return parts.join('\n');
}

/**
 * Build a complete memory-enriched context for an AI system prompt.
 * Combines: brain context + cross-agent memories + agent-specific memories
 */
export async function buildEnrichedContext(
  query: string,
  options: {
    userId?: string;
    sessionId?: string;
    includeBrain?: boolean;
    crossAgentSearch?: boolean;
    agentSpecificSearch?: boolean;
    memoryLimit?: number;
  } = {}
): Promise<{
  contextString: string;
  memoriesUsed: number;
  memorySources: string[];
  searchTimeMs: number;
}> {
  const start = Date.now();
  const contextParts: string[] = [];
  let totalMemories = 0;
  const sourceSet = new Set<string>();

  // 1. Get Organization Brain context
  if (options.includeBrain !== false) {
    const ctx = await getContext({
      userId: options.userId,
      sessionId: options.sessionId,
      includeBrain: true,
    });
    const brainStr = formatBrainForPrompt(ctx);
    if (brainStr) contextParts.push(brainStr);
  }

  // 2. Cross-agent memory search (search ALL agents)
  if (options.crossAgentSearch !== false) {
    const { memories: crossMemories } = await searchMemories(query, {
      limit: options.memoryLimit || 8,
      threshold: 0.6,
      agentId: null, // null = cross-agent
    });
    if (crossMemories.length) {
      contextParts.push(formatMemoriesForPrompt(crossMemories));
      totalMemories += crossMemories.length;
      crossMemories.forEach(m => {
        if (m.agent_template_id) {
          const agentNames: Record<string, string> = {
            'bc000001-0001-0001-0001-000000000001': 'CI Agent',
            'bc000001-0001-0001-0001-000000000003': 'POV Agent',
            'bc000001-0001-0001-0001-000000000004': 'KPI Dashboard',
            'bc000001-0001-0001-0001-000000000005': 'Customer Readiness',
          };
          sourceSet.add(agentNames[m.agent_template_id] || 'Agent');
        }
      });
    }
  }

  return {
    contextString: contextParts.join('\n\n'),
    memoriesUsed: totalMemories,
    memorySources: Array.from(sourceSet),
    searchTimeMs: Date.now() - start,
  };
}
