import type { MCPRequest, MCPResponse } from '@helix/types';
import { extractRoleDNA, scoreCandidate } from '@helix/ai';
import { rankCandidates } from '@helix/shared';
import type { RoleDNA } from '@helix/ai';
import type { CandidateProfile } from '@helix/types';

async function handleParseJobDesc(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const jdText = (params.jdText ?? params.jd_text ?? '') as string;
  const dna = extractRoleDNA(jdText);
  return dna as unknown as Record<string, unknown>;
}

async function handleScoreCandidates(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const candidates = (params.candidates ?? []) as CandidateProfile[];
  const roleDna = params.roleDna as RoleDNA;
  const scores = candidates.map((c) => scoreCandidate(c, roleDna));
  return { scores };
}

async function handleBuildRoleDNA(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const jdText = (params.jdText ?? params.jd_text ?? '') as string;
  const candidates = (params.candidates ?? []) as CandidateProfile[];
  const dna = extractRoleDNA(jdText);
  const scores = candidates.map((c) => scoreCandidate(c, dna));
  const ranked = rankCandidates(scores);
  return { dna: dna as unknown as Record<string, unknown>, rankedScores: ranked } as unknown as Record<string, unknown>;
}

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_job_description: handleParseJobDesc,
  parse_jd: handleParseJobDesc,
  score_candidates: handleScoreCandidates,
  build_role_dna: handleBuildRoleDNA,
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
