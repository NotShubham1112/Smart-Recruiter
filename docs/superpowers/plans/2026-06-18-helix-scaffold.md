# Helix Platform Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a complete production-grade monorepo for Helix, an AI-native recruitment intelligence platform.

**Architecture:** pnpm monorepo with Turborepo. Thin Fastify API dispatches to BullMQ queue → Orchestration Engine (LangGraph) → MCP Services → Databases. All AI work isolated from API routes.

**Tech Stack:** Next.js 16, React 19, Fastify, BullMQ, LangGraph, Groq, PostgreSQL, Neo4j, Qdrant, Redis, Docker, K8s, Terraform

## Global Constraints

- Strict TypeScript with `strict: true`, no `any` types
- ESM modules throughout (`"type": "module"` in package.json)
- Every workspace gets its own `package.json` and `tsconfig.json`
- Barrel files (`index.ts`) for every module
- `README.md` in every package
- `.env.example` for every deployable service
- No AI LLM calls in API controllers — orchestration engine handles all AI work
- ~80-100 files with realistic stubs and implementations

---

### Task 1: Root Monorepo Configuration

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.eslintrc.cjs`
- Create: `.prettierrc`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "helix",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "clean": "turbo clean",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  },
  "devDependencies": {
    "turbo": "^2.4.0",
    "prettier": "^3.4.0",
    "eslint": "^9.18.0",
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0"
  },
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.15.0"
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "src/**"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "src/**", "tests/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 4: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2024"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@helix/types": ["./packages/types/src"],
      "@helix/shared": ["./packages/shared/src"],
      "@helix/ui": ["./packages/ui/src"],
      "@helix/ai": ["./packages/ai/src"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5: Create .eslintrc.cjs**

```js
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
  ignorePatterns: ['dist', 'node_modules', '.turbo'],
};
```

- [ ] **Step 6: Create .prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

- [ ] **Step 7: Create .gitignore**

```
node_modules/
dist/
.turbo/
.next/
*.log
.env
.env.local
.env.*.local
coverage/
```

- [ ] **Step 8: Create .env.example**

```bash
# Database
DATABASE_URL=postgresql://helix:helix@localhost:5432/helix
REDIS_URL=redis://localhost:6379
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=helix
QDRANT_URL=http://localhost:6333

# Auth
JWT_SECRET=change-me-in-production
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=

# AI
GROQ_API_KEY=
QDRANT_API_KEY=

# Queue
BULLMQ_CONCURRENCY=5
```

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .eslintrc.cjs .prettierrc .gitignore .env.example
git commit -m "chore: initialize monorepo root with pnpm, turbo, tsconfig, linting"
```

---

### Task 2: packages/types — TypeScript Interfaces

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/tsconfig.json`
- Create: `packages/types/src/index.ts`
- Create: `packages/types/src/candidate.ts`
- Create: `packages/types/src/role.ts`
- Create: `packages/types/src/company.ts`
- Create: `packages/types/src/trust.ts`
- Create: `packages/types/src/simulation.ts`
- Create: `packages/types/src/graph.ts`
- Create: `packages/types/src/debate.ts`
- Create: `packages/types/src/mcp.ts`
- Create: `packages/types/src/report.ts`
- Create: `packages/types/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/types",
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
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

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

- [ ] **Step 3: Create packages/types/src/candidate.ts**

```ts
export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  githubUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency?: number;
  yearsOfExperience?: number;
}

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'tool'
  | 'soft'
  | 'domain';

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  role?: string;
  highlights: string[];
}

export interface CandidateDNA {
  candidateId: string;
  technicalDepth: number;
  ownership: number;
  learningVelocity: number;
  adaptability: number;
  communication: number;
  leadership: number;
  domainExpertise: Record<string, number>;
  skillProficiencies: Record<string, number>;
  confidenceScore: number;
}

export interface CandidateTwin {
  candidateId: string;
  capabilityDNA: CandidateDNA;
  trustDNA: TrustScore;
  behavioralDNA: Record<string, number>;
  growthDNA: GrowthProfile;
  graphProfile: CareerGraphNode;
  confidenceScore: number;
}

export interface GrowthProfile {
  growthVelocity: number;
  careerTrajectory: CareerStage[];
  predictedNextRole?: string;
  learningRate: number;
  adaptabilityScore: number;
}

export interface CareerStage {
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  level: string;
  skillsGained: string[];
}
```

- [ ] **Step 4: Create packages/types/src/role.ts**

```ts
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
```

- [ ] **Step 5: Create packages/types/src/company.ts**

```ts
export interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  stage: string;
  location: string;
  cultureValues: string[];
  techStack: string[];
  website?: string;
  linkedInUrl?: string;
  glassdoorRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDNA {
  companyId: string;
  innovationIndex: number;
  stabilityIndex: number;
  growthIndex: number;
  cultureProfile: Record<string, number>;
  technicalSophistication: number;
  managementStyle: Record<string, number>;
}
```

- [ ] **Step 6: Create packages/types/src/trust.ts**

```ts
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
```

- [ ] **Step 7: Create packages/types/src/simulation.ts**

```ts
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
```

- [ ] **Step 8: Create packages/types/src/graph.ts**

```ts
export interface CareerGraph {
  nodes: CareerGraphNode[];
  edges: CareerGraphEdge[];
  metadata: GraphMetadata;
}

export interface CareerGraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, unknown>;
}

export type NodeType =
  | 'candidate'
  | 'company'
  | 'role'
  | 'skill'
  | 'project'
  | 'technology'
  | 'achievement'
  | 'education'
  | 'industry';

export interface CareerGraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  properties: Record<string, unknown>;
  weight: number;
}

export type EdgeType =
  | 'worked_at'
  | 'built'
  | 'led'
  | 'contributed_to'
  | 'promoted_to'
  | 'collaborated_with'
  | 'uses'
  | 'achieved'
  | 'studied_at';

export interface GraphMetadata {
  nodeCount: number;
  edgeCount: number;
  density: number;
  centralNodes: string[];
}
```

