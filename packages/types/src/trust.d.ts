export interface TrustScore {
    overall: number;
    resumeConsistency: number;
    careerProgressionConsistency: number;
    evidenceDensity: number;
    technicalSpecificity: number;
    claimVerificationScore: number;
    fraudRisk: FraudRiskLevel;
}
export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface EvidenceScore {
    totalClaims: number;
    verifiedClaims: number;
    unverifiableClaims: number;
    contradictedClaims: number;
    evidenceBreakdown: EvidenceItem[];
}
export interface EvidenceItem {
    claim: string;
    category: EvidenceCategory;
    status: EvidenceStatus;
    confidence: number;
    source?: string;
}
export type EvidenceCategory = 'skill' | 'experience' | 'education' | 'achievement' | 'responsibility';
export type EvidenceStatus = 'verified' | 'likely' | 'unverifiable' | 'contradicted';
export interface FraudDetectionResult {
    riskLevel: FraudRiskLevel;
    riskScore: number;
    flags: FraudFlag[];
    anomalies: Anomaly[];
}
export interface FraudFlag {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    evidence: string;
}
export interface Anomaly {
    field: string;
    expected: string;
    actual: string;
    severity: 'low' | 'medium' | 'high';
}
//# sourceMappingURL=trust.d.ts.map