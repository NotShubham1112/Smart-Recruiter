'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@helix/ui';
import { Badge } from '@helix/ui';
import { Progress } from '@helix/ui';
import { Button } from '@helix/ui';

interface RequiredSkill {
  name: string;
  weight: number;
}

interface RoleDNA {
  roleId: string;
  title: string;
  description: string;
  requiredSkills: RequiredSkill[];
  preferredSkills: RequiredSkill[];
  experienceYears: number;
  seniorityLevel: string;
  capabilityThresholds: {
    technicalDepth: number;
    learningVelocity: number;
    ownership: number;
    adaptability: number;
    leadership: number;
    communication: number;
  };
}

interface CandidateScore {
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
  strengths: string[];
  concerns: string[];
}

const seniorityColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'> = {
  junior: 'secondary',
  mid: 'default',
  senior: 'warning',
  lead: 'destructive',
  principal: 'destructive',
};

function getScoreBadgeVariant(score: number): 'success' | 'warning' | 'destructive' | 'default' {
  if (score >= 85) return 'success';
  if (score >= 75) return 'warning';
  if (score >= 60) return 'destructive';
  return 'default';
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

const mockRoles: Record<string, RoleDNA & { department: string }> = {
  r1: {
    roleId: 'r1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    description: 'We are looking for a Senior Frontend Engineer to build and maintain our React-based web application. You will work closely with designers and backend engineers to deliver exceptional user experiences.',
    requiredSkills: [
      { name: 'React', weight: 1.0 },
      { name: 'TypeScript', weight: 1.0 },
      { name: 'CSS', weight: 0.8 },
      { name: 'Next.js', weight: 0.7 },
      { name: 'Testing', weight: 0.6 },
    ],
    preferredSkills: [
      { name: 'GraphQL', weight: 0.5 },
      { name: 'Storybook', weight: 0.4 },
    ],
    experienceYears: 5,
    seniorityLevel: 'senior',
    capabilityThresholds: { technicalDepth: 80, learningVelocity: 70, ownership: 80, adaptability: 70, leadership: 60, communication: 65 },
  },
  r2: {
    roleId: 'r2',
    title: 'Backend Developer',
    department: 'Engineering',
    description: 'Build and maintain scalable microservices and APIs powering our platform.',
    requiredSkills: [
      { name: 'Node.js', weight: 1.0 },
      { name: 'PostgreSQL', weight: 0.9 },
      { name: 'REST APIs', weight: 0.9 },
      { name: 'Docker', weight: 0.7 },
    ],
    preferredSkills: [
      { name: 'Kubernetes', weight: 0.5 },
      { name: 'Redis', weight: 0.4 },
    ],
    experienceYears: 3,
    seniorityLevel: 'mid',
    capabilityThresholds: { technicalDepth: 70, learningVelocity: 65, ownership: 70, adaptability: 65, leadership: 50, communication: 60 },
  },
  r3: {
    roleId: 'r3',
    title: 'Product Designer',
    department: 'Design',
    description: 'Design intuitive and accessible user interfaces for our recruitment platform.',
    requiredSkills: [
      { name: 'Figma', weight: 1.0 },
      { name: 'UI Design', weight: 1.0 },
      { name: 'UX Research', weight: 0.8 },
      { name: 'Prototyping', weight: 0.7 },
    ],
    preferredSkills: [
      { name: 'Motion Design', weight: 0.5 },
    ],
    experienceYears: 3,
    seniorityLevel: 'mid',
    capabilityThresholds: { technicalDepth: 65, learningVelocity: 70, ownership: 65, adaptability: 70, leadership: 50, communication: 75 },
  },
  r4: {
    roleId: 'r4',
    title: 'Data Scientist',
    department: 'Data',
    description: 'Apply machine learning and statistical modeling to improve hiring predictions and candidate matching.',
    requiredSkills: [
      { name: 'Python', weight: 1.0 },
      { name: 'Machine Learning', weight: 1.0 },
      { name: 'SQL', weight: 0.8 },
      { name: 'Statistics', weight: 0.8 },
      { name: 'TensorFlow', weight: 0.6 },
    ],
    preferredSkills: [
      { name: 'NLP', weight: 0.5 },
      { name: 'LLMs', weight: 0.5 },
    ],
    experienceYears: 4,
    seniorityLevel: 'mid',
    capabilityThresholds: { technicalDepth: 85, learningVelocity: 75, ownership: 70, adaptability: 70, leadership: 55, communication: 60 },
  },
  r5: {
    roleId: 'r5',
    title: 'Engineering Manager',
    department: 'Engineering',
    description: 'Lead a team of 4-6 engineers, drive technical strategy, and foster a culture of excellence.',
    requiredSkills: [
      { name: 'Team Leadership', weight: 1.0 },
      { name: 'Technical Strategy', weight: 0.9 },
      { name: 'Code Review', weight: 0.7 },
      { name: 'Agile', weight: 0.7 },
    ],
    preferredSkills: [
      { name: 'System Design', weight: 0.5 },
    ],
    experienceYears: 8,
    seniorityLevel: 'lead',
    capabilityThresholds: { technicalDepth: 75, learningVelocity: 70, ownership: 85, adaptability: 75, leadership: 85, communication: 80 },
  },
};

function generateMockScores(roleId: string): CandidateScore[] {
  const baseScores: Record<string, CandidateScore[]> = {
    r1: [
      { candidateId: 'c1', name: 'Alice Chen', helixScore: 92, capabilityMatch: 88, trustScore: 95, successPrediction: 94, growthPotential: 85, confidenceScore: 90, breakdown: { technicalFit: 95, experienceFit: 90, skillOverlap: 100, seniorityFit: 100 }, strengths: ['React', 'TypeScript', 'System Design'], concerns: ['No GraphQL experience'] },
      { candidateId: 'c2', name: 'Bob Martinez', helixScore: 84, capabilityMatch: 80, trustScore: 88, successPrediction: 82, growthPotential: 78, confidenceScore: 85, breakdown: { technicalFit: 85, experienceFit: 75, skillOverlap: 80, seniorityFit: 100 }, strengths: ['React', 'CSS', 'Testing'], concerns: ['Limited Next.js experience'] },
      { candidateId: 'c3', name: 'Carol Wang', helixScore: 76, capabilityMatch: 72, trustScore: 80, successPrediction: 74, growthPotential: 82, confidenceScore: 78, breakdown: { technicalFit: 70, experienceFit: 80, skillOverlap: 60, seniorityFit: 75 }, strengths: ['Vue.js', 'TypeScript'], concerns: ['Primarily Vue.js background', 'No Next.js'] },
      { candidateId: 'c4', name: 'David Kim', helixScore: 68, capabilityMatch: 65, trustScore: 72, successPrediction: 66, growthPotential: 70, confidenceScore: 68, breakdown: { technicalFit: 60, experienceFit: 60, skillOverlap: 60, seniorityFit: 75 }, strengths: ['CSS', 'Testing'], concerns: ['Less senior experience', 'Missing React depth'] },
      { candidateId: 'c5', name: 'Eve Johnson', helixScore: 91, capabilityMatch: 85, trustScore: 93, successPrediction: 92, growthPotential: 88, confidenceScore: 89, breakdown: { technicalFit: 90, experienceFit: 95, skillOverlap: 100, seniorityFit: 100 }, strengths: ['React', 'Next.js', 'GraphQL', 'System Design'], concerns: [] },
    ],
    r2: [
      { candidateId: 'c6', name: 'Frank Lee', helixScore: 87, capabilityMatch: 82, trustScore: 90, successPrediction: 85, growthPotential: 80, confidenceScore: 86, breakdown: { technicalFit: 88, experienceFit: 85, skillOverlap: 75, seniorityFit: 75 }, strengths: ['Node.js', 'PostgreSQL', 'REST APIs'], concerns: ['No Docker experience'] },
      { candidateId: 'c7', name: 'Grace Patel', helixScore: 80, capabilityMatch: 76, trustScore: 84, successPrediction: 78, growthPotential: 82, confidenceScore: 80, breakdown: { technicalFit: 75, experienceFit: 80, skillOverlap: 75, seniorityFit: 75 }, strengths: ['Node.js', 'PostgreSQL'], concerns: ['Limited API design experience'] },
      { candidateId: 'c8', name: 'Henry Brown', helixScore: 73, capabilityMatch: 70, trustScore: 76, successPrediction: 71, growthPotential: 75, confidenceScore: 72, breakdown: { technicalFit: 65, experienceFit: 70, skillOverlap: 50, seniorityFit: 75 }, strengths: ['Python', 'PostgreSQL'], concerns: ['Primary language is Python'] },
    ],
  };
  return baseScores[roleId] ?? [
    { candidateId: 'c9', name: 'Iris Chang', helixScore: 78, capabilityMatch: 74, trustScore: 82, successPrediction: 76, growthPotential: 80, confidenceScore: 76, breakdown: { technicalFit: 75, experienceFit: 80, skillOverlap: 75, seniorityFit: 75 }, strengths: ['Team Leadership', 'Agile'], concerns: [] },
    { candidateId: 'c10', name: 'Jack Wilson', helixScore: 70, capabilityMatch: 68, trustScore: 74, successPrediction: 68, growthPotential: 72, confidenceScore: 70, breakdown: { technicalFit: 65, experienceFit: 70, skillOverlap: 50, seniorityFit: 50 }, strengths: ['Leadership'], concerns: ['Missing technical depth'] },
  ];
}

function getRole(roleId: string): RoleDNA & { department: string } {
  return (mockRoles[roleId] ?? mockRoles.r1)!;
}

export default function RoleDetailPage() {
  const params = useParams();
  const roleId = params?.id as string ?? 'r1';
  const role = getRole(roleId);
  const scores = generateMockScores(roleId).sort((a, b) => b.helixScore - a.helixScore);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/roles">
          <Button variant="outline" size="sm">&larr; Back to Roles</Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold">{role.title}</h1>
        <Badge variant={seniorityColors[role.seniorityLevel] ?? 'default'}>{role.seniorityLevel}</Badge>
      </div>
      <p className="text-muted-foreground mb-1">{role.department} &middot; {role.experienceYears}+ years experience</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role DNA</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {role.requiredSkills.map((s) => (
                    <Badge key={s.name} variant="default">{s.name}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Preferred Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {role.preferredSkills.map((s) => (
                    <Badge key={s.name} variant="outline">{s.name}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capability Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(role.capabilityThresholds).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold">Ranked Candidates</h2>
          {scores.map((candidate, index) => (
            <Card key={candidate.candidateId}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Match: {candidate.capabilityMatch}% &middot; Trust: {candidate.trustScore}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      <Badge variant={getScoreBadgeVariant(candidate.helixScore)} className="text-base px-3 py-1">
                        {candidate.helixScore}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Helix Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                  {[
                    { label: 'Technical Fit', value: candidate.breakdown.technicalFit },
                    { label: 'Experience Fit', value: candidate.breakdown.experienceFit },
                    { label: 'Skill Overlap', value: candidate.breakdown.skillOverlap },
                    { label: 'Seniority Fit', value: candidate.breakdown.seniorityFit },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{bar.label}</span>
                        <span className="font-mono">{bar.value}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-primary/20">
                        <div
                          className={`h-full rounded-full ${getScoreBarColor(bar.value)}`}
                          style={{ width: `${bar.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {candidate.strengths.map((s) => (
                    <Badge key={s} variant="success">{s}</Badge>
                  ))}
                  {candidate.concerns.map((c) => (
                    <Badge key={c} variant="destructive">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