- [ ] **Step 9: Create packages/types/src/debate.ts**

```ts
export interface RecruiterDebate {
  debateId: string;
  candidateId: string;
  roleId: string;
  agents: AgentReview[];
  consensus: ConsensusResult;
  timestamp: string;
}

export interface AgentReview {
  agentId: string;
  agentType: AgentType;
  score: number;
  reasoning: string;
  strengths: string[];
  concerns: string[];
  questions: string[];
}

export type AgentType =
  | 'technical_recruiter'
  | 'hiring_manager'
  | 'growth_potential'
  | 'leadership'
  | 'risk_assessment'
  | 'trust_verification';

export interface ConsensusResult {
  finalScore: number;
  agreementLevel: number;
  summary: string;
  dissentingOpinions: DissentingOpinion[];
  recommendation: HiringRecommendation;
}

export type HiringRecommendation = 'strong_hire' | 'hire' | 'neutral' | 'no_hire' | 'strong_no_hire';

export interface DissentingOpinion {
  agentType: AgentType;
  reason: string;
  alternativeScore: number;
}
```

- [ ] **Step 10: Create packages/types/src/mcp.ts**

```ts
export interface MCPRequest {
  id: string;
  tool: string;
  params: Record<string, unknown>;
  metadata?: RequestMetadata;
}

export interface MCPResponse {
  id: string;
  result: unknown;
  error?: MCPError;
  metadata: ResponseMetadata;
}

export interface MCPError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface RequestMetadata {
  timestamp: string;
  source: string;
  correlationId?: string;
}

export interface ResponseMetadata {
  timestamp: string;
  durationMs: number;
  model?: string;
  tokensUsed?: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}
```

- [ ] **Step 11: Create packages/types/src/report.ts**

```ts
import type { RecruiterDebate } from './debate';
import type { SimulationResult, CounterfactualAnalysis } from './simulation';
import type { CandidateTwin } from './candidate';
import type { RoleDNA } from './role';

export interface Report {
  id: string;
  candidateId: string;
  roleId: string;
  helixScore: number;
  candidateTwin: CandidateTwin;
  roleDNA: RoleDNA;
  simulation: SimulationResult;
  debate: RecruiterDebate;
  counterfactuals?: CounterfactualAnalysis;
  summary: string;
  strengths: string[];
  risks: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface ReportSummary {
  id: string;
  candidateName: string;
  roleTitle: string;
  companyName: string;
  helixScore: number;
  trustScore: number;
  successProbability: number;
  generatedAt: string;
}
```

- [ ] **Step 12: Create packages/types/src/index.ts**

```ts
export type {
  CandidateProfile,
  WorkExperience,
  Education,
  Skill,
  SkillCategory,
  Certification,
  Project,
  CandidateDNA,
  CandidateTwin,
  GrowthProfile,
  CareerStage,
} from './candidate';

export type {
  RoleProfile,
  RoleRequirement,
  SalaryRange,
  RoleDNA,
  CompanyContext,
  CompanySize,
  CompanyStage,
} from './role';

export type {
  CompanyProfile,
  CompanyDNA,
} from './company';

export type {
  TrustScore,
  FraudRiskLevel,
  EvidenceScore,
  EvidenceItem,
  EvidenceCategory,
  EvidenceStatus,
  FraudDetectionResult,
  FraudFlag,
  Anomaly,
} from './trust';

export type {
  SimulationResult,
  SimulationBreakdown,
  SkillGap,
  RiskFactor,
  CounterfactualAnalysis,
  CounterfactualScenario,
} from './simulation';

export type {
  CareerGraph,
  CareerGraphNode,
  CareerGraphEdge,
  NodeType,
  EdgeType,
  GraphMetadata,
} from './graph';

export type {
  RecruiterDebate,
  AgentReview,
  AgentType,
  ConsensusResult,
  HiringRecommendation,
  DissentingOpinion,
} from './debate';

export type {
  MCPRequest,
  MCPResponse,
  MCPError,
  RequestMetadata,
  ResponseMetadata,
  ToolDefinition,
} from './mcp';

export type {
  Report,
  ReportSummary,
} from './report';
```

- [ ] **Step 13: Create README.md**

```md
# @helix/types

Shared TypeScript type definitions for the Helix platform.

## Usage

```ts
import type { CandidateProfile, RoleDNA } from '@helix/types';
```

## Contents

- Candidate types (profile, DNA, twin)
- Role types (profile, DNA, requirements)
- Company types (profile, DNA)
- Trust/evidence types
- Simulation types
- Career graph types
- Debate/agent types
- MCP protocol types
- Report types
```

- [ ] **Step 14: Commit**

```bash
git add packages/types/
git commit -m "feat(packages/types): add shared TypeScript interfaces"
```

---

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
- Create: `packages/shared/src/utils/index.ts`
- Create: `packages/shared/src/utils/scoring.ts`
- Create: `packages/shared/src/constants.ts`
- Create: `packages/shared/README.md`

- [ ] **Step 1: Create package.json**

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

- [ ] **Step 2: Create tsconfig.json**

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

- [ ] **Step 3: Create packages/shared/src/schemas/candidate.ts**

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

- [ ] **Step 4: Create packages/shared/src/schemas/role.ts**

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

- [ ] **Step 5: Create packages/shared/src/schemas/trust.ts**

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

- [ ] **Step 6: Create packages/shared/src/schemas/simulation.ts**

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

- [ ] **Step 7: Create packages/shared/src/schemas/debate.ts**

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

- [ ] **Step 8: Create packages/shared/src/schemas/report.ts**

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

- [ ] **Step 9: Create packages/shared/src/utils/scoring.ts**

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

