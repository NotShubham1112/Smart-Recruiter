import type { MCPRequest, MCPResponse } from '@helix/types';
import type { CandidateProfile, RoleDNA } from '@helix/types';
import { runDebate, runBatchDebate } from '@helix/ai';
import type { DebateRound } from '@helix/ai';

interface CounterfactualResult {
  scenario: string;
  agentAdjustments: Record<string, number>;
  outcome: string;
}

async function handleCTOReview(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const profile = params.candidateProfile as CandidateProfile;
  const roleDna = params.roleDna as RoleDNA;
  const result = runDebate(profile, roleDna);
  return {
    debateId: result.id,
    candidateId: result.candidateId,
    candidateName: result.candidateName,
    roleTitle: result.roleTitle,
    ctoArgument: result.arguments.find((a) => a.agent === 'CTO'),
    recommendation: result.recommendation,
    confidenceScore: result.confidenceScore,
    synthesis: result.synthesis,
  };
}

async function handleDebate(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const profile = params.candidateProfile as CandidateProfile;
  const roleDna = params.roleDna as RoleDNA;
  const result = runDebate(profile, roleDna);
  return {
    debateId: result.id,
    candidateId: result.candidateId,
    candidateName: result.candidateName,
    roleTitle: result.roleTitle,
    arguments: result.arguments,
    recommendation: result.recommendation,
    confidenceScore: result.confidenceScore,
    synthesis: result.synthesis,
  };
}

async function handleBatchDebate(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const profiles = params.candidateProfiles as CandidateProfile[];
  const roleDna = params.roleDna as RoleDNA;
  const results = runBatchDebate(profiles, roleDna);
  return {
    debates: results,
    totalCandidates: results.length,
  };
}

async function handleConsensus(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { finalScore: 50, agreementLevel: 0.5, summary: 'Consensus stub', dissentingOpinions: [], recommendation: 'neutral' };
}

function generateCounterfactuals(debate: DebateRound): CounterfactualResult[] {
  const name = debate.candidateName;
  return [
    {
      scenario: `${name} had 2 more years of leadership experience`,
      agentAdjustments: { CTO: 10, Trust: 5, Growth: 15 },
      outcome: 'Would shift from consider to hire',
    },
    {
      scenario: `${name} had modern framework experience`,
      agentAdjustments: { CTO: 20, Trust: 0, Growth: 10 },
      outcome: 'Would be strong_hire recommendation',
    },
    {
      scenario: `${name}'s claims were fully verified`,
      agentAdjustments: { CTO: 0, Trust: 20, Growth: 5 },
      outcome: 'Trust concern eliminated',
    },
  ];
}

async function handleCounterfactuals(params: Record<string, unknown>): Promise<Record<string, unknown>> {
  const debate = params.debateRound as unknown as DebateRound;
  const scenarios = generateCounterfactuals(debate);
  return {
    scenarios,
    totalScenarios: scenarios.length,
  };
}

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  run_cto_review: handleCTOReview,
  debate_candidate: handleDebate,
  run_debate: handleDebate,
  batch_debate: handleBatchDebate,
  generate_consensus: handleConsensus,
  generate_counterfactuals: handleCounterfactuals,
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
