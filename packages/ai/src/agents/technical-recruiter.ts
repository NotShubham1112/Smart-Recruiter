import type { AgentReview, CandidateProfile, RoleProfile } from '@helix/types';

export interface AgentContext {
  candidate: CandidateProfile;
  role: RoleProfile;
  companyContext?: Record<string, unknown>;
}

export async function runTechnicalRecruiterReview(context: AgentContext): Promise<AgentReview> {
  const { candidate, role } = context;
  const score = calculateTechnicalScore(candidate, role);
  return {
    agentId: 'technical-recruiter-1',
    agentType: 'technical_recruiter',
    score,
    reasoning: generateReasoning(score, candidate, role),
    strengths: identifyStrengths(candidate, role),
    concerns: identifyConcerns(candidate, role),
    questions: ['How do you stay current with industry trends?'],
  };
}

function calculateTechnicalScore(candidate: CandidateProfile, role: RoleProfile): number {
  const requiredSkills = role.requirements.filter((r) => r.required).map((r) => r.skill);
  const candidateSkills = candidate.skills.map((s) => s.name);
  const matchingSkills = requiredSkills.filter((s) => candidateSkills.includes(s));
  return Math.round((matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100);
}

function generateReasoning(score: number, candidate: CandidateProfile, role: RoleProfile): string {
  return `Technical assessment complete. Score: ${score}/100. Candidate has ${candidate.experience.length} years of relevant experience.`;
}

function identifyStrengths(candidate: CandidateProfile, role: RoleProfile): string[] {
  return candidate.skills
    .filter((s) => role.requirements.some((r) => r.skill === s.name))
    .map((s) => `Strong ${s.name} proficiency`);
}

function identifyConcerns(candidate: CandidateProfile, role: RoleProfile): string[] {
  const requiredSkills = role.requirements.filter((r) => r.required).map((r) => r.skill);
  const candidateSkills = candidate.skills.map((s) => s.name);
  return requiredSkills
    .filter((s) => !candidateSkills.includes(s))
    .map((s) => `Missing required skill: ${s}`);
}
