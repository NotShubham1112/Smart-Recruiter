# Phase 1: Candidate Digital Twin Implementation Plan

> For agentic workers: Build the Candidate Digital Twin pipeline.

**Goal:** Transform raw resume text into structured CandidateDNA with capability scores (technicalDepth, learningVelocity, ownership, adaptability, leadership, communication).

**Architecture:** packages/ai agents → candidate-intelligence-mcp tools → apps/web candidate detail page with radar chart.

## File Changes

- Create: `packages/ai/src/agents/candidate-extractor.ts`
- Create: `packages/ai/src/workflows/twin-generation.ts`
- Modify: `services/candidate-intelligence-mcp/src/tools/parse-resume.ts`
- Modify: `services/candidate-intelligence-mcp/src/tools/build-dna.ts`
- Modify: `services/candidate-intelligence-mcp/src/tools/index.ts`
- Create: `apps/web/src/app/candidates/[id]/page.tsx`
- Modify: `apps/web/src/app/candidates/page.tsx`

---

### Task: Candidate Extractor Agent

Create `packages/ai/src/agents/candidate-extractor.ts`:

```ts
import type { CandidateProfile, WorkExperience, Education, Skill, Certification, Project } from '@helix/types';

export interface ParsedResume {
  profile: CandidateProfile;
  rawText: string;
}

export function extractCandidateProfile(text: string): CandidateProfile {
  const lines = text.split('\n').filter(l => l.trim());
  const profile: CandidateProfile = {
    id: crypto.randomUUID(),
    fullName: extractName(lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    summary: extractSummary(lines),
    experience: extractExperience(lines),
    education: extractEducation(lines),
    skills: extractSkills(lines),
    certifications: extractCertifications(lines),
    projects: extractProjects(lines),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return profile;
}

export function inferCapabilityDNA(profile: CandidateProfile): {
  technicalDepth: number;
  learningVelocity: number;
  ownership: number;
  adaptability: number;
  leadership: number;
  communication: number;
} {
  const techScore = scoreTechnicalDepth(profile);
  const learningScore = scoreLearningVelocity(profile);
  const ownershipScore = scoreOwnership(profile);
  const adaptabilityScore = scoreAdaptability(profile);
  const leadershipScore = scoreLeadership(profile);
  const commScore = scoreCommunication(profile);
  return {
    technicalDepth: techScore,
    learningVelocity: learningScore,
    ownership: ownershipScore,
    adaptability: adaptabilityScore,
    leadership: leadershipScore,
    communication: commScore,
  };
}

function extractName(lines: string[]): string {
  return lines[0] ?? 'Unknown';
}

function extractEmail(text: string): string {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match?.[0] ?? '';
}

function extractPhone(text: string): string {
  const match = text.match(/[\+]?[\d\(\)\-\s]{7,20}/);
  return match?.[0]?.trim() ?? '';
}

function extractSummary(lines: string[]): string | undefined {
  const idx = lines.findIndex(l => /summary|about|profile/i.test(l));
  return idx >= 0 && idx + 1 < lines.length ? lines[idx + 1] : undefined;
}

function extractExperience(lines: string[]): WorkExperience[] {
  const exp: WorkExperience[] = [];
  let inSection = false;
  let current: Partial<WorkExperience> | null = null;
  for (const line of lines) {
    if (/experience|work history|employment/i.test(line) && !inSection) { inSection = true; continue; }
    if (/education|skills|projects|certifications/i.test(line) && inSection) { inSection = false; continue; }
    if (!inSection) continue;
    const titleMatch = line.match(/^(.+?)\s+(at|@|-)\s+(.+?)$/);
    if (titleMatch) {
      if (current) exp.push(current as WorkExperience);
      current = {
        id: crypto.randomUUID(),
        company: titleMatch[3].trim(),
        title: titleMatch[1].trim(),
        startDate: '',
        current: false,
        description: '',
        highlights: [],
        technologies: [],
      };
    }
  }
  if (current) exp.push(current as WorkExperience);
  return exp;
}

function extractEducation(lines: string[]): Education[] {
  const edu: Education[] = [];
  let inSection = false;
  for (const line of lines) {
    if (/education|academic/i.test(line) && !inSection) { inSection = true; continue; }
    if (/experience|skills|projects/i.test(line) && inSection) { inSection = false; continue; }
    if (!inSection) continue;
    if (/(Bachelor|Master|PhD|B\.|M\.|BSc|MSc|BA|MA)/i.test(line)) {
      edu.push({
        id: crypto.randomUUID(),
        institution: line.split(',').pop()?.trim() ?? line,
        degree: line,
        field: line,
        startDate: '',
      });
    }
  }
  return edu;
}

function extractSkills(lines: string[]): Skill[] {
  const skills: Skill[] = [];
  let inSection = false;
  for (const line of lines) {
    if (/skills|technologies|competencies/i.test(line) && !inSection) { inSection = true; continue; }
    if (/education|experience|projects/i.test(line) && inSection) { inSection = false; continue; }
    if (!inSection) continue;
    const parts = line.split(/[,|•\-\/]/).map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const category = inferCategory(part);
      skills.push({ name: part, category, proficiency: 50 });
    }
  }
  return skills;
}

function inferCategory(skill: string): Skill['category'] {
  const lower = skill.toLowerCase();
  if (['python', 'javascript', 'typescript', 'java', 'go', 'rust', 'c++', 'ruby', 'swift', 'kotlin'].includes(lower)) return 'language';
  if (['react', 'angular', 'vue', 'django', 'flask', 'express', 'spring', 'next.js', 'node.js', 'fastify'].includes(lower)) return 'framework';
  if (['postgresql', 'mysql', 'mongodb', 'redis', 'neo4j', 'qdrant', 'elasticsearch'].includes(lower)) return 'database';
  if (['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ci/cd'].includes(lower)) return 'cloud';
  if (['git', 'jira', 'figma', 'vscode'].includes(lower)) return 'tool';
  return 'domain';
}

function extractCertifications(lines: string[]): Certification[] {
  return [];
}

function extractProjects(lines: string[]): Project[] {
  return [];
}

function scoreTechnicalDepth(profile: CandidateProfile): number {
  const skillCount = profile.skills.length;
  const techSkillCount = profile.skills.filter(s => ['language', 'framework', 'database', 'cloud'].includes(s.category)).length;
  const expYears = profile.experience.length;
  return Math.min(100, Math.round(skillCount * 5 + techSkillCount * 3 + expYears * 8));
}

function scoreLearningVelocity(profile: CandidateProfile): number {
  const skillCount = profile.skills.length;
  const diverseCategories = new Set(profile.skills.map(s => s.category)).size;
  return Math.min(100, Math.round(skillCount * 4 + diverseCategories * 10));
}

function scoreOwnership(profile: CandidateProfile): number {
  const hasLeadership = profile.experience.some(e => /lead|senior|head|chief|principal/i.test(e.title));
  const projectCount = profile.projects.length;
  return Math.min(100, Math.round((hasLeadership ? 30 : 0) + projectCount * 10 + profile.experience.length * 5));
}

function scoreAdaptability(profile: CandidateProfile): number {
  const diverseCategories = new Set(profile.skills.map(s => s.category)).size;
  const companyCount = new Set(profile.experience.map(e => e.company)).size;
  return Math.min(100, Math.round(diverseCategories * 12 + companyCount * 10));
}

function scoreLeadership(profile: CandidateProfile): number {
  const leadTitles = profile.experience.filter(e => /lead|head|chief|principal|manager|director|founder|cto|vp/i.test(e.title)).length;
  return Math.min(100, Math.round(leadTitles * 20 + (profile.experience.length > 5 ? 10 : 0)));
}

function scoreCommunication(profile: CandidateProfile): number {
  const summaryLen = profile.summary?.length ?? 0;
  return Math.min(100, Math.round(Math.min(summaryLen / 10, 50) + profile.experience.length * 5));
}
```

