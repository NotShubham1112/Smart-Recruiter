import { z } from 'zod';

export const AgentTypeSchema = z.enum([
  'technical_recruiter',
  'hiring_manager',
  'growth_potential',
  'leadership',
  'risk_assessment',
  'trust_verification',
]);

export const AgentReviewSchema = z.object({
  agentId: z.string(),
  agentType: AgentTypeSchema,
  score: z.number().min(0).max(100),
  reasoning: z.string(),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  questions: z.array(z.string()),
});

export const HiringRecommendationSchema = z.enum([
  'strong_hire', 'hire', 'neutral', 'no_hire', 'strong_no_hire',
]);
