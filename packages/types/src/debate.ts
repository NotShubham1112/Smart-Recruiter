export interface RecruiterDebate {
  debateId: string;
  candidateId: string;
  roleId: string;
  agents: AgentReview[];
  consensus: ConsensusResult;
  timestamp: string;
}

export interface AgentReview {
  agentId: string;
  agentType: AgentType;
  score: number;
  reasoning: string;
  strengths: string[];
  concerns: string[];
  questions: string[];
}

export type AgentType =
  | 'technical_recruiter'
  | 'hiring_manager'
  | 'growth_potential'
  | 'leadership'
  | 'risk_assessment'
  | 'trust_verification';

export interface ConsensusResult {
  finalScore: number;
  agreementLevel: number;
  summary: string;
  dissentingOpinions: DissentingOpinion[];
  recommendation: HiringRecommendation;
}

export type HiringRecommendation = 'strong_hire' | 'hire' | 'neutral' | 'no_hire' | 'strong_no_hire';

export interface DissentingOpinion {
  agentType: AgentType;
  reason: string;
  alternativeScore: number;
}
