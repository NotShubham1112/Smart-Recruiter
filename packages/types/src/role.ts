import type { SkillCategory } from './candidate';

export interface RoleProfile {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: RoleRequirement[];
  responsibilities: string[];
  preferredQualifications: string[];
  location?: string;
  remote: boolean;
  salaryRange?: SalaryRange;
  createdAt: string;
  updatedAt: string;
}

export interface RoleRequirement {
  skill: string;
  category: SkillCategory;
  required: boolean;
  minimumYears?: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface RoleDNA {
  roleId: string;
  technicalDepth: number;
  ownership: number;
  adaptability: number;
  communication: number;
  leadership: number;
  domainExpertise: Record<string, number>;
  requiredSkills: Record<string, number>;
  cultureWeight: Record<string, number>;
}

export interface CompanyContext {
  companyId: string;
  industry: string;
  size: CompanySize;
  stage: CompanyStage;
  cultureValues: string[];
  techStack: string[];
}

export type CompanySize = 'startup' | 'small' | 'mid' | 'large' | 'enterprise';
export type CompanyStage = 'seed' | 'series-a' | 'series-b' | 'series-c' | 'public' | 'nonprofit';