- [ ] **Step 10: Create packages/shared/src/constants.ts**

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
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
```

- [ ] **Step 11: Create packages/shared/src/index.ts**

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

- [ ] **Step 12: Create README.md**

```md
# @helix/shared

Shared validation schemas, utilities, and constants for the Helix platform.

## Usage

```ts
import { CandidateProfileSchema, calculateHelixScore } from '@helix/shared';
```
```

- [ ] **Step 13: Commit**

```bash
git add packages/shared/
git commit -m "feat(packages/shared): add Zod schemas, scoring utils, and constants"
```

---

### Task 4: packages/ui — Shared UI Components

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/button.tsx`
- Create: `packages/ui/src/card.tsx`
- Create: `packages/ui/src/badge.tsx`
- Create: `packages/ui/src/input.tsx`
- Create: `packages/ui/src/label.tsx`
- Create: `packages/ui/src/select.tsx`
- Create: `packages/ui/src/table.tsx`
- Create: `packages/ui/src/textarea.tsx`
- Create: `packages/ui/src/avatar.tsx`
- Create: `packages/ui/src/skeleton.tsx`
- Create: `packages/ui/src/progress.tsx`
- Create: `packages/ui/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/ui",
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
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "lib": ["ES2024", "DOM", "DOM.Iterable"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3 through Step 14: Create shadcn/ui component stubs**

Create `packages/ui/src/button.tsx`:

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

Create `packages/ui/src/card.tsx`:

```tsx
import * as React from 'react';
import { cn } from './utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

Create `packages/ui/src/badge.tsx`:

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        warning: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

Create `packages/ui/src/input.tsx`:

```tsx
import * as React from 'react';
import { cn } from './utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
```

Create `packages/ui/src/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Create remaining component stubs similarly (label, select, table, textarea, avatar, skeleton, progress).

- [ ] **Step 15: Create packages/ui/src/index.ts**

```ts
export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';
export { Input } from './input';
export { cn } from './utils';
```

- [ ] **Step 16: Commit**

```bash
git add packages/ui/
git commit -m "feat(packages/ui): add shadcn/ui base component stubs"
```

---

### Task 5: packages/ai — AI SDK, Prompts, and Workflows

**Files:**
- Create: `packages/ai/package.json`
- Create: `packages/ai/tsconfig.json`
- Create: `packages/ai/src/index.ts`
- Create: `packages/ai/src/providers/groq.ts`
- Create: `packages/ai/src/registry/model-router.ts`
- Create: `packages/ai/src/agents/technical-recruiter.ts`
- Create: `packages/ai/src/agents/hiring-manager.ts`
- Create: `packages/ai/src/workflows/candidate-analysis.ts`
- Create: `packages/ai/src/prompts/candidate-extraction.ts`
- Create: `packages/ai/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/ai",
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
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "zod": "^3.24.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

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

- [ ] **Step 3: Create providers/groq.ts**

```ts
import type { MCPResponse } from '@helix/types';

export interface GroqConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface CompletionParams {
  model: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export class GroqClient {
  private config: GroqConfig;

  constructor(config: GroqConfig) {
    this.config = {
      baseUrl: 'https://api.groq.com/openai/v1',
      defaultModel: 'qwen-3-32b',
      ...config,
    };
  }

  async complete(params: CompletionParams): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { choices: { message: { content: string } }[] };
    return data.choices[0]?.message?.content ?? '';
  }

  async completeWithMetadata(params: CompletionParams): Promise<MCPResponse> {
    const startTime = Date.now();
    const content = await this.complete(params);
    return {
      id: crypto.randomUUID(),
      result: content,
      metadata: {
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        model: params.model,
      },
    };
  }
}
```

- [ ] **Step 4: Create registry/model-router.ts**

```ts
export const MODEL_ROUTES = {
  CANDIDATE_EXTRACTION: 'qwen-3-32b',
  ROLE_EXTRACTION: 'qwen-3-32b',
  TRUST_INTELLIGENCE: 'qwen-3-32b',
  SKILL_INFERENCE: 'qwen-3-32b',
  DEBATE_REASONING: 'gpt-oss-120b',
  SUCCESS_SIMULATION: 'gpt-oss-120b',
  COUNTERFACTUAL_ANALYSIS: 'gpt-oss-120b',
  EXPLANATION_GENERATION: 'gpt-oss-120b',
} as const;

export type ModelTask = keyof typeof MODEL_ROUTES;

export function resolveModel(task: ModelTask): string {
  return MODEL_ROUTES[task];
}

export const MODEL_CAPABILITIES: Record<string, string[]> = {
  'qwen-3-32b': ['extraction', 'classification', 'scoring', 'analysis'],
  'gpt-oss-120b': ['reasoning', 'debate', 'simulation', 'generation', 'explanation'],
};
```

- [ ] **Step 5: Create agents/technical-recruiter.ts**

```ts
import type { AgentReview, CandidateProfile, RoleProfile } from '@helix/types';

export interface AgentContext {
  candidate: CandidateProfile;
  role: RoleProfile;
  companyContext?: Record<string, unknown>;
}

export async function runTechnicalRecruiterReview(context: AgentContext): Promise<AgentReview> {
  const { candidate, role } = context;
  const score = calculateTechnicalScore(candidate, role);
  return {
    agentId: 'technical-recruiter-1',
    agentType: 'technical_recruiter',
    score,
    reasoning: generateReasoning(score, candidate, role),
    strengths: identifyStrengths(candidate, role),
    concerns: identifyConcerns(candidate, role),
    questions: ['How do you stay current with industry trends?'],
  };
}

function calculateTechnicalScore(candidate: CandidateProfile, role: RoleProfile): number {
  const requiredSkills = role.requirements.filter((r) => r.required).map((r) => r.skill);
  const candidateSkills = candidate.skills.map((s) => s.name);
  const matchingSkills = requiredSkills.filter((s) => candidateSkills.includes(s));
  return Math.round((matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100);
}

function generateReasoning(score: number, candidate: CandidateProfile, role: RoleProfile): string {
  return `Technical assessment complete. Score: ${score}/100. Candidate has ${candidate.experience.length} years of relevant experience.`;
}

function identifyStrengths(candidate: CandidateProfile, role: RoleProfile): string[] {
  return candidate.skills
    .filter((s) => role.requirements.some((r) => r.skill === s.name))
    .map((s) => `Strong ${s.name} proficiency`);
}

function identifyConcerns(candidate: CandidateProfile, role: RoleProfile): string[] {
  const requiredSkills = role.requirements.filter((r) => r.required).map((r) => r.skill);
  const candidateSkills = candidate.skills.map((s) => s.name);
  return requiredSkills
    .filter((s) => !candidateSkills.includes(s))
    .map((s) => `Missing required skill: ${s}`);
}
```

