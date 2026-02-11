// ============================================================================
// AI Chat with Memory - BlueConic Customer Readiness Agent
// Supabase: uatrwjclztoxlulvaltl
// Audience: Internal BlueConic sales team
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  addMemories,
  buildEnrichedContext,
} from '../_shared/memory-client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, session_id, user_id } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    console.log('[Readiness Chat] Processing:', message.substring(0, 80));
    const startTime = Date.now();

    // 1. Create/load chat session
    let sessionId = session_id;
    if (!sessionId) {
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({ user_identifier: user_id, title: message.substring(0, 100) })
        .select('id')
        .single();
      sessionId = newSession?.id;
    }

    // 2. Load conversation history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);
    const conversationHistory = history || [];

    // 3. MEMORY READ
    let memoryContext = { contextString: '', memoriesUsed: 0, memorySources: [] as string[], searchTimeMs: 0 };
    try {
      memoryContext = await buildEnrichedContext(message, {
        crossAgentSearch: true,
        includeBrain: true,
        memoryLimit: 10,
      });
      console.log(`[Readiness Chat] Memory: ${memoryContext.memoriesUsed} memories in ${memoryContext.searchTimeMs}ms`);
    } catch (e) {
      console.warn('[Readiness Chat] Memory read failed:', e);
    }

    // 4. Fetch assessment data
    const [assessmentsRes, playsRes, industriesRes, personasRes, benchmarksRes] = await Promise.all([
      supabase.from('assessments').select('company_name, industry_id, persona_id, data_readiness_score, activation_score, decisioning_score, experimentation_score, governance_score, growth_readiness_score, challenges, goals, created_at').order('created_at', { ascending: false }).limit(25),
      supabase.from('growth_plays').select('name, journey_stage, primary_success_metric, complexity, time_to_value'),
      supabase.from('industries').select('id, name, slug'),
      supabase.from('personas').select('id, name, slug'),
      supabase.from('benchmarks').select('industry_id, consent_rate_avg, declared_data_capture_avg, conversion_lift_min, conversion_lift_max'),
    ]);

    const assessments = assessmentsRes.data || [];
    const industries = industriesRes.data || [];
    const personas = personasRes.data || [];
    const plays = playsRes.data || [];
    const benchmarks = benchmarksRes.data || [];

    // Build industry/persona lookup maps
    const industryMap = Object.fromEntries(industries.map(i => [i.id, i.name]));
    const personaMap = Object.fromEntries(personas.map(p => [p.id, p.name]));

    // Calculate aggregate stats
    const totalAssessments = assessments.length;
    const avgReadiness = totalAssessments > 0
      ? Math.round(assessments.reduce((sum, a) => sum + (a.growth_readiness_score || 0), 0) / totalAssessments)
      : 0;

    // Industry breakdown
    const byIndustry: Record<string, { count: number; avgScore: number; scores: number[] }> = {};
    assessments.forEach(a => {
      const name = industryMap[a.industry_id] || 'Unknown';
      if (!byIndustry[name]) byIndustry[name] = { count: 0, avgScore: 0, scores: [] };
      byIndustry[name].count++;
      byIndustry[name].scores.push(a.growth_readiness_score || 0);
    });
    Object.values(byIndustry).forEach(v => {
      v.avgScore = Math.round(v.scores.reduce((s, n) => s + n, 0) / v.scores.length);
    });

    // Challenge frequency
    const challengeCount: Record<string, number> = {};
    assessments.forEach(a => {
      const challenges = Array.isArray(a.challenges) ? a.challenges : [];
      challenges.forEach((c: string) => { challengeCount[c] = (challengeCount[c] || 0) + 1; });
    });
    const topChallenges = Object.entries(challengeCount).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const liveData = `## Assessment Intelligence (${totalAssessments} assessments)

### Overview
- Total Assessments: ${totalAssessments}
- Average Readiness Score: ${avgReadiness}/100

### By Industry
${Object.entries(byIndustry).map(([name, v]) => `- **${name}**: ${v.count} assessments, avg score ${v.avgScore}/100`).join('\n')}

### Top Challenges (frequency)
${topChallenges.map(([c, n]) => `- ${c}: ${n} companies (${Math.round(n / totalAssessments * 100)}%)`).join('\n')}

### Recent Assessments (last 10)
${assessments.slice(0, 10).map(a => {
  const ind = industryMap[a.industry_id] || '?';
  const per = personaMap[a.persona_id] || '?';
  return `- **${a.company_name || 'Anonymous'}** (${ind}, ${per}) - Score: ${a.growth_readiness_score || 'N/A'}/100 | Data: ${a.data_readiness_score} | Activation: ${a.activation_score} | Decisioning: ${a.decisioning_score} | Governance: ${a.governance_score}`;
}).join('\n')}

### Available Growth Plays (${plays.length} total)
${plays.map(p => `- **${p.name}** (${p.journey_stage}) - ${p.complexity} complexity, ${p.time_to_value} time-to-value`).join('\n')}

### Industry Benchmarks
${benchmarks.map(b => `- ${industryMap[b.industry_id] || 'Unknown'}: Consent ${b.consent_rate_avg}%, Declared Data ${b.declared_data_capture_avg}%, Conversion Lift ${b.conversion_lift_min}-${b.conversion_lift_max}%`).join('\n')}`;

    // 5. Build system prompt
    const systemPrompt = `You are the BlueConic Customer Readiness Analyst - an expert at analyzing customer maturity assessments, identifying patterns across the prospect pipeline, and helping the sales team position BlueConic effectively.

You serve the INTERNAL BlueConic sales team. Your job is to help them understand prospect patterns, recommend positioning strategies, and identify opportunities.

${memoryContext.contextString}

${liveData}

## Your Capabilities:
- Analyze assessment patterns by industry, persona, and maturity dimension
- Identify trends in customer readiness (improving/declining segments)
- Recommend growth plays based on assessment data
- Cross-reference with competitive intelligence from the CI Agent
- Help sales reps prepare for calls with assessment-backed insights
- Spot opportunities (e.g., "3 Retail companies this month all scored low on Decisioning - run a targeted campaign")

## Guidelines:
- Always back claims with data (sample sizes, percentages, specific scores)
- Use specific growth play names from the catalog
- When competitive intel is available from other agents, connect it to readiness patterns
- Provide actionable sales recommendations, not just analysis
- Compare individual assessments to industry benchmarks when relevant
- Be analytical and precise - this is for internal use, not marketing`;

    // 6. Call OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    const aiData = await aiResponse.json();
    const responseContent = aiData.choices?.[0]?.message?.content || 'I could not generate a response.';

    // 7. Save messages
    if (sessionId) {
      await supabase.from('chat_messages').insert([
        { session_id: sessionId, role: 'user', content: message },
        { session_id: sessionId, role: 'assistant', content: responseContent },
      ]);
    }

    // 8. MEMORY WRITE
    addMemories(
      [{ role: 'user', content: message }, { role: 'assistant', content: responseContent }],
      { agent: 'customer-readiness', session_id: sessionId, source: 'chat' }
    ).then(r => console.log(`[Readiness Chat] Stored ${r.memories_added} memories`))
     .catch(e => console.warn('[Readiness Chat] Memory write failed:', e));

    // 9. Update session
    if (sessionId) {
      await supabase.from('chat_sessions')
        .update({ memory_count: memoryContext.memoriesUsed, updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    console.log(`[Readiness Chat] Complete in ${Date.now() - startTime}ms`);

    return new Response(
      JSON.stringify({
        response: responseContent,
        session_id: sessionId,
        memory_indicators: {
          memories_used: memoryContext.memoriesUsed,
          memories_stored: 0,
          memory_sources: memoryContext.memorySources,
          search_time_ms: memoryContext.searchTimeMs,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[Readiness Chat] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
