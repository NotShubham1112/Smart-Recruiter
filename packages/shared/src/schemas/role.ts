import { z } from 'zod';
import { SkillCategorySchema } from './candidate';

export const RoleRequirementSchema = z.object({
  skill: z.string().min(1),
  category: SkillCategorySchema,
  required: z.boolean(),
  minimumYears: z.number().min(0).optional(),
});

export const SalaryRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().length(3),
  period: z.enum(['yearly', 'monthly', 'hourly']),
});

export const RoleProfileSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  company: z.string().min(1),
  description: z.string(),
  requirements: z.array(RoleRequirementSchema),
  responsibilities: z.array(z.string()),
  preferredQualifications: z.array(z.string()),
  location: z.string().optional(),
  remote: z.boolean(),
  salaryRange: SalaryRangeSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
