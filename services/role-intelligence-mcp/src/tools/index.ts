import type { MCPRequest, MCPResponse } from '@helix/types';

async function handleParseJobDesc(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { title: '', company: '', description: '', requirements: [], responsibilities: [] };
}

async function handleBuildRoleDNA(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { roleId: '', technicalDepth: 50, ownership: 50, adaptability: 50, communication: 50, leadership: 50, domainExpertise: {}, requiredSkills: {} };
}

async function handleExtractReq(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { required: [], preferred: [] };
}

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_job_description: handleParseJobDesc,
  build_role_dna: handleBuildRoleDNA,
  extract_requirements: handleExtractReq,
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
