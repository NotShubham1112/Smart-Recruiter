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

**Step 1: Create package.json**
Content:
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

**Step 2: Create tsconfig.json**
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

**Step 3: Create src/candidate.ts**
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

**Step 4: Create src/role.ts**
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

**Step 5: Create src/company.ts**
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

**Step 6: Create src/trust.ts**
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

**Step 7: Create src/simulation.ts**
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

**Step 8: Create src/graph.ts**
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

**Step 9: Create src/debate.ts**
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

**Step 10: Create src/mcp.ts**
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

**Step 11: Create src/report.ts**
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

**Step 12: Create src/index.ts**
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

**Step 13: Create README.md**
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

**Step 14: Commit**
```bash
git add packages/types/
git commit -m "feat(packages/types): add shared TypeScript interfaces"
```
