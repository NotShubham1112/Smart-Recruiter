export interface SimulationResult {
    candidateId: string;
    roleId: string;
    companyId: string;
    successProbability: number;
    technicalFit: number;
    teamFit: number;
    growthPotential: number;
    retentionProbability: number;
    failureRisk: number;
    confidenceScore: number;
    breakdown: SimulationBreakdown;
}
export interface SimulationBreakdown {
    technicalAlignment: number;
    culturalAlignment: number;
    careerAlignment: number;
    skillGapAnalysis: SkillGap[];
    riskFactors: RiskFactor[];
}
export interface SkillGap {
    skill: string;
    required: number;
    actual: number;
    gap: number;
    impact: 'low' | 'medium' | 'high';
}
export interface RiskFactor {
    factor: string;
    probability: number;
    impact: number;
    mitigation?: string;
}
export interface CounterfactualAnalysis {
    candidateId: string;
    roleId: string;
    scenarios: CounterfactualScenario[];
    topImprovers: CounterfactualScenario[];
}
export interface CounterfactualScenario {
    change: string;
    currentScore: number;
    projectedScore: number;
    delta: number;
    confidence: number;
    description: string;
}
//# sourceMappingURL=simulation.d.ts.map