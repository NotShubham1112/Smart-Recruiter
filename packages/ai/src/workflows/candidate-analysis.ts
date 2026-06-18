import type { CandidateProfile, RoleProfile, AgentReview, ConsensusResult, HiringRecommendation } from '@helix/types';
import { runTechnicalRecruiterReview } from '../agents/technical-recruiter';
import { runHiringManagerReview } from '../agents/hiring-manager';

export interface AnalysisInput {
  candidate: CandidateProfile;
  role: RoleProfile;
}

export interface AnalysisOutput {
  reviews: AgentReview[];
  consensus: ConsensusResult;
  helixScore: number;
}

export async function runCandidateAnalysis(input: AnalysisInput): Promise<AnalysisOutput> {
  const context = { candidate: input.candidate, role: input.role };
  const [technicalReview, managerReview] = await Promise.all([
    runTechnicalRecruiterReview(context),
    runHiringManagerReview(context),
  ]);
  const reviews = [technicalReview, managerReview];
  const finalScore = Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length);
  return {
    reviews,
    consensus: {
      finalScore,
      agreementLevel: 0.8,
      summary: `Analysis complete. Final score: ${finalScore}/100.`,
      dissentingOpinions: [],
      recommendation: finalScore >= 70 ? 'hire' as HiringRecommendation : 'neutral' as HiringRecommendation,
    },
    helixScore: finalScore,
  };
}
