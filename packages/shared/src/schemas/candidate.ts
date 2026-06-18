import { z } from 'zod';

export const SkillCategorySchema = z.enum([
  'language', 'framework', 'database', 'cloud', 'tool', 'soft', 'domain',
]);

export const WorkExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  highlights: z.array(z.string()),
  technologies: z.array(z.string()),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.number().min(0).max(4).optional(),
});

export const SkillSchema = z.object({
  name: z.string().min(1),
  category: SkillCategorySchema,
  proficiency: z.number().min(0).max(100).optional(),
  yearsOfExperience: z.number().min(0).optional(),
});

export const CertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string(),
  url: z.string().url().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  url: z.string().url().optional(),
  technologies: z.array(z.string()),
  role: z.string().optional(),
  highlights: z.array(z.string()),
});

export const CandidateProfileSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(WorkExperienceSchema),
  education: z.array(EducationSchema),
  skills: z.array(SkillSchema),
  certifications: z.array(CertificationSchema),
  projects: z.array(ProjectSchema),
  githubUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  linkedInUrl: z.string().url().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
