### Task 3: packages/shared — Zod Schemas and Utilities

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/schemas/candidate.ts`
- Create: `packages/shared/src/schemas/role.ts`
- Create: `packages/shared/src/schemas/trust.ts`
- Create: `packages/shared/src/schemas/simulation.ts`
- Create: `packages/shared/src/schemas/debate.ts`
- Create: `packages/shared/src/schemas/report.ts`
- Create: `packages/shared/src/utils/scoring.ts`
- Create: `packages/shared/src/constants.ts`
- Create: `packages/shared/README.md`

Create directories: `packages/shared/src/schemas/` and `packages/shared/src/utils/`

**package.json:**
```json
{
  "name": "@helix/shared",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "zod": "^3.24.0"
  }
}
```

**tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**src/schemas/candidate.ts:**
```ts
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
```

**src/schemas/role.ts:**
```ts
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
```

**src/schemas/trust.ts:**
```ts
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
```

**src/schemas/simulation.ts:**
```ts
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
```

**src/schemas/debate.ts:**
```ts
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
```

**src/schemas/report.ts:**
```ts
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
```

**src/utils/scoring.ts:**
```ts
export function calculateHelixScore(params: {
  successPrediction: number;
  capabilityMatch: number;
  trustScore: number;
  growthPotential: number;
  confidenceScore: number;
}): number {
  return (
    0.4 * params.successPrediction +
    0.25 * params.capabilityMatch +
    0.2 * params.trustScore +
    0.1 * params.growthPotential +
    0.05 * params.confidenceScore
  );
}

export function normalizeScore(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.round(((value - min) / (max - min)) * 100);
}

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function weightedAverage(values: { score: number; weight: number }[]): number {
  const totalWeight = values.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = values.reduce((sum, v) => sum + v.score * v.weight, 0);
  return clampScore(Math.round(weightedSum / totalWeight));
}
```

**src/constants.ts:**
```ts
export const HELIX_SCORE_WEIGHTS = {
  SUCCESS_PREDICTION: 0.4,
  CAPABILITY_MATCH: 0.25,
  TRUST_SCORE: 0.2,
  GROWTH_POTENTIAL: 0.1,
  CONFIDENCE_SCORE: 0.05,
} as const;

export const AGENT_TYPES = [
  'technical_recruiter',
  'hiring_manager',
  'growth_potential',
  'leadership',
  'risk_assessment',
  'trust_verification',
] as const;

export const DEBOUNCE_MS = 300;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
```

**src/index.ts:**
```ts
export { CandidateProfileSchema, WorkExperienceSchema, EducationSchema, SkillSchema, CertificationSchema, ProjectSchema, SkillCategorySchema } from './schemas/candidate';
export { RoleProfileSchema, RoleRequirementSchema, SalaryRangeSchema } from './schemas/role';
export { TrustScoreSchema, FraudRiskLevelSchema, EvidenceCategorySchema, EvidenceStatusSchema } from './schemas/trust';
export { SimulationResultSchema, SkillGapSchema, CounterfactualScenarioSchema } from './schemas/simulation';
export { AgentReviewSchema, AgentTypeSchema, HiringRecommendationSchema } from './schemas/debate';
export { ReportSummarySchema } from './schemas/report';
export { calculateHelixScore, normalizeScore, clampScore, weightedAverage } from './utils/scoring';
export { HELIX_SCORE_WEIGHTS, AGENT_TYPES, DEBOUNCE_MS, DEFAULT_PAGE_SIZE, MAX_FILE_SIZE_BYTES } from './constants';
```

**README.md:**
```md
# @helix/shared

Shared validation schemas, utilities, and constants for the Helix platform.

## Usage

```ts
import { CandidateProfileSchema, calculateHelixScore } from '@helix/shared';
```
```

**Commit:**
```bash
git add packages/shared/
git commit -m "feat(packages/shared): add Zod schemas, scoring utils, and constants"
```
