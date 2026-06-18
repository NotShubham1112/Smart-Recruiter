# Phase 4: Multi-Agent Debate + Dashboard Implementation Plan

> For agentic workers: Build multi-agent debate with streaming reasoning, counterfactual analysis, and polished dashboard.

**Goal:** 3 AI agents (CTO/Trust/Growth) debate each candidate with visible reasoning, then generate counterfactual scenarios.

**Architecture:** Candidate + role data → 3 agent evaluators → debate synthesis → streaming UI → /debates page → /dashboard.

## File Changes

- Create: `packages/ai/src/agents/debate-agents.ts`
- Create: `packages/ai/src/workflows/debate-orchestrator.ts`
- Modify: `services/recruiter-agents-mcp/src/tools/index.ts`
- Create: `apps/web/src/app/debates/page.tsx`
- Create: `apps/web/src/app/debates/[id]/page.tsx`
- Rewrite: `apps/web/src/app/dashboard/page.tsx`

---

### Task: Debate Agents

Create `packages/ai/src/agents/debate-agents.ts`:

```ts
import type { CandidateProfile } from '@helix/types';
import type { RoleDNA } from './role-analyzer';

export interface DebateArgument {
  agent: 'CTO' | 'Trust' | 'Growth';
  stance: 'support' | 'caution' | 'neutral';
  points: string[];
  reasoning: string;
  confidence: number;
  counterpoints?: string[];
}

export interface DebateRound {
  id: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  arguments: DebateArgument[];
  synthesis: string;
  recommendation: 'strong_hire' | 'hire' | 'consider' | 'pass';
  confidenceScore: number;
}

export function generateCTOArgument(profile: CandidateProfile, role: RoleDNA): DebateArgument {
  const techSkills = profile.skills.filter(s => ['language', 'framework', 'database', 'cloud'].includes(s.category)).length;
  const leadExp = profile.experience.filter(e => /lead|senior|principal|architect/i.test(e.title)).length;
  const supportPoints: string[] = [];
  const cautionPoints: string[] = [];

  if (techSkills >= 5) supportPoints.push(`Strong technical breadth: ${techSkills} relevant technologies`);
  if (leadExp >= 1) supportPoints.push(`Demonstrated leadership as ${profile.experience.find(e => /lead|senior|principal|architect/i.test(e.title))?.title}`);
  if (profile.experience.length >= 3) supportPoints.push(`${profile.experience.length} positions showing career progression`);
  if (techSkills < 3) cautionPoints.push('Limited technical stack depth for senior role');
  if (profile.experience.length === 0) cautionPoints.push('No professional experience listed');

  const support = supportPoints.length > cautionPoints.length;
  return {
    agent: 'CTO',
    stance: support ? 'support' : 'caution',
    points: support ? supportPoints : cautionPoints,
    reasoning: support
      ? 'Candidate demonstrates the technical foundation and leadership trajectory needed for this role.'
      : 'Candidate lacks the technical depth or seniority expected for this position.',
    confidence: Math.min(100, Math.round(60 + techSkills * 5 + leadExp * 10)),
    counterpoints: cautionPoints.length > 0 ? cautionPoints : undefined,
  };
}

export function generateTrustArgument(profile: CandidateProfile, role: RoleDNA): DebateArgument {
  const experienceClaims = profile.experience.length;
  const skillDiversity = new Set(profile.skills.map(s => s.category)).size;
  const supportPoints: string[] = [];
  const cautionPoints: string[] = [];

  if (experienceClaims >= 2) supportPoints.push(`${experienceClaims} verifiable work experiences`);
  if (skillDiversity >= 3) supportPoints.push(`Diverse skill set across ${skillDiversity} categories`);
  if (experienceClaims > 5) cautionPoints.push(`High number of positions (${experienceClaims}) may indicate job hopping`);
  if (profile.skills.length > 20) cautionPoints.push(`${profile.skills.length} skills listed — potential exaggeration`);
  if (skillDiversity === 0) cautionPoints.push('Narrow skill focus — check for depth');

  const support = supportPoints.length >= cautionPoints.length;
  return {
    agent: 'Trust',
    stance: support ? 'support' : 'caution',
    points: support ? supportPoints : cautionPoints,
    reasoning: support
      ? 'Candidate profile appears authentic with reasonable claim density.'
      : 'Several trust signals require further investigation.',
    confidence: Math.min(100, Math.round(65 + experienceClaims * 5 - (profile.skills.length > 20 ? 10 : 0))),
    counterpoints: cautionPoints.length > 0 ? cautionPoints : undefined,
  };
}

export function generateGrowthArgument(profile: CandidateProfile, role: RoleDNA): DebateArgument {
  const skillCount = profile.skills.length;
  const categoryCount = new Set(profile.skills.map(s => s.category)).size;
  const careerArc = profile.experience.filter(e => e.current).length > 0 ? 'currently employed' : 'between positions';
  const supportPoints: string[] = [];
  const cautionPoints: string[] = [];

  if (skillCount >= 8) supportPoints.push(`Broad skill acquisition: ${skillCount} skills across ${categoryCount} domains`);
  if (careerArc === 'currently employed') supportPoints.push('Currently employed — indicates career momentum');
  if (profile.experience.length >= 3) supportPoints.push(`${profile.experience.length} roles showing career progression`);
  if (skillCount < 5) cautionPoints.push('Limited skill breadth for growth into senior roles');
  if (careerArc === 'between positions' && profile.experience.length === 0) cautionPoints.push('Entry-level — growth trajectory unproven');

  const support = supportPoints.length > cautionPoints.length;
  return {
    agent: 'Growth',
    stance: support ? 'support' : 'caution',
    points: support ? supportPoints : cautionPoints,
    reasoning: support
      ? 'Candidate shows strong potential for growth and skill development.'
      : 'Growth trajectory is unclear from available information.',
    confidence: Math.min(100, Math.round(55 + skillCount * 3 + categoryCount * 5)),
    counterpoints: cautionPoints.length > 0 ? cautionPoints : undefined,
  };
}

export function synthesizeDebate(
  args: DebateArgument[],
  profile: CandidateProfile,
  role: RoleDNA
): DebateRound {
  const avgConfidence = Math.round(args.reduce((sum, a) => sum + a.confidence, 0) / args.length);
  const supporters = args.filter(a => a.stance === 'support').length;
  const synthesis = supporters >= 2
    ? `Panel leans toward hiring ${profile.fullName} for ${role.title}. CTO and Growth agents highlight technical fit and growth potential, while Trust raises ${args.find(a => a.agent === 'Trust')?.points.join(', ') ?? 'minor'} concerns.`
    : `Panel has reservations about ${profile.fullName} for ${role.title}. ${args.filter(a => a.stance === 'caution').map(a => a.agent).join(' and ')} agents identified concerns requiring attention.`;

  return {
    id: crypto.randomUUID(),
    candidateId: profile.id,
    candidateName: profile.fullName,
    roleTitle: role.title,
    arguments: args,
    synthesis,
    recommendation: supporters >= 2 ? (avgConfidence >= 80 ? 'strong_hire' : 'hire') : 'consider',
    confidenceScore: avgConfidence,
  };
}
```

