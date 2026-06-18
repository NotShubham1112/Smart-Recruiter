'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface MockDNA {
  technicalDepth: number;
  learningVelocity: number;
  ownership: number;
  adaptability: number;
  leadership: number;
  communication: number;
}

interface MockExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface MockCandidate {
  id: string;
  fullName: string;
  title: string;
  dna: MockDNA;
  trustScore: number;
  successProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  strengths: string[];
  concerns: string[];
  experience: MockExperience[];
  skills: string[];
}

const mockData: Record<string, MockCandidate> = {
  c1: {
    id: 'c1',
    fullName: 'Alice Chen',
    title: 'Senior Frontend Engineer',
    dna: { technicalDepth: 92, learningVelocity: 85, ownership: 78, adaptability: 80, leadership: 65, communication: 88 },
    trustScore: 88,
    successProbability: 85,
    riskLevel: 'Low',
    strengths: ['React/Next.js expertise', 'Strong system design', 'Team collaboration'],
    concerns: ['Limited cloud experience', 'No management background'],
    experience: [
      { title: 'Senior Frontend Engineer', company: 'TechCorp', period: '2021 - Present', description: 'Led migration from Angular to React, improving page load times by 40%.' },
      { title: 'Frontend Developer', company: 'StartupXYZ', period: '2019 - 2021', description: 'Built customer-facing dashboard with real-time data visualization.' },
      { title: 'Junior Developer', company: 'WebAgency', period: '2017 - 2019', description: 'Developed responsive web applications for diverse clients.' },
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Node.js', 'GraphQL', 'Jest', 'Git'],
  },
};

const radarData = [
  { dimension: 'Technical Depth', value: 92 },
  { dimension: 'Learning Velocity', value: 85 },
  { dimension: 'Ownership', value: 78 },
  { dimension: 'Adaptability', value: 80 },
  { dimension: 'Leadership', value: 65 },
  { dimension: 'Communication', value: 88 },
];

function RiskBadge({ level }: { level: string }) {
  const variant = level === 'Low' ? 'success' : level === 'Medium' ? 'warning' : 'destructive';
  return <Badge variant={variant}>{level} Risk</Badge>;
}

function HelixScoreDisplay({ score }: { score: number }) {
  const color =
    score >= 85 ? 'text-green-500' : score >= 75 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className="text-center">
      <div className={`text-5xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-muted-foreground mt-1">Helix Score</div>
    </div>
  );
}

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const candidate = mockData[id] ?? mockData['c1']!;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/candidates" className="hover:text-primary">Candidates</Link>
        <span>/</span>
        <span className="text-foreground">{candidate.fullName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <HelixScoreDisplay score={candidate.dna.technicalDepth} />
            <div className="text-center">
              <h2 className="text-xl font-bold">{candidate.fullName}</h2>
              <p className="text-sm text-muted-foreground">{candidate.title}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Trust Score</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{candidate.trustScore}</div>
              <Progress value={candidate.trustScore} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Success Probability</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{candidate.successProbability}%</div>
              <Progress value={candidate.successProbability} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Risk Level</CardTitle></CardHeader>
            <CardContent>
              <RiskBadge level={candidate.riskLevel} />
              <p className="text-xs text-muted-foreground mt-2">Based on capability & trust analysis</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Capability Radar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Candidate" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Strengths</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {candidate.strengths.map((s) => (
                <Badge key={s} variant="success">{s}</Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Concerns</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {candidate.concerns.map((c) => (
                <Badge key={c} variant="warning">{c}</Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Work History</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {candidate.experience.map((exp) => (
            <div key={`${exp.company}-${exp.title}`} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <span className="text-sm text-muted-foreground">{exp.period}</span>
              </div>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
