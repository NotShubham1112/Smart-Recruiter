import type { MCPRequest, MCPResponse } from '@helix/types';

async function handleCTOReview(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { agentId: 'cto-1', agentType: 'technical_recruiter', score: 50, reasoning: 'Technical review stub', strengths: [], concerns: [], questions: [] };
}

async function handleDebate(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { debateId: '', candidateId: '', roleId: '', agents: [], consensus: { finalScore: 50, agreementLevel: 0.5, summary: '', dissentingOpinions: [], recommendation: 'neutral' } };
}

async function handleConsensus(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { finalScore: 50, agreementLevel: 0.5, summary: 'Consensus stub', dissentingOpinions: [], recommendation: 'neutral' };
}

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  run_cto_review: handleCTOReview,
  run_debate: handleDebate,
  generate_consensus: handleConsensus,
};

export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
