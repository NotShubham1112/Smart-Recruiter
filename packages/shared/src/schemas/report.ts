import { z } from 'zod';

export const ReportSummarySchema = z.object({
  id: z.string(),
  candidateName: z.string(),
  roleTitle: z.string(),
  companyName: z.string(),
  helixScore: z.number(),
  trustScore: z.number(),
  successProbability: z.number(),
  generatedAt: z.string(),
});