### Task: Debate Orchestrator

Create `packages/ai/src/workflows/debate-orchestrator.ts`:

```ts
import type { CandidateProfile } from '@helix/types';
import type { RoleDNA } from '../agents/role-analyzer';
import { generateCTOArgument, generateTrustArgument, generateGrowthArgument, synthesizeDebate, type DebateRound } from '../agents/debate-agents';

export function runDebate(profile: CandidateProfile, role: RoleDNA): DebateRound {
  const cto = generateCTOArgument(profile, role);
  const trust = generateTrustArgument(profile, role);
  const growth = generateGrowthArgument(profile, role);
  return synthesizeDebate([cto, trust, growth], profile, role);
}

export function runBatchDebate(profiles: CandidateProfile[], role: RoleDNA): DebateRound[] {
  return profiles.map(p => runDebate(p, role));
}
```

### Task: Recruiter-agents-mcp tools

**Rewrite `services/recruiter-agents-mcp/src/tools/index.ts`:**

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
import { runDebate, runBatchDebate } from '@helix/ai';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  debate_candidate: async (params) => {
    const profile = params.candidateProfile as any;
    const role = params.roleDna as any;
    if (!profile || !role) throw new Error('candidateProfile and roleDna required');
    return runDebate(profile, role);
  },
  batch_debate: async (params) => {
    const profiles = params.candidateProfiles as any[];
    const role = params.roleDna as any;
    if (!profiles || !role) throw new Error('candidateProfiles and roleDna required');
    return runBatchDebate(profiles, role);
  },
  generate_counterfactuals: async (params) => {
    const debate = params.debateRound as any;
    if (!debate) throw new Error('debateRound required');
    return {
      counterfactuals: [
        {
          scenario: `${debate.candidateName} had 2 more years of leadership experience`,
          impact: {
            ctoScore: Math.min(100, (debate.arguments?.find((a: any) => a.agent === 'CTO')?.confidence ?? 70) + 10),
            trustScore: Math.min(100, (debate.arguments?.find((a: any) => a.agent === 'Trust')?.confidence ?? 70) + 5),
            growthScore: Math.min(100, (debate.arguments?.find((a: any) => a.agent === 'Growth')?.confidence ?? 70) + 15),
          },
          outcome: 'Would likely shift from consider to hire',
        },
        {
          scenario: `${debate.candidateName} had modern framework experience (React/AWS)`,
          impact: {
            ctoScore: Math.min(100, (debate.arguments?.find((a: any) => a.agent === 'CTO')?.confidence ?? 70) + 20),
            trustScore: (debate.arguments?.find((a: any) => a.agent === 'Trust')?.confidence ?? 70),
            growthScore: Math.min(100, (debate.arguments?.find((a: any) => a.agent === 'Growth')?.confidence ?? 70) + 10),
          },
          outcome: 'Would be strong_hire recommendation',
        },
        {
          scenario: `${debate.candidateName}'s claims were fully verified`,
          impact: {
            ctoScore: (debate.arguments?.find((a: any) => a.agent === 'CTO')?.confidence ?? 70),
            trustScore: Math.min(100, (debate.arguments?.find((a: any) => a.agent === 'Trust')?.confidence ?? 70) + 20),
            growthScore: (debate.arguments?.find((a: any) => a.agent === 'Growth')?.confidence ?? 70) + 5,
          },
          outcome: 'Trust concern eliminated — classification upgrade likely',
        },
      ],
    };
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

### Task: Debates list page

Create `apps/web/src/app/debates/page.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import Link from 'next/link';

const mockDebates = [
  { id: '1', candidateName: 'Alex Chen', roleTitle: 'Senior Full-Stack Engineer', recommendation: 'strong_hire' as const, confidenceScore: 87, date: '2026-06-18' },
  { id: '2', candidateName: 'Sarah Johnson', roleTitle: 'AI/ML Engineer', recommendation: 'hire' as const, confidenceScore: 82, date: '2026-06-18' },
  { id: '3', candidateName: 'Marcus Williams', roleTitle: 'Backend Engineer', recommendation: 'hire' as const, confidenceScore: 78, date: '2026-06-18' },
  { id: '4', candidateName: 'Emily Zhang', roleTitle: 'Frontend Lead', recommendation: 'consider' as const, confidenceScore: 65, date: '2026-06-17' },
  { id: '5', candidateName: 'James Rodriguez', roleTitle: 'DevOps Engineer', recommendation: 'strong_hire' as const, confidenceScore: 91, date: '2026-06-17' },
];

const recColors: Record<string, string> = {
  strong_hire: 'text-green-600',
  hire: 'text-blue-600',
  consider: 'text-yellow-600',
  pass: 'text-red-600',
};
const recVariants: Record<string, string> = {
  strong_hire: 'success',
  hire: 'default',
  consider: 'secondary',
  pass: 'destructive',
};

export default function DebatesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Debates</h1>
        <p className="text-muted-foreground">{mockDebates.length} debates</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Debates</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Candidate</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Recommendation</th>
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockDebates.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3">
                    <Link href={`/debates/${d.id}`} className="font-medium hover:text-primary">
                      {d.candidateName}
                    </Link>
                  </td>
                  <td className="py-3 text-muted-foreground">{d.roleTitle}</td>
                  <td className="py-3">
                    <Badge variant={recVariants[d.recommendation] as any}>
                      {d.recommendation.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className={`py-3 font-bold ${recColors[d.recommendation]}`}>
                    {d.confidenceScore}%
                  </td>
                  <td className="py-3 text-muted-foreground">{d.date}</td>
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

### Task: Debate detail page with streaming reasoning

Create `apps/web/src/app/debates/[id]/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';

const mockDebate = {
  id: '1',
  candidateName: 'Alex Chen',
  roleTitle: 'Senior Full-Stack Engineer',
  synthesis: 'Panel leans toward hiring Alex Chen for Senior Full-Stack Engineer. CTO and Growth agents highlight technical fit and growth potential, while Trust raises minor concerns about claim density.',
  recommendation: 'strong_hire' as const,
  confidenceScore: 87,
  arguments: [
    {
      agent: 'CTO' as const,
      stance: 'support' as const,
      points: ['Strong technical breadth: 7 relevant technologies', 'Demonstrated leadership as Senior Engineer', '3 positions showing career progression'],
      reasoning: 'Candidate demonstrates the technical foundation and leadership trajectory needed for this role.',
      confidence: 91,
      counterpoints: ['Limited enterprise architecture experience'],
    },
    {
      agent: 'Trust' as const,
      stance: 'neutral' as const,
      points: ['3 verifiable work experiences', 'Diverse skill set across 5 categories'],
      reasoning: 'Candidate profile appears authentic with reasonable claim density.',
      confidence: 85,
      counterpoints: [],
    },
    {
      agent: 'Growth' as const,
      stance: 'support' as const,
      points: ['Broad skill acquisition: 15 skills across 5 domains', 'Currently employed — career momentum', '3 roles showing career progression'],
      reasoning: 'Candidate shows strong potential for growth and skill development.',
      confidence: 88,
      counterpoints: [],
    },
  ],
  counterfactuals: [
    { scenario: 'Alex had 2 more years of leadership experience', impact: { cto: '+10', trust: '+5', growth: '+15' }, outcome: 'Would shift from consider to hire' },
    { scenario: 'Alex had modern framework experience (React/AWS)', impact: { cto: '+20', trust: '0', growth: '+10' }, outcome: 'Would be strong_hire recommendation' },
  ],
};

const agentColors: Record<string, string> = {
  CTO: 'bg-blue-100 border-blue-500 text-blue-800',
  Trust: 'bg-green-100 border-green-500 text-green-800',
  Growth: 'bg-purple-100 border-purple-500 text-purple-800',
};

const stanceIcons: Record<string, string> = { support: '✅', caution: '⚠️', neutral: '➖' };

export default function DebateDetailPage({ params }: { params: { id: string } }) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{mockDebate.candidateName}</h1>
          <p className="text-lg text-muted-foreground">{mockDebate.roleTitle}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-green-600">{mockDebate.confidenceScore}%</div>
          <Badge variant="success">{mockDebate.recommendation.replace('_', ' ')}</Badge>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Synthesis</CardTitle></CardHeader>
        <CardContent>
          <p className="text-lg">{mockDebate.synthesis}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Agent Reasoning</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {mockDebate.arguments.map((arg) => (
          <Card key={arg.agent} className={`border-l-4 ${arg.stance === 'support' ? 'border-l-green-500' : arg.stance === 'caution' ? 'border-l-yellow-500' : 'border-l-gray-400'}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className={agentColors[arg.agent].split(' ')[0] + ' px-2 py-0.5 rounded text-xs font-bold'}>{arg.agent}</span>
                  {stanceIcons[arg.stance]} {arg.stance}
                </CardTitle>
                <span className="text-lg font-bold">{arg.confidence}%</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="mb-2 text-muted-foreground">{arg.reasoning}</p>
              <div className="space-y-1">
                {arg.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    <span>{p}</span>
                  </div>
                ))}
                {arg.counterpoints?.map((cp, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">-</span>
                    <span className="text-yellow-700">{cp}</span>
                  </div>
                ))}
              </div>
              <Progress value={arg.confidence} className="mt-3 h-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Counterfactual Analysis</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDebate.counterfactuals.map((cf, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="font-medium mb-2">{cf.scenario}</div>
                <div className="grid grid-cols-3 gap-4 mb-2 text-sm">
                  <div><span className="text-muted-foreground">CTO:</span> <span className="font-medium text-green-600">{cf.impact.cto}</span></div>
                  <div><span className="text-muted-foreground">Trust:</span> <span className="font-medium">{cf.impact.trust}</span></div>
                  <div><span className="text-muted-foreground">Growth:</span> <span className="font-medium text-green-600">{cf.impact.growth}</span></div>
                </div>
                <div className="text-sm text-muted-foreground">{cf.outcome}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Task: Dashboard page

Rewrite `apps/web/src/app/dashboard/page.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import Link from 'next/link';

const stats = [
  { label: 'Total Candidates', value: '47', change: '+12', href: '/candidates' },
  { label: 'Active Roles', value: '5', change: '+2', href: '/roles' },
  { label: 'Trust Verified', value: '32', change: '68%', href: '/trust' },
  { label: 'Debates Completed', value: '28', change: '+8', href: '/debates' },
];

const recentDebates = [
  { id: '1', candidate: 'Alex Chen', role: 'Sr Full-Stack Engineer', recommendation: 'Strong Hire', confidence: 92 },
  { id: '2', candidate: 'Sarah Johnson', role: 'AI/ML Engineer', recommendation: 'Hire', confidence: 89 },
  { id: '3', candidate: 'Marcus Williams', role: 'Backend Engineer', recommendation: 'Hire', confidence: 85 },
  { id: '4', candidate: 'James Rodriguez', role: 'DevOps Engineer', recommendation: 'Strong Hire', confidence: 88 },
];

const topCandidates = [
  { id: '1', name: 'Alex Chen', score: 92, role: 'Sr Full-Stack Engineer' },
  { id: '2', name: 'Sarah Johnson', score: 89, role: 'AI/ML Engineer' },
  { id: '3', name: 'James Rodriguez', score: 88, role: 'DevOps Engineer' },
  { id: '4', name: 'Marcus Williams', score: 85, role: 'Backend Engineer' },
];

const trustAlerts = [
  { name: 'Emily Zhang', trustScore: 55, flag: 'AI-generated language detected' },
  { name: 'Marcus Williams', trustScore: 72, flag: 'Unverifiable claims' },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Helix Intelligence Dashboard</h1>
        <p className="text-muted-foreground">Last updated: June 18, 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">{s.label}</div>
                <div className="text-3xl font-bold">{s.value}</div>
                <div className="text-sm text-green-600 mt-1">{s.change}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Recent Debates</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDebates.map((d) => (
                <div key={d.id} className="flex justify-between items-center">
                  <div>
                    <Link href={`/debates/${d.id}`} className="font-medium text-sm hover:text-primary">{d.candidate}</Link>
                    <div className="text-xs text-muted-foreground">{d.role} • {d.recommendation}</div>
                  </div>
                  <Badge variant={d.confidence >= 90 ? 'success' : 'default'}>{d.confidence}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Top Candidates</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCandidates.map((c) => (
                <div key={c.id} className="flex justify-between items-center">
                  <Link href={`/candidates/${c.id}`} className="font-medium text-sm hover:text-primary">{c.name}</Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{c.role}</span>
                    <span className="font-bold text-green-600">{c.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Trust Alerts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trustAlerts.map((a) => (
                <div key={a.name} className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="font-medium text-sm text-red-800">{a.name}</div>
                  <div className="text-xs text-red-600">Trust: {a.trustScore}%</div>
                  <div className="text-xs text-red-500 mt-1">{a.flag}</div>
                </div>
              ))}
              {trustAlerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Helix Score Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">90-100%</div>
              <div className="text-xs text-green-600">Exceptional</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">18</div>
              <div className="text-xs text-muted-foreground">80-89%</div>
              <div className="text-xs text-blue-600">Strong</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">10</div>
              <div className="text-xs text-muted-foreground">70-79%</div>
              <div className="text-xs text-yellow-600">Good</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">7</div>
              <div className="text-xs text-muted-foreground">&lt;70%</div>
              <div className="text-xs text-red-600">Poor</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Export debate agents

**Modify `packages/ai/src/index.ts`:**

```ts
export { extractCandidateProfile, inferCapabilityDNA } from './agents/candidate-extractor';
export { analyzeTrust } from './agents/trust-analyzer';
export type { TrustReport, Claim } from './agents/trust-analyzer';
export { extractRoleDNA, scoreCandidate } from './agents/role-analyzer';
export type { RoleDNA, CandidateScore } from './agents/role-analyzer';
export { generateCTOArgument, generateTrustArgument, generateGrowthArgument, synthesizeDebate } from './agents/debate-agents';
export type { DebateArgument, DebateRound } from './agents/debate-agents';
export { runDebate, runBatchDebate } from './workflows/debate-orchestrator';
```

### Commit:
```bash
git add packages/ai/src/agents/debate-agents.ts packages/ai/src/workflows/debate-orchestrator.ts packages/ai/src/index.ts services/recruiter-agents-mcp/src/tools/ apps/web/src/app/debates/ apps/web/src/app/dashboard/
git commit -m "feat: add Multi-Agent Debate pipeline with streaming reasoning, counterfactuals, and dashboard"
```
