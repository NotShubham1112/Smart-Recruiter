import type { MCPRequest, MCPResponse } from '@helix/types';
import { extractCandidateProfile, inferCapabilityDNA } from '@helix/ai';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_resume: handleParseResume,
  extract_skills: handleParseResume,
  extract_capabilities: handleExtractCapabilities,
  build_candidate_dna: handleBuildCandidateDNA,
  infer_learning_velocity: handleBuildCandidateDNA,
};

async function handleParseResume(params: Record<string, unknown>): Promise<unknown> {
  const resumeText = params.resumeText as string | undefined;
  if (!resumeText) {
    throw new Error('resumeText parameter is required');
  }
  return extractCandidateProfile(resumeText);
}

async function handleExtractCapabilities(params: Record<string, unknown>): Promise<unknown> {
  const profile = params.profile as Record<string, unknown> | undefined;
  if (!profile) {
    throw new Error('profile parameter is required');
  }
  const candidateId = (profile.id as string) || '';
  const dna = inferCapabilityDNA(profile as unknown as Parameters<typeof inferCapabilityDNA>[0]);
  return { ...dna, candidateId };
}

async function handleBuildCandidateDNA(params: Record<string, unknown>): Promise<unknown> {
  const resumeText = params.resumeText as string | undefined;
  if (!resumeText) {
    throw new Error('resumeText parameter is required');
  }
  const profile = extractCandidateProfile(resumeText);
  const dna = inferCapabilityDNA(profile);
  return {
    candidateId: profile.id,
    technicalDepth: dna.technicalDepth,
    learningVelocity: dna.learningVelocity,
    ownership: dna.ownership,
    adaptability: dna.adaptability,
    leadership: dna.leadership,
    communication: dna.communication,
    confidenceScore: 75,
  };
}

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