- [ ] **Step 6: Create agents/hiring-manager.ts**

```ts
import type { AgentReview, CandidateProfile, RoleProfile } from '@helix/types';
import type { AgentContext } from './technical-recruiter';

export async function runHiringManagerReview(context: AgentContext): Promise<AgentReview> {
  const { candidate, role } = context;
  const score = Math.round(
    (candidate.experience.filter((e) => e.title.toLowerCase().includes('lead') || e.title.toLowerCase().includes('senior')).length / Math.max(candidate.experience.length, 1)) * 100,
  );
  return {
    agentId: 'hiring-manager-1',
    agentType: 'hiring_manager',
    score,
    reasoning: `Hiring manager review complete. Score: ${score}/100.`,
    strengths: ['Relevant industry experience'],
    concerns: ['Career progression clarity'],
    questions: ['Describe a time you led a challenging project.'],
  };
}
```

- [ ] **Step 7: Create workflows/candidate-analysis.ts**

```ts
import type { CandidateProfile, RoleProfile, AgentReview, ConsensusResult, HiringRecommendation } from '@helix/types';
import { runTechnicalRecruiterReview } from '../agents/technical-recruiter';
import { runHiringManagerReview } from '../agents/hiring-manager';

export interface AnalysisInput {
  candidate: CandidateProfile;
  role: RoleProfile;
}

export interface AnalysisOutput {
  reviews: AgentReview[];
  consensus: ConsensusResult;
  helixScore: number;
}

export async function runCandidateAnalysis(input: AnalysisInput): Promise<AnalysisOutput> {
  const context = { candidate: input.candidate, role: input.role };
  const [technicalReview, managerReview] = await Promise.all([
    runTechnicalRecruiterReview(context),
    runHiringManagerReview(context),
  ]);
  const reviews = [technicalReview, managerReview];
  const finalScore = Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length);
  return {
    reviews,
    consensus: {
      finalScore,
      agreementLevel: 0.8,
      summary: `Analysis complete. Final score: ${finalScore}/100.`,
      dissentingOpinions: [],
      recommendation: finalScore >= 70 ? 'hire' as HiringRecommendation : 'neutral' as HiringRecommendation,
    },
    helixScore: finalScore,
  };
}
```

- [ ] **Step 8: Create prompts/candidate-extraction.ts**

```ts
export const CANDIDATE_EXTRACTION_SYSTEM_PROMPT = `You are a candidate intelligence analyst. Extract structured information from resumes and professional profiles. Focus on verifiable facts and concrete achievements.`;

export const CANDIDATE_EXTRACTION_USER_PROMPT = (resumeText: string): string =>
  `Extract the following from this resume:\n1. Full name and contact information\n2. Work experience (company, title, dates, responsibilities)\n3. Education (institution, degree, field, dates)\n4. Skills with proficiency indicators\n5. Projects and achievements\n\nResume:\n${resumeText}`;

export const TRUST_ANALYSIS_SYSTEM_PROMPT = `You are a trust and verification analyst. Evaluate candidate claims for consistency, specificity, and verifiability. Flag potential exaggerations or inconsistencies.`;

export const ROLE_ANALYSIS_SYSTEM_PROMPT = `You are a role analyst. Extract structured role requirements from job descriptions. Identify both explicit and implicit requirements.`;
```

- [ ] **Step 9: Create packages/ai/src/index.ts**

```ts
export { GroqClient } from './providers/groq';
export type { GroqConfig, CompletionParams } from './providers/groq';
export { MODEL_ROUTES, resolveModel, MODEL_CAPABILITIES } from './registry/model-router';
export type { ModelTask } from './registry/model-router';
export { runTechnicalRecruiterReview } from './agents/technical-recruiter';
export { runHiringManagerReview } from './agents/hiring-manager';
export { runCandidateAnalysis } from './workflows/candidate-analysis';
export type { AnalysisInput, AnalysisOutput } from './workflows/candidate-analysis';
export { CANDIDATE_EXTRACTION_SYSTEM_PROMPT, CANDIDATE_EXTRACTION_USER_PROMPT, TRUST_ANALYSIS_SYSTEM_PROMPT, ROLE_ANALYSIS_SYSTEM_PROMPT } from './prompts/candidate-extraction';
```

- [ ] **Step 10: Commit**

```bash
git add packages/ai/
git commit -m "feat(packages/ai): add AI SDK, model router, agent stubs, and prompts"
```

---

### Task 6: apps/api — Fastify Server

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/plugins/auth.ts`
- Create: `apps/api/src/plugins/cors.ts`
- Create: `apps/api/src/modules/health/health.routes.ts`
- Create: `apps/api/src/modules/candidate/candidate.routes.ts`
- Create: `apps/api/src/modules/role/role.routes.ts`
- Create: `apps/api/src/queues/analysis.queue.ts`
- Create: `apps/api/src/workers/analysis.worker.ts`
- Create: `apps/api/src/lib/logger.ts`
- Create: `apps/api/.env.example`
- Create: `apps/api/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "fastify": "^5.2.0",
    "@fastify/cors": "^10.0.0",
    "@fastify/jwt": "^9.0.0",
    "@fastify/helmet": "^13.0.0",
    "@fastify/websocket": "^11.0.0",
    "bullmq": "^5.40.0",
    "ioredis": "^5.4.0",
    "pino": "^9.6.0",
    "pino-pretty": "^13.0.0",
    "zod": "^3.24.0",
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/exporter-trace-otlp-proto": "^0.57.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2024"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create src/index.ts**

```ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { healthRoutes } from './modules/health/health.routes.js';
import { candidateRoutes } from './modules/candidate/candidate.routes.js';
import { roleRoutes } from './modules/role/role.routes.js';
import { logger } from './lib/logger.js';

const app = Fastify({
  logger: false,
});

await app.register(cors, { origin: true });
await app.register(helmet);
await app.register(healthRoutes, { prefix: '/api/health' });
await app.register(candidateRoutes, { prefix: '/api/candidates' });
await app.register(roleRoutes, { prefix: '/api/roles' });

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    logger.info('API server running on port 4000');
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
};

start();
```

- [ ] **Step 4: Create src/plugins/auth.ts**

```ts
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export async function authPlugin(app: FastifyInstance): Promise<void> {
  await app.register(jwt, { secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production' });
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}

export default fp(authPlugin);
```

- [ ] **Step 5: Create src/modules/health/health.routes.ts**

```ts
import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  });

  app.get('/ready', async () => {
    return { status: 'ready', timestamp: new Date().toISOString() };
  });
}
```

- [ ] **Step 6: Create src/modules/candidate/candidate.routes.ts**

```ts
import type { FastifyInstance } from 'fastify';

export async function candidateRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { candidates: [], total: 0, page: 1 };
  });

  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return { id: request.params.id, message: 'Candidate detail endpoint' };
  });

  app.post('/', async (request) => {
    return { id: 'new-candidate-id', message: 'Candidate created' };
  });
}
```

- [ ] **Step 7: Create src/modules/role/role.routes.ts**

```ts
import type { FastifyInstance } from 'fastify';

export async function roleRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { roles: [], total: 0, page: 1 };
  });

  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return { id: request.params.id, message: 'Role detail endpoint' };
  });

  app.post('/', async (request) => {
    return { id: 'new-role-id', message: 'Role created' };
  });
}
```

- [ ] **Step 8: Create src/queues/analysis.queue.ts**

```ts
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
});

export const analysisQueue = new Queue('candidate-analysis', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600, count: 100 },
  },
});

export async function enqueueAnalysis(candidateId: string, roleId: string): Promise<string> {
  const job = await analysisQueue.add('analyze', { candidateId, roleId });
  return job.id ?? '';
}
```

- [ ] **Step 9: Create src/workers/analysis.worker.ts**

```ts
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../lib/logger.js';

const connection = new IORedis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
});

export const analysisWorker = new Worker(
  'candidate-analysis',
  async (job) => {
    const { candidateId, roleId } = job.data;
    logger.info({ candidateId, roleId }, 'Processing analysis job');
    return { status: 'completed', candidateId, roleId };
  },
  { connection, concurrency: 5 },
);

analysisWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Analysis job completed');
});

analysisWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, 'Analysis job failed');
});
```

- [ ] **Step 10: Create src/lib/logger.ts**

```ts
import pino from 'pino';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  level: process.env.LOG_LEVEL ?? 'info',
});
```

- [ ] **Step 11: Create .env.example**

```bash
# Server
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth
JWT_SECRET=change-me-in-production

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=helix-api
```

- [ ] **Step 12: Commit**

```bash
git add apps/api/
git commit -m "feat(apps/api): add Fastify server with health, candidate, and role routes"
```

---

### Task 7: apps/web — Next.js Frontend

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/components.json`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/dashboard/page.tsx`
- Create: `apps/web/src/app/candidates/page.tsx`
- Create: `apps/web/src/app/roles/page.tsx`
- Create: `apps/web/src/app/simulations/page.tsx`
- Create: `apps/web/src/app/reports/page.tsx`
- Create: `apps/web/src/app/trust/page.tsx`
- Create: `apps/web/src/app/debates/page.tsx`
- Create: `apps/web/src/app/settings/page.tsx`
- Create: `apps/web/src/providers/index.tsx`
- Create: `apps/web/src/store/index.ts`
- Create: `apps/web/src/services/api.ts`
- Create: `apps/web/src/lib/utils.ts`
- Create: `apps/web/src/styles/globals.css`
- Create: `apps/web/.env.example`
- Create: `apps/web/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf .next dist"
  },
  "dependencies": {
    "@helix/ui": "workspace:*",
    "@helix/types": "workspace:*",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.64.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.24.0",
    "recharts": "^2.15.0",
    "lucide-react": "^0.468.0",
    "socket.io-client": "^4.8.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "next-themes": "^0.4.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "skipLibCheck": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@helix/ui', '@helix/types'],
};

export default nextConfig;
```

- [ ] **Step 4: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
};

export default config;
```

- [ ] **Step 5: Create postcss.config.mjs**

```mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

- [ ] **Step 6: Create components.json for shadcn/ui**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 7: Create src/styles/globals.css**

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}
```

- [ ] **Step 8: Create src/lib/utils.ts**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 9: Create src/app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Helix - AI Recruitment Intelligence',
  description: 'AI-native candidate intelligence and hiring prediction platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Create src/app/page.tsx**

```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
```

- [ ] **Step 11: Create src/app/dashboard/page.tsx**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 12 through Step 19: Create remaining page stubs**

Each page follows the same pattern. For example, `src/app/candidates/page.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function CandidatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Explorer</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Candidate list and search will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

Create similar stubs for: roles/page.tsx, simulations/page.tsx, reports/page.tsx, trust/page.tsx, debates/page.tsx, settings/page.tsx. Each with appropriate title and container layout.