### Task: Update candidate-intelligence-mcp tools

**Modify `src/tools/index.ts`** to use the real extractor:

```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
import { extractCandidateProfile, inferCapabilityDNA } from '@helix/ai';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_resume: async (params) => {
    const text = params.resumeText as string;
    if (!text) throw new Error('resumeText required');
    return extractCandidateProfile(text);
  },
  extract_capabilities: async (params) => {
    const profile = params.profile as any;
    return inferCapabilityDNA(profile);
  },
  build_candidate_dna: async (params) => {
    const text = params.resumeText as string;
    const profile = extractCandidateProfile(text);
    const dna = inferCapabilityDNA(profile);
    return { candidateId: profile.id, ...dna, confidenceScore: 75 };
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

### Task: Candidate detail page with radar chart

**Create `apps/web/src/app/candidates/[id]/page.tsx`:**

```tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const mockCandidate = {
  id: '1',
  name: 'Alex Chen',
  title: 'Senior Full-Stack Engineer',
  helixScore: 92,
  trustScore: 89,
  successProbability: 91,
  growthPotential: 94,
  riskLevel: 'Low',
  dna: {
    technicalDepth: 91,
    learningVelocity: 94,
    ownership: 87,
    adaptability: 92,
    leadership: 74,
    communication: 80,
  },
  strengths: ['System Architecture', 'Team Leadership', 'Rapid Prototyping'],
  concerns: ['Enterprise Experience'],
  summary: '7 years of experience building scalable systems. Led teams of 5+ engineers.',
  experience: [
    { company: 'TechCorp', title: 'Senior Engineer', period: '2021-Present' },
    { company: 'StartupX', title: 'Full-Stack Engineer', period: '2019-2021' },
  ],
  skills: ['TypeScript', 'React', 'Python', 'AWS', 'PostgreSQL', 'Docker'],
};

