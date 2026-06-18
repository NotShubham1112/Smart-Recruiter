import type { AgentReview, CandidateProfile, RoleProfile } from '@helix/types';
import type { AgentContext } from './technical-recruiter';

export async function runHiringManagerReview(context: AgentContext): Promise<AgentReview> {
  const { candidate, role } = context;
  const score = Math.round(
    (candidate.experience.filter((e) => e.title.toLowerCase().includes('lead') || e.title.toLowerCase().includes('senior')).length / Math.max(candidate.experience.length, 1)) * 100,
  );
  return {
    agentId: 'hiring-manager-1',
    agentType: 'hiring_manager',
    score,
    reasoning: `Hiring manager review complete. Score: ${score}/100.`,
    strengths: ['Relevant industry experience'],
    concerns: ['Career progression clarity'],
    questions: ['Describe a time you led a challenging project.'],
  };
}
