import type { RecruiterDebate } from './debate';
import type { SimulationResult, CounterfactualAnalysis } from './simulation';
import type { CandidateTwin } from './candidate';
import type { RoleDNA } from './role';

export interface Report {
  id: string;
  candidateId: string;
  roleId: string;
  helixScore: number;
  candidateTwin: CandidateTwin;
  roleDNA: RoleDNA;
  simulation: SimulationResult;
  debate: RecruiterDebate;
  counterfactuals?: CounterfactualAnalysis;
  summary: string;
  strengths: string[];
  risks: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface ReportSummary {
  id: string;
  candidateName: string;
  roleTitle: string;
  companyName: string;
  helixScore: number;
  trustScore: number;
  successProbability: number;
  generatedAt: string;
}