const radarData = [
  { dimension: 'Technical Depth', value: mockCandidate.dna.technicalDepth },
  { dimension: 'Learning Velocity', value: mockCandidate.dna.learningVelocity },
  { dimension: 'Ownership', value: mockCandidate.dna.ownership },
  { dimension: 'Adaptability', value: mockCandidate.dna.adaptability },
  { dimension: 'Leadership', value: mockCandidate.dna.leadership },
  { dimension: 'Communication', value: mockCandidate.dna.communication },
];

export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{mockCandidate.name}</h1>
          <p className="text-xl text-muted-foreground">{mockCandidate.title}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-primary">{mockCandidate.helixScore}%</div>
          <p className="text-sm text-muted-foreground">Helix Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Trust Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockCandidate.trustScore}</div>
            <Badge variant="success">Verified</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Success Probability</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockCandidate.successProbability}%</div>
            <Progress value={mockCandidate.successProbability} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Risk Level</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mockCandidate.riskLevel}</div>
            <p className="text-sm text-muted-foreground">Growth: {mockCandidate.growthPotential}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle>Capability DNA</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Candidate" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Strengths</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCandidate.strengths.map((s) => <Badge key={s} variant="success">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Concerns</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCandidate.concerns.map((c) => <Badge key={c} variant="warning">{c}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Work History</CardTitle></CardHeader>
            <CardContent>
              {mockCandidate.experience.map((exp) => (
                <div key={exp.company} className="mb-2">
                  <div className="font-medium">{exp.title}</div>
                  <div className="text-sm text-muted-foreground">{exp.company} • {exp.period}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Skills</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCandidate.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### Task: Update candidates list page

**Modify `apps/web/src/app/candidates/page.tsx`** — add a table with scores:

```tsx
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import Link from 'next/link';

const mockCandidates = [
  { id: '1', name: 'Alex Chen', title: 'Senior Full-Stack Engineer', helixScore: 92, trustScore: 89, match: 94 },
  { id: '2', name: 'Sarah Johnson', title: 'AI/ML Engineer', helixScore: 89, trustScore: 85, match: 91 },
  { id: '3', name: 'Marcus Williams', title: 'Backend Engineer', helixScore: 85, trustScore: 91, match: 87 },
  { id: '4', name: 'Emily Zhang', title: 'Frontend Lead', helixScore: 78, trustScore: 72, match: 81 },
  { id: '5', name: 'James Rodriguez', title: 'DevOps Engineer', helixScore: 88, trustScore: 93, match: 85 },
];

export default function CandidatesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidate Explorer</h1>
        <p className="text-muted-foreground">{mockCandidates.length} candidates analyzed</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Candidates</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium text-right">Helix Score</th>
                <th className="pb-3 font-medium text-right">Trust Score</th>
                <th className="pb-3 font-medium text-right">Match</th>
              </tr>
            </thead>
            <tbody>
              {mockCandidates.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3">
                    <Link href={`/candidates/${c.id}`} className="font-medium hover:text-primary">
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-3 text-muted-foreground">{c.title}</td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${c.helixScore >= 85 ? 'text-green-600' : c.helixScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {c.helixScore}%
                    </span>
                  </td>
                  <td className="py-3 text-right">{c.trustScore}</td>
                  <td className="py-3 text-right">{c.match}%</td>
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

### Export agent from packages/ai

**Modify `packages/ai/src/index.ts`** — add exports:

```ts
export { extractCandidateProfile, inferCapabilityDNA } from './agents/candidate-extractor';
```

### Commit:
```bash
git add packages/ai/src/agents/candidate-extractor.ts packages/ai/src/index.ts services/candidate-intelligence-mcp/src/tools/ apps/web/src/app/candidates/
git commit -m "feat: add Candidate Digital Twin pipeline with DNA extraction and radar chart UI"
```
