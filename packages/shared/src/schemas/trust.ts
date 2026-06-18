import { z } from 'zod';

export const FraudRiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const EvidenceCategorySchema = z.enum([
  'skill', 'experience', 'education', 'achievement', 'responsibility',
]);

export const EvidenceStatusSchema = z.enum([
  'verified', 'likely', 'unverifiable', 'contradicted',
]);

export const TrustScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  resumeConsistency: z.number().min(0).max(100),
  careerProgressionConsistency: z.number().min(0).max(100),
  evidenceDensity: z.number().min(0).max(100),
  technicalSpecificity: z.number().min(0).max(100),
  claimVerificationScore: z.number().min(0).max(100),
  fraudRisk: FraudRiskLevelSchema,
});
