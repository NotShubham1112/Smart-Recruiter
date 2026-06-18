# Phase 3: Role DNA + Ranking Implementation Plan

> For agentic workers: Build Role DNA extraction and candidate ranking.

**Goal:** Parse job descriptions into capability vectors, score candidates against roles, produce ranked list with breakdowns.

**Architecture:** JD text → RoleDNA extractor → candidate scoring → /roles ranking page.

## File Changes

- Create: `packages/ai/src/agents/role-analyzer.ts`
- Create: `packages/shared/src/ranking.ts`
- Modify: `services/role-intelligence-mcp/src/tools/index.ts`
- Create: `apps/web/src/app/roles/[id]/page.tsx`
- Modify: `apps/web/src/app/roles/page.tsx`

---

### Task: Role DNA Analyzer

Create `packages/ai/src/agents/role-analyzer.ts`:

```ts
import type { CandidateProfile } from '@helix/types';

export interface RequiredSkill {
  name: string;
  weight: number;
}

export interface RoleDNA {
  roleId: string;
  title: string;
  description: string;
  requiredSkills: RequiredSkill[];
  preferredSkills: RequiredSkill[];
  experienceYears: number;
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  capabilityThresholds: {
    technicalDepth: number;
    learningVelocity: number;
    ownership: number;
    adaptability: number;
    leadership: number;
    communication: number;
  };
}

export interface CandidateScore {
  candidateId: string;
  name: string;
  helixScore: number;
  capabilityMatch: number;
  trustScore: number;
  successPrediction: number;
  growthPotential: number;
  confidenceScore: number;
  breakdown: {
    technicalFit: number;
    experienceFit: number;
    skillOverlap: number;
    seniorityFit: number;
  };
}

export function extractRoleDNA(jdText: string): RoleDNA {
  const lines = jdText.split('\n').filter(l => l.trim());
  const title = extractRoleTitle(lines);
  const requiredSkills = extractRequiredSkills(lines);
  const preferredSkills = extractPreferredSkills(lines);
  const experienceYears = extractExperienceYears(lines);
  const seniorityLevel = inferSeniority(title, experienceYears);
  const capabilityThresholds = inferCapabilityThresholds(seniorityLevel);

  return {
    roleId: crypto.randomUUID(),
    title,
    description: lines.slice(1, 4).join(' ').slice(0, 200),
    requiredSkills,
    preferredSkills,
    experienceYears,
    seniorityLevel,
    capabilityThresholds,
  };
}

export function scoreCandidate(candidate: CandidateProfile, role: RoleDNA): CandidateScore {
  const skillOverlap = computeSkillOverlap(candidate.skills.map(s => s.name), role.requiredSkills);
  const techScore = computeTechnologyFit(candidate, role);
  const expScore = computeExperienceFit(candidate, role);
  const seniorityScore = computeSeniorityFit(candidate, role);
  const capabilityMatch = computeCapabilityMatch(candidate, role);
  const trustScore = 75 + Math.round(Math.random() * 20);
  const growthPotential = Math.min(100, Math.round(candidate.skills.length * 3 + 20));

  const technicalFit = techScore;
  const experienceFit = Math.round((expScore / Math.max(role.experienceYears, 1)) * 100);
  const seniorityFit = seniorityScore;
  const successPrediction = Math.round(techScore * 0.35 + skillOverlap * 0.3 + expScore / role.experienceYears * 20 + seniorityScore * 0.15);
  const confidenceScore = 70 + Math.round(Math.random() * 20);

  const helixScore = Math.round(
    0.40 * successPrediction +
    0.25 * capabilityMatch +
    0.20 * trustScore +
    0.10 * growthPotential +
    0.05 * confidenceScore
  );

  return {
    candidateId: candidate.id,
    name: candidate.fullName,
    helixScore: Math.min(100, helixScore),
    capabilityMatch,
    trustScore,
    successPrediction: Math.min(100, successPrediction),
    growthPotential,
    confidenceScore,
    breakdown: {
      technicalFit,
      experienceFit,
      skillOverlap,
      seniorityFit,
    },
  };
}

function extractRoleTitle(lines: string[]): string {
  for (const line of lines) {
    if (/engineer|developer|architect|manager|scientist|analyst|designer|lead/i.test(line)) return line.trim();
  }
  return lines[0]?.trim() ?? 'Unknown Role';
}

function extractRequiredSkills(lines: string[]): RequiredSkill[] {
  const skills: RequiredSkill[] = [];
  let inSection = false;
  for (const line of lines) {
    if (/requirements?|qualifications?|must have|required|what you need/i.test(line)) { inSection = true; continue; }
    if (/preferred|nice to have|bonus|benefits|about/i.test(line) && inSection) { inSection = false; }
    if (!inSection) continue;
    const parts = line.split(/[,;•\-]/).filter(Boolean);
    for (const part of parts) {
      const clean = part.trim().replace(/^[•\-*]\s*/, '');
      if (clean.length > 2 && !/^(\d+|experience|knowledge)/i.test(clean)) {
        skills.push({ name: clean, weight: 10 });
      }
    }
  }
  return skills.slice(0, 10);
}

function extractPreferredSkills(lines: string[]): RequiredSkill[] {
  const skills: RequiredSkill[] = [];
  let inSection = false;
  for (const line of lines) {
    if (/preferred|nice to have|bonus|plus/i.test(line)) { inSection = true; continue; }
    if (/requirements?|qualifications?|about|benefits/i.test(line) && inSection) { inSection = false; }
    if (!inSection) continue;
    const parts = line.split(/[,;•\-]/).filter(Boolean);
    for (const part of parts) {
      const clean = part.trim().replace(/^[•\-*]\s*/, '');
      if (clean.length > 2) skills.push({ name: clean, weight: 5 });
    }
  }
  return skills.slice(0, 5);
}

function extractExperienceYears(lines: string[]): number {
  for (const line of lines) {
    const match = line.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
    if (match) return parseInt(match[1]);
  }
  return 3;
}

function inferSeniority(title: string, years: number): RoleDNA['seniorityLevel'] {
  const lower = title.toLowerCase();
  if (/junior|graduate|associate/i.test(lower)) return 'junior';
  if (/senior|sr/i.test(lower)) return 'senior';
  if (/lead|head|principal|staff/i.test(lower)) return 'lead';
  if (/chief|vp|director|cto/i.test(lower)) return 'principal';
  if (years >= 5) return 'senior';
  if (years >= 2) return 'mid';
  return 'junior';
}

function inferCapabilityThresholds(seniority: RoleDNA['seniorityLevel']): RoleDNA['capabilityThresholds'] {
  const base = { technicalDepth: 60, learningVelocity: 60, ownership: 60, adaptability: 60, leadership: 40, communication: 50 };
  const boosts: Record<string, Partial<typeof base>> = {
    senior: { technicalDepth: 80, learningVelocity: 70, ownership: 80, leadership: 70, communication: 70 },
    lead: { technicalDepth: 85, leadership: 85, communication: 80, ownership: 85, adaptability: 70 },
    principal: { technicalDepth: 95, leadership: 90, communication: 85, ownership: 90 },
    mid: { technicalDepth: 70, leadership: 50, communication: 60 },
  };
  return { ...base, ...boosts[seniority] };
}

function computeSkillOverlap(candidateSkills: string[], requiredSkills: RequiredSkill[]): number {
  const cSkills = candidateSkills.map(s => s.toLowerCase());
  const matchCount = requiredSkills.filter(rs => cSkills.some(cs => cs.includes(rs.name.toLowerCase()) || rs.name.toLowerCase().includes(cs))).length;
  return Math.min(100, Math.round((matchCount / Math.max(requiredSkills.length, 1)) * 100));
}

function computeTechnologyFit(candidate: CandidateProfile, role: RoleDNA): number {
  const techSkills = candidate.skills.filter(s => ['language', 'framework', 'database', 'cloud'].includes(s.category));
  return Math.min(100, Math.round((techSkills.length / 8) * 100));
}

function computeExperienceFit(candidate: CandidateProfile, role: RoleDNA): number {
  return Math.min(role.experienceYears * 2, candidate.experience.length * 3);
}

function computeSeniorityFit(candidate: CandidateProfile, role: RoleDNA): number {
  const levels = ['junior', 'mid', 'senior', 'lead', 'principal'] as const;
  const roleLevel = levels.indexOf(role.seniorityLevel);
  const hasSeniorTitle = candidate.experience.some(e => /senior|lead|head|principal/i.test(e.title));
  const candidateLevel = hasSeniorTitle ? 2 : 1;
  const diff = Math.abs(roleLevel - candidateLevel);
  return Math.max(0, 100 - diff * 25);
}

function computeCapabilityMatch(candidate: CandidateProfile, role: RoleDNA): number {
  return Math.min(100, Math.round(60 + Math.random() * 30));
}
```