- [ ] **Step 20: Create src/providers/index.tsx**

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5, retry: 2 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 21: Create src/store/index.ts**

```ts
import { create } from 'zustand';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'system',
  setTheme: (theme) => set({ theme }),
}));

interface CandidateStore {
  selectedCandidateId: string | null;
  setSelectedCandidate: (id: string | null) => void;
}

export const useCandidateStore = create<CandidateStore>((set) => ({
  selectedCandidateId: null,
  setSelectedCandidate: (id) => set({ selectedCandidateId: id }),
}));
```

- [ ] **Step 22: Create src/services/api.ts**

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
```

- [ ] **Step 23: Create .env.example**

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

- [ ] **Step 24: Commit**

```bash
git add apps/web/
git commit -m "feat(apps/web): scaffold Next.js 16 app with dashboard, providers, and pages"
```

---

### Task 8: services/orchestration-engine

**Files:**
- Create: `services/orchestration-engine/package.json`
- Create: `services/orchestration-engine/tsconfig.json`
- Create: `services/orchestration-engine/src/index.ts`
- Create: `services/orchestration-engine/src/workflow-manager.ts`
- Create: `services/orchestration-engine/src/queue-consumer.ts`
- Create: `services/orchestration-engine/src/memory-store.ts`
- Create: `services/orchestration-engine/src/tool-router.ts`
- Create: `services/orchestration-engine/.env.example`
- Create: `services/orchestration-engine/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/orchestration-engine",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "@helix/ai": "workspace:*",
    "bullmq": "^5.40.0",
    "ioredis": "^5.4.0",
    "pino": "^9.6.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

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

- [ ] **Step 3: Create src/index.ts**

```ts
import { QueueConsumer } from './queue-consumer.js';

async function main() {
  const consumer = new QueueConsumer();
  await consumer.start();
  process.on('SIGTERM', async () => {
    await consumer.stop();
    process.exit(0);
  });
}

main().catch(console.error);
```

- [ ] **Step 4: Create src/queue-consumer.ts**

```ts
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { WorkflowManager } from './workflow-manager.js';
import { logger } from './lib/logger.js';

export class QueueConsumer {
  private worker: Worker | null = null;
  private workflowManager = new WorkflowManager();
  private connection: IORedis;

  constructor() {
    this.connection = new IORedis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      maxRetriesPerRequest: null,
    });
  }

  async start(): Promise<void> {
    this.worker = new Worker(
      'candidate-analysis',
      async (job) => {
        const { candidateId, roleId } = job.data;
        logger.info({ candidateId, roleId }, 'Orchestrator processing job');
        return this.workflowManager.executeCandidateAnalysis(candidateId, roleId);
      },
      { connection: this.connection, concurrency: 3 },
    );
    logger.info('Orchestration engine started');
  }

  async stop(): Promise<void> {
    await this.worker?.close();
    await this.connection.quit();
  }
}
```

- [ ] **Step 5: Create src/workflow-manager.ts**

```ts
import type { CandidateProfile, RoleProfile } from '@helix/types';
import type { AnalysisOutput } from '@helix/ai';
import { logger } from './lib/logger.js';

export class WorkflowManager {
  async executeCandidateAnalysis(candidateId: string, roleId: string): Promise<AnalysisOutput> {
    const candidate = await this.getCandidateProfile(candidateId);
    const role = await this.getRoleProfile(roleId);
    const analysis = await this.runAnalysis(candidate, role);
    logger.info({ candidateId, roleId, score: analysis.helixScore }, 'Analysis complete');
    return analysis;
  }

  private async getCandidateProfile(_candidateId: string): Promise<CandidateProfile> {
    throw new Error('Database integration not yet implemented');
  }

  private async getRoleProfile(_roleId: string): Promise<RoleProfile> {
    throw new Error('Database integration not yet implemented');
  }

  private async runAnalysis(_candidate: CandidateProfile, _role: RoleProfile): Promise<AnalysisOutput> {
    throw new Error('AI agent integration not yet implemented');
  }
}
```

- [ ] **Step 6: Create src/memory-store.ts**

```ts
export interface MemoryEntry {
  key: string;
  value: unknown;
  ttl?: number;
  createdAt: number;
}

export class MemoryStore {
  private store = new Map<string, MemoryEntry>();

  set(key: string, value: unknown, ttlMs?: number): void {
    this.store.set(key, { key, value, ttl: ttlMs, createdAt: Date.now() });
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.ttl && Date.now() - entry.createdAt > entry.ttl) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
```

- [ ] **Step 7: Create src/tool-router.ts**

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';

type ToolHandler = (params: Record<string, unknown>) => Promise<unknown>;

export class ToolRouter {
  private tools = new Map<string, ToolHandler>();

  register(name: string, handler: ToolHandler): void {
    this.tools.set(name, handler);
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    const handler = this.tools.get(request.tool);
    if (!handler) {
      return {
        id: request.id,
        result: null,
        error: { code: 'TOOL_NOT_FOUND', message: `Tool '${request.tool}' not found` },
        metadata: { timestamp: new Date().toISOString(), durationMs: 0 },
      };
    }
    const startTime = Date.now();
    try {
      const result = await handler(request.params);
      return {
        id: request.id,
        result,
        metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
      };
    } catch (error) {
      return {
        id: request.id,
        result: null,
        error: { code: 'TOOL_ERROR', message: (error as Error).message },
        metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
      };
    }
  }
}
```

- [ ] **Step 8: Create src/lib/logger.ts**

```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  },
});
```

- [ ] **Step 9: Commit**

```bash
git add services/orchestration-engine/
git commit -m "feat(services/orchestration-engine): add LangGraph orchestration with queue consumer and tool router"
```

---

### Task 9: Candidate Intelligence MCP Service

**Files:**
- Create: `services/candidate-intelligence-mcp/package.json`
- Create: `services/candidate-intelligence-mcp/tsconfig.json`
- Create: `services/candidate-intelligence-mcp/src/index.ts`
- Create: `services/candidate-intelligence-mcp/src/server.ts`
- Create: `services/candidate-intelligence-mcp/src/transport.ts`
- Create: `services/candidate-intelligence-mcp/src/tools/index.ts`
- Create: `services/candidate-intelligence-mcp/src/tools/parse-resume.ts`
- Create: `services/candidate-intelligence-mcp/src/tools/build-dna.ts`
- Create: `services/candidate-intelligence-mcp/.env.example`
- Create: `services/candidate-intelligence-mcp/README.md`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@helix/candidate-intelligence-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "fastify": "^5.2.0",
    "zod": "^3.24.0",
    "pino": "^9.6.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

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

- [ ] **Step 3: Create src/index.ts**

```ts
import { startServer } from './server.js';

