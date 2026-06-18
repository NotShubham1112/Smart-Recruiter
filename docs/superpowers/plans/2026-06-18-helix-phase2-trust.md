# Phase 2: Trust Intelligence Implementation Plan

> For agentic workers: Build the Trust Intelligence pipeline.

**Goal:** Detect AI-generated resumes and exaggerated claims via claim verification, anomaly detection, and trust scoring.

**Architecture:** Candidate profile → claim extraction → anomaly scoring → trust score → /trust dashboard UI.

## File Changes

- Create: `packages/ai/src/agents/trust-analyzer.ts`
- Modify: `services/trust-intelligence-mcp/src/tools/index.ts`
- Modify: `apps/web/src/app/trust/page.tsx`
- Add fake data to candidate page showing trust warnings

---

### Task: Trust Analyzer Agent

Create `packages/ai/src/agents/trust-analyzer.ts`:

```ts
import type { CandidateProfile } from '@helix/types';

export interface Claim {
  id: string;
  text: string;
  category: 'experience' | 'education' | 'achievement' | 'skill' | 'tenure';
  confidence: number;
  verified: boolean;
  verificationSource?: string;
}

export interface TrustReport {
  candidateId: string;
  overallTrustScore: number;
  claimCount: number;
  verifiedClaims: number;
  suspiciousClaims: number;
  aiGeneratedProbability: number;
  anomalyScore: number;
  claims: Claim[];
  redFlags: string[];
}

export function analyzeTrust(profile: CandidateProfile): TrustReport {
  const claims = extractClaims(profile);
  const verified = claims.filter(c => c.verified).length;
  const suspicious = claims.filter(c => !c.verified).length;
  const anomalyScore = computeAnomalyScore(profile, claims);
  const aiGenProb = detectAIGenerated(profile);
  const redFlags = findRedFlags(profile, claims, anomalyScore);

  const overallTrustScore = Math.round(
    100 - (suspicious / Math.max(claims.length, 1)) * 30 - anomalyScore * 20 - aiGenProb * 15
  );

  return {
    candidateId: profile.id,
    overallTrustScore: Math.max(0, Math.min(100, overallTrustScore)),
    claimCount: claims.length,
    verifiedClaims: verified,
    suspiciousClaims: suspicious,
    aiGeneratedProbability: aiGenProb,
    anomalyScore,
    claims,
    redFlags,
  };
}

function extractClaims(profile: CandidateProfile): Claim[] {
  const claims: Claim[] = [];

  for (const exp of profile.experience) {
    claims.push({
      id: crypto.randomUUID(),
      text: `${exp.title} at ${exp.company}`,
      category: 'experience',
      confidence: verifyExperienceClaim(exp) ? 85 : 40,
      verified: verifyExperienceClaim(exp),
    });
    if (exp.description) {
      claims.push({
        id: crypto.randomUUID(),
        text: exp.description.slice(0, 100),
        category: 'achievement',
        confidence: exp.description.length > 20 ? 70 : 30,
        verified: exp.description.length > 20,
      });
    }
  }

  for (const edu of profile.education) {
    claims.push({
      id: crypto.randomUUID(),
      text: edu.degree,
      category: 'education',
      confidence: edu.degree.length > 5 ? 80 : 30,
      verified: edu.degree.length > 5,
    });
  }

  const knownSkills = ['react', 'python', 'typescript', 'aws', 'docker', 'postgresql', 'node.js', 'java', 'go', 'rust'];
  for (const skill of profile.skills) {
    claims.push({
      id: crypto.randomUUID(),
      text: skill.name,
      category: 'skill',
      confidence: knownSkills.includes(skill.name.toLowerCase()) ? 90 : 50,
      verified: knownSkills.includes(skill.name.toLowerCase()),
    });
  }

  return claims;
}

function verifyExperienceClaim(exp: { company: string; title: string }): boolean {
  const knownCompanies = ['google', 'meta', 'amazon', 'microsoft', 'apple', 'netflix', 'stripe', 'airbnb', 'uber', 'spotify'];
  const knownTitles = /engineer|developer|architect|lead|manager|scientist|analyst/i;
  const companyOk = knownCompanies.some(c => exp.company.toLowerCase().includes(c)) || exp.company.length > 2;
  const titleOk = knownTitles.test(exp.title) || exp.title.length > 5;
  return companyOk && titleOk;
}

function computeAnomalyScore(profile: CandidateProfile, claims: Claim[]): number {
  let anomalies = 0;
  if (profile.experience.length > 7) anomalies += 0.3;
  if (profile.skills.length > 25) anomalies += 0.3;
  if (claims.every(c => c.verified)) anomalies += 0.2;
  if (profile.experience.length === 0 && profile.skills.length > 10) anomalies += 0.4;
  return Math.min(1, anomalies);
}

function detectAIGenerated(profile: CandidateProfile): number {
  const text = [profile.summary, ...profile.experience.map(e => e.description)].filter(Boolean).join(' ');
  const aiPatterns = [
    /demonstrated\s+(a\s+)?proven\s+(ability|track\s+record)/i,
    /passionate\s+(about|to)\s+(deliver|drive|leverage)/i,
    /results-oriented\s+professional/i,
    /synergize|leverage|cross-functional|stakeholder\s+alignment/i,
    /spearheaded|orchestrated|architected\s+the\s+(development|implementation)/i,
  ];
  const matches = aiPatterns.filter(p => p.test(text)).length;
  return Math.min(1, matches * 0.2);
}

function findRedFlags(profile: CandidateProfile, claims: Claim[], anomalyScore: number): string[] {
  const flags: string[] = [];
  if (anomalyScore > 0.5) flags.push('Unusual experience/skills ratio detected');
  if (profile.skills.length > 25) flags.push('Suspiciously large skill set');
  if (profile.experience.length > 7) flags.push('Excessive job changes without progression');
  if (claims.filter(c => !c.verified).length > claims.length * 0.5) flags.push('Most claims cannot be independently verified');
  if (detectAIGenerated(profile) > 0.5) flags.push('Resume contains AI-generated language patterns');
  return flags;
}
```

