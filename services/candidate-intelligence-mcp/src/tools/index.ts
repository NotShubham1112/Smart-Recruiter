import type { MCPRequest, MCPResponse } from '@helix/types';
import { handleParseResume } from './parse-resume.js';
import { handleBuildDNA } from './build-dna.js';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_resume: handleParseResume,
  extract_skills: handleParseResume,
  extract_capabilities: handleParseResume,
  build_candidate_dna: handleBuildDNA,
  infer_learning_velocity: handleBuildDNA,
};

export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return {
      id: request.id,
      result: null,
      error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` },
      metadata: { timestamp: new Date().toISOString(), durationMs: 0 },
    };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return {
      id: request.id,
      result,
      metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
    };
  } catch (error) {
    return {
      id: request.id,
      result: null,
      error: { code: 'TOOL_ERROR', message: (error as Error).message },
      metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
    };
  }
}
