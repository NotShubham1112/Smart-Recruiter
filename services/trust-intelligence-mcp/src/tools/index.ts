import type { MCPRequest, MCPResponse } from '@helix/types';
import { analyzeTrust } from '@helix/ai';
import type { CandidateProfile } from '@helix/types';

function isCandidateProfile(obj: unknown): obj is CandidateProfile {
  if (typeof obj !== 'object' || obj === null) return false;
  const p = obj as Record<string, unknown>;
  return typeof p.id === 'string' && Array.isArray(p.experience) && Array.isArray(p.education) && Array.isArray(p.skills);
}

async function handleVerifyClaims(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const profile = params.candidateProfile as CandidateProfile;
  if (!profile || !isCandidateProfile(profile)) {
    return { error: 'Invalid or missing candidateProfile' };
  }
  const report = analyzeTrust(profile);
  return {
    candidateId: report.candidateId,
    overallTrustScore: report.overallTrustScore,
    claimCount: report.claimCount,
    verifiedClaims: report.verifiedClaims,
    suspiciousClaims: report.suspiciousClaims,
    aiGeneratedProbability: report.aiGeneratedProbability,
    anomalyScore: report.anomalyScore,
    claims: report.claims,
    redFlags: report.redFlags,
  };
}

async function handleDetectAnomalies(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const profile = params.candidateProfile as CandidateProfile;
  if (!profile || !isCandidateProfile(profile)) {
    return { error: 'Invalid or missing candidateProfile' };
  }
  const report = analyzeTrust(profile);
  return {
    anomalyScore: report.anomalyScore,
    aiGeneratedProbability: report.aiGeneratedProbability,
    redFlags: report.redFlags,
  };
}

async function handleCalculateTrustScore(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const profile = params.candidateProfile as CandidateProfile;
  if (!profile || !isCandidateProfile(profile)) {
    return { error: 'Invalid or missing candidateProfile' };
  }
  const report = analyzeTrust(profile);
  return {
    candidateId: report.candidateId,
    trustScore: report.overallTrustScore,
    suspiciousClaims: report.suspiciousClaims,
    totalClaims: report.claimCount,
  };
}

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  calculate_trust_score: handleCalculateTrustScore,
  score_trust: handleCalculateTrustScore,
  verify_claims: handleVerifyClaims,
  detect_anomalies: handleDetectAnomalies,
  detect_resume_anomalies: handleDetectAnomalies,
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