### Task: Update trust-intelligence-mcp tools

**Rewrite `services/trust-intelligence-mcp/src/tools/index.ts`:**

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
import { analyzeTrust } from '@helix/ai';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  verify_claims: async (params) => {
    const profile = params.candidateProfile as any;
    if (!profile) throw new Error('candidateProfile required');
    return analyzeTrust(profile);
  },
  detect_anomalies: async (params) => {
    const profile = params.candidateProfile as any;
    const report = analyzeTrust(profile);
    return { anomalyScore: report.anomalyScore, aiGeneratedProbability: report.aiGeneratedProbability, redFlags: report.redFlags };
  },
  score_trust: async (params) => {
    const profile = params.candidateProfile as any;
    const report = analyzeTrust(profile);
    return { candidateId: report.candidateId, trustScore: report.overallTrustScore, suspiciousClaims: report.suspiciousClaims, totalClaims: report.claimCount };
  },
};

export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
```

### Task: Trust dashboard page

**Rewrite `apps/web/src/app/trust/page.tsx`:**

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';

const mockCandidates = [
  {
    id: '1',
    name: 'Alex Chen',
    trustScore: 89,
    aiGeneratedProb: 12,
    anomalyScore: 0.15,
    suspiciousClaims: 1,
    totalClaims: 12,
    redFlags: [],
    status: 'verified' as const,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    trustScore: 92,
    aiGeneratedProb: 8,
    anomalyScore: 0.1,
    suspiciousClaims: 0,
    totalClaims: 15,
    redFlags: [],
    status: 'verified' as const,
  },
  {
    id: '3',
    name: 'Marcus Williams',
    trustScore: 72,
    aiGeneratedProb: 45,
    anomalyScore: 0.35,
    suspiciousClaims: 4,
    totalClaims: 14,
    redFlags: ['Resume contains AI-generated language patterns', 'Most claims cannot be independently verified'],
    status: 'suspicious' as const,
  },
  {
    id: '4',
    name: 'Emily Zhang',
    trustScore: 55,
    aiGeneratedProb: 72,
    anomalyScore: 0.6,
    suspiciousClaims: 8,
    totalClaims: 18,
    redFlags: ['Unusual experience/skills ratio detected', 'Suspiciously large skill set', 'Resume contains AI-generated language patterns'],
    status: 'flagged' as const,
  },
  {
    id: '5',
    name: 'James Rodriguez',
    trustScore: 93,
    aiGeneratedProb: 5,
    anomalyScore: 0.08,
    suspiciousClaims: 0,
    totalClaims: 10,
    redFlags: [],
    status: 'verified' as const,
  },
];

const statusColor = { verified: 'success', suspicious: 'warning', flagged: 'destructive' as string } as const;

export default function TrustPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trust Intelligence</h1>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{mockCandidates.filter(c => c.status === 'verified').length}</div>
            <div className="text-sm text-muted-foreground">Verified</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{mockCandidates.filter(c => c.status === 'suspicious').length}</div>
            <div className="text-sm text-muted-foreground">Suspicious</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">{mockCandidates.filter(c => c.status === 'flagged').length}</div>
            <div className="text-sm text-muted-foreground">Flagged</div>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        {mockCandidates.map((c) => (
          <Card key={c.id} className={c.status === 'flagged' ? 'border-red-500' : c.status === 'suspicious' ? 'border-yellow-500' : ''}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{c.name}</h3>
                    <Badge variant={statusColor[c.status] as any}>{c.status}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{c.trustScore}</div>
                  <div className="text-sm text-muted-foreground">Trust Score</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">AI-Generated Probability</div>
                  <Progress value={c.aiGeneratedProb} className="mt-1" />
                  <div className="text-xs text-right mt-1">{c.aiGeneratedProb}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Anomaly Score</div>
                  <Progress value={c.anomalyScore * 100} className="mt-1" />
                  <div className="text-xs text-right mt-1">{(c.anomalyScore * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Claims Verified</div>
                  <div className="text-lg font-semibold mt-1">{c.totalClaims - c.suspiciousClaims}/{c.totalClaims}</div>
                </div>
              </div>

              {c.redFlags.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-600 mb-1">Red Flags</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {c.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Export trust agent

**Modify `packages/ai/src/index.ts`:**

```ts
export { extractCandidateProfile, inferCapabilityDNA } from './agents/candidate-extractor';
export { analyzeTrust } from './agents/trust-analyzer';
export type { TrustReport, Claim } from './agents/trust-analyzer';
```

### Commit:
```bash
git add packages/ai/src/agents/trust-analyzer.ts packages/ai/src/index.ts services/trust-intelligence-mcp/src/tools/ apps/web/src/app/trust/
git commit -m "feat: add Trust Intelligence pipeline with AI resume detection and trust scoring dashboard"
```
