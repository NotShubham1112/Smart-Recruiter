import { z } from 'zod';

export const SkillGapSchema = z.object({
  skill: z.string(),
  required: z.number(),
  actual: z.number(),
  gap: z.number(),
  impact: z.enum(['low', 'medium', 'high']),
});

export const SimulationResultSchema = z.object({
  candidateId: z.string(),
  roleId: z.string(),
  companyId: z.string(),
  successProbability: z.number().min(0).max(100),
  technicalFit: z.number().min(0).max(100),
  teamFit: z.number().min(0).max(100),
  growthPotential: z.number().min(0).max(100),
  retentionProbability: z.number().min(0).max(100),
  failureRisk: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
});

export const CounterfactualScenarioSchema = z.object({
  change: z.string(),
  currentScore: z.number(),
  projectedScore: z.number(),
  delta: z.number(),
  confidence: z.number(),
  description: z.string(),
});
