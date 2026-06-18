export interface CandidateScore {
  candidateId: string;
  name: string;
  helixScore: number;
  capabilityMatch: number;
  trustScore: number;
  successPrediction: number;
  growthPotential: number;
  confidenceScore: number;
  breakdown: {
    technicalFit: number;
    experienceFit: number;
    skillOverlap: number;
    seniorityFit: number;
  };
}

export function rankCandidates(scores: CandidateScore[]): CandidateScore[] {
  return [...scores].sort((a, b) => b.helixScore - a.helixScore);
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Strong Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Fair Match';
  return 'Poor Match';
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'green';
  if (score >= 75) return 'yellow';
  if (score >= 60) return 'orange';
  return 'red';
}