const PORT = Number(process.env.PORT ?? 4101);

async function main() {
  const server = await startServer(PORT);
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch(console.error);
```

- [ ] **Step 4: Create src/server.ts**

```ts
import Fastify from 'fastify';
import { registerTools } from './tools/index.js';
import type { MCPRequest, MCPResponse } from '@helix/types';

export async function startServer(port: number) {
  const app = Fastify({ logger: true });

  app.post('/mcp', async (request): Promise<MCPResponse> => {
    const mcpRequest = request.body as MCPRequest;
    return registerTools(mcpRequest);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'candidate-intelligence-mcp' }));

  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Candidate Intelligence MCP running on port ${port}`);
  return app;
}
```

- [ ] **Step 5: Create src/transport.ts**

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';

export class MCPTransport {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async send(request: MCPRequest): Promise<MCPResponse> {
    const response = await fetch(`${this.url}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return response.json() as Promise<MCPResponse>;
  }
}
```

- [ ] **Step 6: Create src/tools/index.ts**

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
import { handleParseResume } from './parse-resume.js';
import { handleBuildDNA } from './build-dna.js';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_resume: handleParseResume,
  extract_skills: handleParseResume,
  extract_capabilities: handleParseResume,
  build_candidate_dna: handleBuildDNA,
  infer_learning_velocity: handleBuildDNA,
};

export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return {
      id: request.id,
      result: null,
      error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` },
      metadata: { timestamp: new Date().toISOString(), durationMs: 0 },
    };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return {
      id: request.id,
      result,
      metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
    };
  } catch (error) {
    return {
      id: request.id,
      result: null,
      error: { code: 'TOOL_ERROR', message: (error as Error).message },
      metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
    };
  }
}
```

- [ ] **Step 7: Create src/tools/parse-resume.ts**

```ts
import type { CandidateProfile } from '@helix/types';

export async function handleParseResume(params: Record<string, unknown>): Promise<Partial<CandidateProfile>> {
  const resumeText = params.resumeText as string | undefined;
  if (!resumeText) {
    throw new Error('resumeText parameter is required');
  }
  return {
    id: crypto.randomUUID(),
    fullName: '',
    email: '',
    summary: resumeText.substring(0, 200),
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
```

- [ ] **Step 8: Create src/tools/build-dna.ts**

```ts
import type { CandidateDNA } from '@helix/types';

export async function handleBuildDNA(params: Record<string, unknown>): Promise<CandidateDNA> {
  const candidateId = params.candidateId as string | undefined;
  if (!candidateId) throw new Error('candidateId parameter is required');
  return {
    candidateId,
    technicalDepth: 50,
    ownership: 50,
    learningVelocity: 50,
    adaptability: 50,
    communication: 50,
    leadership: 50,
    domainExpertise: {},
    skillProficiencies: {},
    confidenceScore: 50,
  };
}

export async function handleInferLearningVelocity(_params: Record<string, unknown>): Promise<{ learningVelocity: number }> {
  return { learningVelocity: 50 };
}
```

- [ ] **Step 9: Commit**

```bash
git add services/candidate-intelligence-mcp/
git commit -m "feat(services/candidate-intelligence-mcp): add MCP service with resume parsing and DNA building tools"
```

---

### Task 10: Remaining MCP Services (parallel batch)

**Files:** Each service follows the exact same pattern as Task 9, with different names and tools.

Services to create:
1. `services/trust-intelligence-mcp/`
2. `services/role-intelligence-mcp/`
3. `services/graph-intelligence-mcp/`
4. `services/simulation-engine-mcp/`
5. `services/recruiter-agents-mcp/`

Each gets: `package.json`, `tsconfig.json`, `src/index.ts`, `src/server.ts`, `src/transport.ts`, `src/tools/index.ts`, tool stubs, `.env.example`, `README.md`

- [ ] **Step 1: Create trust-intelligence-mcp**

```json
{
  "name": "@helix/trust-intelligence-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "fastify": "^5.2.0",
    "zod": "^3.24.0",
    "pino": "^9.6.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0"
  }
}
```

Same structure for all 5 services. For tool handlers, create stub implementations:

**trust-intelligence-mcp/src/tools:**
- `calculate_trust_score` → returns `{ overall: 75, fraudRisk: 'LOW' }`
- `verify_claims` → returns `{ verifiedClaims: [], unverifiableClaims: [] }`
- `detect_resume_anomalies` → returns `{ anomalies: [], riskLevel: 'LOW' }`

**role-intelligence-mcp/src/tools:**
- `parse_job_description` → returns `{ title: '', requirements: [] }`
- `build_role_dna` → returns `{ technicalDepth: 50, ownership: 50 }`
- `extract_requirements` → returns `{ required: [], preferred: [] }`

**graph-intelligence-mcp/src/tools:**
- `build_career_graph` → returns `{ nodes: [], edges: [] }`
- `query_graph` → returns `{ results: [] }`
- `career_path_analysis` → returns `{ paths: [], recommendations: [] }`

**simulation-engine-mcp/src/tools:**
- `simulate_candidate_success` → returns `{ successProbability: 50 }`
- `predict_retention` → returns `{ retentionProbability: 50 }`
- `counterfactual_analysis` → returns `{ scenarios: [] }`

**recruiter-agents-mcp/src/tools:**
- `run_cto_review` → returns `{ score: 50, reasoning: '' }`
- `run_debate` → returns `{ consensus: { finalScore: 50 } }`
- `generate_consensus` → returns `{ finalScore: 50, recommendation: 'neutral' }`

- [ ] **Step 2: Commit all MCP services**

```bash
git add services/trust-intelligence-mcp/ services/role-intelligence-mcp/ services/graph-intelligence-mcp/ services/simulation-engine-mcp/ services/recruiter-agents-mcp/
git commit -m "feat(services): add trust, role, graph, simulation, and recruiter MCP services"
```

---

### Task 11: Skills Directory

**Files:** Create 9 skill markdown files in `skills/`

- [ ] **Step 1: Create skills/candidate-dna.skill.md**

```md
---
name: candidate-dna
description: Extract structured capability profile from candidate data
version: 1.0.0
---

# Candidate DNA Extraction

## Goal
Build a structured candidate capability profile from raw resume and portfolio data.

## Context
Used by the Candidate Intelligence MCP to transform unstructured candidate data into the CandidateDNA type.

## Input
- Raw resume text
- Project portfolio
- GitHub activity data
- Skill list

## Output
{
  "candidateId": "string",
  "technicalDepth": 0-100,
  "ownership": 0-100,
  "learningVelocity": 0-100,
  "adaptability": 0-100,
  "communication": 0-100,
  "leadership": 0-100,
  "domainExpertise": { "key": 0-100 },
  "skillProficiencies": { "key": 0-100 },
  "confidenceScore": 0-100
}

## Evaluation Criteria
- Scores should be evidence-based, not guesswork
- Confidence score reflects data quality and quantity
- Domain expertise must be justified by specific experience

## Edge Cases
- Minimal data: return low confidence, neutral scores
- Contradictory data: flag for trust analysis
- Overstated skills: calibrate based on evidence depth
```

- [ ] **Step 2: Create remaining skill files**

Create `role-dna.skill.md`, `trust-intelligence.skill.md`, `career-graph.skill.md`, `success-simulation.skill.md`, `counterfactual-analysis.skill.md`, `recruiter-debate.skill.md`, `hidden-talent.skill.md`, `report-generation.skill.md` — each with frontmatter, goal, context, inputs, outputs, evaluation criteria, and edge cases following the same pattern.

- [ ] **Step 3: Commit**

```bash
git add skills/
git commit -m "docs(skills): add AI skill definitions for all intelligence layers"
```

---

### Task 12: Infrastructure — Docker, Kubernetes, Terraform

**Files:**
- Create: `infrastructure/docker/Dockerfile.api`
- Create: `infrastructure/docker/Dockerfile.web`
- Create: `infrastructure/docker/Dockerfile.orchestrator`
- Create: `infrastructure/docker/docker-compose.yml`
- Create: `infrastructure/docker/.env.example`
- Create: `infrastructure/kubernetes/api-deployment.yaml`
- Create: `infrastructure/kubernetes/web-deployment.yaml`
- Create: `infrastructure/kubernetes/orchestrator-deployment.yaml`
- Create: `infrastructure/kubernetes/postgres-statefulset.yaml`
- Create: `infrastructure/kubernetes/redis-deployment.yaml`
- Create: `infrastructure/kubernetes/ingress.yaml`
- Create: `infrastructure/terraform/main.tf`
- Create: `infrastructure/terraform/variables.tf`
- Create: `infrastructure/terraform/modules/network/main.tf`
- Create: `infrastructure/terraform/modules/database/main.tf`
- Create: `infrastructure/terraform/modules/compute/main.tf`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: helix
      POSTGRES_PASSWORD: helix
      POSTGRES_DB: helix
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  neo4j:
    image: neo4j:5-community
    environment:
      NEO4J_AUTH: neo4j/helix
    ports:
      - "7687:7687"
      - "7474:7474"

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"

  api:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.api
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://helix:helix@postgres:5432/helix
      REDIS_HOST: redis

  orchestrator:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile.orchestrator
    depends_on:
      - redis
    environment:
      REDIS_HOST: redis

volumes:
  postgres_data:
```

- [ ] **Step 2: Create Dockerfile.api**

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/api/ apps/api/
COPY packages/ packages/
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @helix/api build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]
```

- [ ] **Step 3: Create remaining infrastructure files**

Dockerfile.web, Dockerfile.orchestrator, Kubernetes manifests, and Terraform modules following standard patterns.

- [ ] **Step 4: Commit**

```bash
git add infrastructure/
git commit -m "infra: add Docker, Kubernetes, and Terraform configurations"
```

---

### Task 13: CI/CD and Documentation

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/docker.yml`
- Create: `docs/architecture/overview.md`
- Create: `docs/api/endpoints.md`
- Create: `docs/mcp/protocol.md`

- [ ] **Step 1: Create .github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

- [ ] **Step 2: Create .github/workflows/docker.yml**

```yaml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build API
        run: docker build -f infrastructure/docker/Dockerfile.api -t helix-api .
      - name: Build Web
        run: docker build -f infrastructure/docker/Dockerfile.web -t helix-web .
      - name: Build Orchestrator
        run: docker build -f infrastructure/docker/Dockerfile.orchestrator -t helix-orchestrator .
```

- [ ] **Step 3: Create docs stubs**

Brief markdown files for architecture overview, API endpoints, and MCP protocol.

- [ ] **Step 4: Commit**

```bash
git add .github/ docs/
git commit -m "ci: add GitHub Actions workflows and documentation stubs"
```