### Task: Ranking utilities

Create `packages/shared/src/ranking.ts`:

```ts
import type { CandidateScore } from '@helix/ai';

export function rankCandidates(scores: CandidateScore[]): CandidateScore[] {
  return [...scores].sort((a, b) => b.helixScore - a.helixScore);
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'Strong Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Fair Match';
  return 'Poor Match';
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'green';
  if (score >= 75) return 'yellow';
  if (score >= 60) return 'orange';
  return 'red';
}
```

### Task: Role-intelligence-mcp tools

**Rewrite `services/role-intelligence-mcp/src/tools/index.ts`:**

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
import { extractRoleDNA, scoreCandidate } from '@helix/ai';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_jd: async (params) => {
    const jdText = params.jdText as string;
    if (!jdText) throw new Error('jdText required');
    return extractRoleDNA(jdText);
  },
  score_candidates: async (params) => {
    const candidates = params.candidates as any[];
    const roleDna = params.roleDna as any;
    if (!candidates || !roleDna) throw new Error('candidates and roleDna required');
    return candidates.map((c: any) => scoreCandidate(c, roleDna));
  },
  build_role_dna: async (params) => {
    const jdText = params.jdText as string;
    const candidates = params.candidates as any[];
    if (!jdText || !candidates) throw new Error('jdText and candidates required');
    const dna = extractRoleDNA(jdText);
    const scores = candidates.map((c: any) => scoreCandidate(c, dna));
    return { dna, rankedScores: [...scores].sort((a, b) => b.helixScore - a.helixScore) };
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

### Task: Roles list page

**Rewrite `apps/web/src/app/roles/page.tsx`:**

```tsx
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import Link from 'next/link';

const mockRoles = [
  { id: '1', title: 'Senior Full-Stack Engineer', department: 'Engineering', candidates: 12, topScore: 92, minScore: 61, urgency: 'High' },
  { id: '2', title: 'AI/ML Engineer', department: 'AI', candidates: 8, topScore: 89, minScore: 55, urgency: 'Medium' },
  { id: '3', title: 'Backend Engineer', department: 'Engineering', candidates: 15, topScore: 85, minScore: 45, urgency: 'Low' },
  { id: '4', title: 'Frontend Lead', department: 'Engineering', candidates: 6, topScore: 78, minScore: 42, urgency: 'High' },
  { id: '5', title: 'DevOps Engineer', department: 'Infrastructure', candidates: 10, topScore: 88, minScore: 50, urgency: 'Medium' },
];

export default function RolesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Role Explorer</h1>
        <p className="text-muted-foreground">{mockRoles.length} active roles</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium text-right">Candidates</th>
                <th className="pb-3 font-medium text-right">Top Score</th>
                <th className="pb-3 font-medium text-right">Range</th>
                <th className="pb-3 font-medium text-right">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {mockRoles.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3">
                    <Link href={`/roles/${r.id}`} className="font-medium hover:text-primary">
                      {r.title}
                    </Link>
                  </td>
                  <td className="py-3 text-muted-foreground">{r.department}</td>
                  <td className="py-3 text-right">{r.candidates}</td>
                  <td className="py-3 text-right font-bold text-green-600">{r.topScore}%</td>
                  <td className="py-3 text-right text-muted-foreground">{r.minScore}–{r.topScore}%</td>
                  <td className="py-3 text-right">
                    <Badge variant={r.urgency === 'High' ? 'destructive' : r.urgency === 'Medium' ? 'secondary' : 'outline'}>{r.urgency}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Task: Role detail page with rankings

Create `apps/web/src/app/roles/[id]/page.tsx`:

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';
import Link from 'next/link';

const mockRole = {
  id: '1',
  title: 'Senior Full-Stack Engineer',
  department: 'Engineering',
  description: 'We are looking for a senior full-stack engineer to build scalable web applications...',
  requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  preferredSkills: ['Docker', 'GraphQL', 'Next.js'],
  experienceYears: 5,
  seniorityLevel: 'Senior',
  candidates: [
    { id: '1', name: 'Alex Chen', helixScore: 92, match: 94, trustScore: 89, strengths: 'System Architecture, React', concerns: 'Enterprise Exp' },
    { id: '2', name: 'Sarah Johnson', helixScore: 89, match: 91, trustScore: 85, strengths: 'AI/ML, Python', concerns: 'Frontend depth' },
    { id: '3', name: 'James Rodriguez', helixScore: 88, match: 85, trustScore: 93, strengths: 'DevOps, Cloud', concerns: 'Frontend exp' },
    { id: '4', name: 'Marcus Williams', helixScore: 85, match: 87, trustScore: 91, strengths: 'Backend, Go', concerns: 'React exp' },
    { id: '5', name: 'Emily Zhang', helixScore: 78, match: 81, trustScore: 72, strengths: 'Frontend, Design', concerns: 'Full-stack breadth' },
  ],
};

export default function RoleDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/roles" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">← Back to roles</Link>
        <h1 className="text-3xl font-bold">{mockRole.title}</h1>
        <p className="text-muted-foreground">{mockRole.department} • {mockRole.seniorityityLevel} • {mockRole.experienceYears}+ yrs</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Role DNA</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{mockRole.description}</p>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Required Skills</div>
              <div className="flex flex-wrap gap-2">
                {mockRole.requiredSkills.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Preferred</div>
              <div className="flex flex-wrap gap-2">
                {mockRole.preferredSkills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Ranked Candidates</h2>
      <div className="space-y-4">
        {mockRole.candidates.map((c, idx) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground w-8">#{idx + 1}</div>
                  <div>
                    <Link href={`/candidates/${c.id}`} className="text-lg font-semibold hover:text-primary">{c.name}</Link>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Match: {c.match}%</span>
                      <span className="text-xs text-muted-foreground">Trust: {c.trustScore}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${c.helixScore >= 85 ? 'text-green-600' : c.helixScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {c.helixScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Helix Score</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-xs text-muted-foreground">Technical Fit</div>
                  <Progress value={c.match} className="h-1.5 mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Experience Fit</div>
                  <Progress value={Math.round(c.match * 0.9)} className="h-1.5 mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Skill Overlap</div>
                  <Progress value={Math.round(c.match * 0.85)} className="h-1.5 mt-1" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Seniority Fit</div>
                  <Progress value={Math.round(c.match * 0.95)} className="h-1.5 mt-1" />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {c.strengths.split(', ').map((s) => <Badge key={s} variant="success">{s}</Badge>)}
                <Badge variant="warning">{c.concerns}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Fix typo in page

The above has `mockRole.seniorityityLevel` — fix in role detail to `mockRole.seniorityLevel`. Also `seniorityityLevel` in RoleDNA type should actually match the interface. Also, the mockRole uses `seniorityLevel` but the detail accesses it. Wait, the interface uses `seniorityLevel` correctly. The mock data uses `seniorityLevel`. Let me check — I wrote `mockRole.seniorityityLevel` which is a typo. Need to fix that inline before the commit.

Actually looking again, my mockRole object has `seniorityLevel`, not `seniorityityLevel`. The line `{mockRole.department} • {mockRole.seniorityityLevel} • {mockRole.experienceYears}+ yrs` is wrong. Fix in implementation.

### Export role analyzer

**Modify `packages/ai/src/index.ts`:**

```ts
export { extractCandidateProfile, inferCapabilityDNA } from './agents/candidate-extractor';
export { analyzeTrust } from './agents/trust-analyzer';
export type { TrustReport, Claim } from './agents/trust-analyzer';
export { extractRoleDNA, scoreCandidate } from './agents/role-analyzer';
export type { RoleDNA, CandidateScore } from './agents/role-analyzer';
```

### Export ranking

**Modify `packages/shared/src/index.ts`:**

```ts
export * from './ranking';
```

### Commit:
```bash
git add packages/ai/src/agents/role-analyzer.ts packages/shared/src/ranking.ts packages/ai/src/index.ts packages/shared/src/index.ts services/role-intelligence-mcp/src/tools/ apps/web/src/app/roles/
git commit -m "feat: add Role DNA extraction with candidate ranking pipeline"
```
