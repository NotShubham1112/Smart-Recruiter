### Task 5: packages/ai — AI SDK, Prompts, and Workflows

**Files:** Create all under `packages/ai/`
- `package.json`, `tsconfig.json`, `README.md`
- `src/index.ts`
- `src/providers/groq.ts`
- `src/registry/model-router.ts`
- `src/agents/technical-recruiter.ts`
- `src/agents/hiring-manager.ts`
- `src/workflows/candidate-analysis.ts`
- `src/prompts/candidate-extraction.ts`

Create directories: `packages/ai/src/providers/`, `packages/ai/src/registry/`, `packages/ai/src/agents/`, `packages/ai/src/workflows/`, `packages/ai/src/prompts/`

**package.json:**
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

**src/providers/groq.ts:**
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

**src/registry/model-router.ts:**
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

**src/agents/technical-recruiter.ts:**
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

**src/agents/hiring-manager.ts:**
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

**src/workflows/candidate-analysis.ts:**
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

**src/prompts/candidate-extraction.ts:**
```ts
export const CANDIDATE_EXTRACTION_SYSTEM_PROMPT = `You are a candidate intelligence analyst. Extract structured information from resumes and professional profiles. Focus on verifiable facts and concrete achievements.`;

export const CANDIDATE_EXTRACTION_USER_PROMPT = (resumeText: string): string =>
  `Extract the following from this resume:\n1. Full name and contact information\n2. Work experience (company, title, dates, responsibilities)\n3. Education (institution, degree, field, dates)\n4. Skills with proficiency indicators\n5. Projects and achievements\n\nResume:\n${resumeText}`;

export const TRUST_ANALYSIS_SYSTEM_PROMPT = `You are a trust and verification analyst. Evaluate candidate claims for consistency, specificity, and verifiability. Flag potential exaggerations or inconsistencies.`;

export const ROLE_ANALYSIS_SYSTEM_PROMPT = `You are a role analyst. Extract structured role requirements from job descriptions. Identify both explicit and implicit requirements.`;
```

**src/index.ts:**
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

**README.md:**
```md
# @helix/ai

AI SDK, agent definitions, workflows, and prompt templates for the Helix platform.

## Usage

```ts
import { GroqClient, runCandidateAnalysis } from '@helix/ai';
```
```

**Commit:**
```bash
git add packages/ai/
git commit -m "feat(packages/ai): add AI SDK, model router, agent stubs, and prompts"
```
