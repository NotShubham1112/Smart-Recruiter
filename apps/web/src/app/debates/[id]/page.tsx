'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';

interface DebateData {
  id: string;
  candidateName: string;
  roleTitle: string;
  recommendation: string;
  confidenceScore: number;
  synthesis: string;
  arguments: {
    agent: string;
    stance: string;
    confidence: number;
    reasoning: string;
    points: string[];
    counterpoints?: string[];
  }[];
  counterfactuals: {
    scenario: string;
    agentAdjustments: Record<string, number>;
    outcome: string;
  }[];
}

const mockDebates: Record<string, DebateData> = {
  d1: {
    id: 'd1',
    candidateName: 'Alice Chen',
    roleTitle: 'Senior Frontend Engineer',
    recommendation: 'strong_hire',
    confidenceScore: 92,
    synthesis: 'Panel leans toward hiring Alice Chen for Senior Frontend Engineer. Majority of agents see favorable signals with 92% average confidence.',
    arguments: [
      { agent: 'CTO', stance: 'support', confidence: 95, reasoning: 'Candidate demonstrates strong technical and leadership profile', points: ['Strong technical foundation with 8 technical skills', 'Demonstrated leadership experience (2 leadership roles)', 'Substantial career experience with 5 positions'], counterpoints: [] },
      { agent: 'Trust', stance: 'support', confidence: 88, reasoning: 'Candidate profile appears consistent and verifiable', points: ['Multiple experience entries (5) can be cross-referenced', 'Broad skill diversity across 4 categories suggests well-rounded profile'], counterpoints: [] },
      { agent: 'Growth', stance: 'support', confidence: 93, reasoning: 'Candidate shows strong growth trajectory and skill breadth', points: ['Strong skill set with 12 skills across 4 categories', 'Currently employed, indicating stable career trajectory', 'Progressive career growth with 5 positions'], counterpoints: [] },
    ],
    counterfactuals: [
      { scenario: 'Alice Chen had 2 more years of leadership experience', agentAdjustments: { CTO: 10, Trust: 5, Growth: 15 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'Alice Chen had modern framework experience', agentAdjustments: { CTO: 20, Trust: 0, Growth: 10 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: "Alice Chen's claims were fully verified", agentAdjustments: { CTO: 0, Trust: 20, Growth: 5 }, outcome: 'Trust concern eliminated' },
    ],
  },
  d2: {
    id: 'd2',
    candidateName: 'Bob Martinez',
    roleTitle: 'Backend Developer',
    recommendation: 'hire',
    confidenceScore: 78,
    synthesis: 'Panel leans toward hiring Bob Martinez for Backend Developer. Majority of agents see favorable signals with 78% average confidence.',
    arguments: [
      { agent: 'CTO', stance: 'support', confidence: 80, reasoning: 'Candidate demonstrates strong technical and leadership profile', points: ['Strong technical foundation with 6 technical skills', 'Substantial career experience with 3 positions'], counterpoints: ['Limited leadership experience'] },
      { agent: 'Trust', stance: 'neutral', confidence: 75, reasoning: 'Trust signals are mixed; manual verification recommended', points: [], counterpoints: ['High number of experience claims (6) requires thorough verification'] },
      { agent: 'Growth', stance: 'support', confidence: 79, reasoning: 'Candidate shows strong growth trajectory and skill breadth', points: ['Strong skill set with 9 skills across 3 categories', 'Currently employed, indicating stable career trajectory'], counterpoints: [] },
    ],
    counterfactuals: [
      { scenario: 'Bob Martinez had 2 more years of leadership experience', agentAdjustments: { CTO: 10, Trust: 5, Growth: 15 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'Bob Martinez had modern framework experience', agentAdjustments: { CTO: 20, Trust: 0, Growth: 10 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: "Bob Martinez's claims were fully verified", agentAdjustments: { CTO: 0, Trust: 20, Growth: 5 }, outcome: 'Trust concern eliminated' },
    ],
  },
  d3: {
    id: 'd3',
    candidateName: 'Carol Smith',
    roleTitle: 'Product Manager',
    recommendation: 'consider',
    confidenceScore: 62,
    synthesis: 'Panel has reservations about Carol Smith for Product Manager. Insufficient positive signals across agent panel (62% confidence).',
    arguments: [
      { agent: 'CTO', stance: 'caution', confidence: 55, reasoning: 'Candidate lacks sufficient technical depth or experience for this role', points: ['Limited technical skills (2) for a technical leadership role'], counterpoints: [] },
      { agent: 'Trust', stance: 'neutral', confidence: 65, reasoning: 'Trust signals are mixed; manual verification recommended', points: [], counterpoints: [] },
      { agent: 'Growth', stance: 'neutral', confidence: 66, reasoning: 'Growth signals are inconclusive', points: [], counterpoints: ['Limited skill breadth (4) may hinder growth potential'] },
    ],
    counterfactuals: [
      { scenario: 'Carol Smith had 2 more years of leadership experience', agentAdjustments: { CTO: 10, Trust: 5, Growth: 15 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'Carol Smith had modern framework experience', agentAdjustments: { CTO: 20, Trust: 0, Growth: 10 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: "Carol Smith's claims were fully verified", agentAdjustments: { CTO: 0, Trust: 20, Growth: 5 }, outcome: 'Trust concern eliminated' },
    ],
  },
  d4: {
    id: 'd4',
    candidateName: 'David Kim',
    roleTitle: 'DevOps Engineer',
    recommendation: 'hire',
    confidenceScore: 84,
    synthesis: 'Panel leans toward hiring David Kim for DevOps Engineer. Majority of agents see favorable signals with 84% average confidence.',
    arguments: [
      { agent: 'CTO', stance: 'support', confidence: 90, reasoning: 'Candidate demonstrates strong technical and leadership profile', points: ['Strong technical foundation with 10 technical skills', 'Substantial career experience with 4 positions'], counterpoints: [] },
      { agent: 'Trust', stance: 'support', confidence: 82, reasoning: 'Candidate profile appears consistent and verifiable', points: ['Multiple experience entries (4) can be cross-referenced', 'Broad skill diversity across 5 categories suggests well-rounded profile'], counterpoints: [] },
      { agent: 'Growth', stance: 'support', confidence: 80, reasoning: 'Candidate shows strong growth trajectory and skill breadth', points: ['Strong skill set with 14 skills across 5 categories', 'Currently employed, indicating stable career trajectory'], counterpoints: [] },
    ],
    counterfactuals: [
      { scenario: 'David Kim had 2 more years of leadership experience', agentAdjustments: { CTO: 10, Trust: 5, Growth: 15 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'David Kim had modern framework experience', agentAdjustments: { CTO: 20, Trust: 0, Growth: 10 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: "David Kim's claims were fully verified", agentAdjustments: { CTO: 0, Trust: 20, Growth: 5 }, outcome: 'Trust concern eliminated' },
    ],
  },
  d5: {
    id: 'd5',
    candidateName: 'Eve Johnson',
    roleTitle: 'Data Scientist',
    recommendation: 'pass',
    confidenceScore: 38,
    synthesis: 'Panel has reservations about Eve Johnson for Data Scientist. Insufficient positive signals across agent panel (38% confidence).',
    arguments: [
      { agent: 'CTO', stance: 'caution', confidence: 35, reasoning: 'Candidate lacks sufficient technical depth or experience for this role', points: ['Limited technical skills (1) for a technical leadership role', 'No professional experience listed'], counterpoints: [] },
      { agent: 'Trust', stance: 'caution', confidence: 40, reasoning: 'Candidate profile has potential trust concerns that need verification', points: ['No skill categorization available for trust analysis'], counterpoints: [] },
      { agent: 'Growth', stance: 'caution', confidence: 39, reasoning: 'Candidate profile raises growth potential concerns', points: ['Limited skill breadth (3) may hinder growth potential', 'Between positions with no prior experience, high risk'], counterpoints: [] },
    ],
    counterfactuals: [
      { scenario: 'Eve Johnson had 2 more years of leadership experience', agentAdjustments: { CTO: 10, Trust: 5, Growth: 15 }, outcome: 'Would shift from consider to hire' },
      { scenario: 'Eve Johnson had modern framework experience', agentAdjustments: { CTO: 20, Trust: 0, Growth: 10 }, outcome: 'Would be strong_hire recommendation' },
      { scenario: "Eve Johnson's claims were fully verified", agentAdjustments: { CTO: 0, Trust: 20, Growth: 5 }, outcome: 'Trust concern eliminated' },
    ],
  },
};

const agentColors: Record<string, string> = {
  CTO: 'border-blue-500',
  Trust: 'border-green-500',
  Growth: 'border-purple-500',
};

const stanceEmoji: Record<string, string> = {
  support: '✅',
  caution: '⚠️',
  neutral: '➖',
};

const variantMap: Record<string, 'success' | 'default' | 'secondary' | 'destructive'> = {
  strong_hire: 'success',
  hire: 'default',
  consider: 'secondary',
  pass: 'destructive',
};

function confidenceBar(value: number): string {
  if (value >= 80) return 'bg-green-500';
  if (value >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function DebateDetailPage() {
  const params = useParams();
  const debate = mockDebates[params.id as string];

  if (!debate) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Debate Not Found</h1>
        <p className="text-muted-foreground">The requested debate does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">{debate.candidateName}</h1>
          <p className="text-lg text-muted-foreground">{debate.roleTitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className={`text-4xl font-bold ${debate.confidenceScore >= 80 ? 'text-green-600' : debate.confidenceScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {debate.confidenceScore}%
          </span>
          <Badge variant={variantMap[debate.recommendation] ?? 'secondary'} className="text-base px-4 py-1">
            {debate.recommendation.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Panel Synthesis</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{debate.synthesis}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {debate.arguments.map((arg) => (
          <Card key={arg.agent} className={`border-t-4 ${agentColors[arg.agent] ?? 'border-gray-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{stanceEmoji[arg.stance]}</span>
                {arg.agent} Agent
                <span className="ml-auto text-sm font-normal">{arg.confidence}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={arg.confidence} className={confidenceBar(arg.confidence)} />
              <p className="text-sm text-muted-foreground">{arg.reasoning}</p>
              {arg.points.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-green-600">+ Points</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    {arg.points.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
              {arg.counterpoints && arg.counterpoints.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-red-600">- Counterpoints</p>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    {arg.counterpoints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Counterfactual Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {debate.counterfactuals.map((cf, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <p className="font-medium">{cf.scenario}</p>
              <div className="flex gap-4 text-sm">
                {Object.entries(cf.agentAdjustments).map(([agent, adj]) => (
                  <span key={agent} className={adj > 0 ? 'text-green-600' : 'text-gray-500'}>
                    {agent}: +{adj}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{cf.outcome}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
