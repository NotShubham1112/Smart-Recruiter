'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';

interface MockCandidate {
  id: string;
  name: string;
  trustScore: number;
  aiGenProbability: number;
  anomalyScore: number;
  verifiedClaims: number;
  totalClaims: number;
  redFlags: string[];
}

const MOCK_CANDIDATES: MockCandidate[] = [
  { id: 'c1', name: 'Alice Chen', trustScore: 92, aiGenProbability: 0.05, anomalyScore: 0.1, verifiedClaims: 14, totalClaims: 16, redFlags: [] },
  { id: 'c2', name: 'Bob Martinez', trustScore: 78, aiGenProbability: 0.15, anomalyScore: 0.25, verifiedClaims: 9, totalClaims: 14, redFlags: [] },
  { id: 'c3', name: 'Carol Johnson', trustScore: 45, aiGenProbability: 0.65, anomalyScore: 0.55, verifiedClaims: 4, totalClaims: 18, redFlags: ['Resume shows signs of AI-generated content', 'High anomaly score detected'] },
  { id: 'c4', name: 'Dave Kim', trustScore: 35, aiGenProbability: 0.55, anomalyScore: 0.7, verifiedClaims: 3, totalClaims: 22, redFlags: ['High anomaly score detected', 'Unusually large number of skills listed', 'More than 50% of claims could not be verified'] },
  { id: 'c5', name: 'Eve Patel', trustScore: 88, aiGenProbability: 0.08, anomalyScore: 0.12, verifiedClaims: 11, totalClaims: 12, redFlags: [] },
];

function getStatusBadge(candidate: MockCandidate) {
  if (candidate.redFlags.length > 0) {
    return { label: 'Flagged', variant: 'destructive' as const };
  }
  if (candidate.trustScore < 60 || candidate.anomalyScore > 0.4) {
    return { label: 'Suspicious', variant: 'warning' as const };
  }
  return { label: 'Verified', variant: 'success' as const };
}

function getCardBorder(candidate: MockCandidate): string {
  if (candidate.redFlags.length > 0) return 'border-red-500';
  if (candidate.trustScore < 60 || candidate.anomalyScore > 0.4) return 'border-yellow-500';
  return '';
}

export default function TrustPage() {
  const verifiedCount = MOCK_CANDIDATES.filter((c) => c.redFlags.length === 0 && c.trustScore >= 60).length;
  const suspiciousCount = MOCK_CANDIDATES.filter((c) => c.redFlags.length === 0 && (c.trustScore < 60 || c.anomalyScore > 0.4)).length;
  const flaggedCount = MOCK_CANDIDATES.filter((c) => c.redFlags.length > 0).length;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trust Intelligence</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader><CardTitle>Verified</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
            <p className="text-sm text-muted-foreground">Candidates with high trust scores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Suspicious</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{suspiciousCount}</p>
            <p className="text-sm text-muted-foreground">Candidates flagged for review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Flagged</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{flaggedCount}</p>
            <p className="text-sm text-muted-foreground">Candidates with red flags</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_CANDIDATES.map((candidate) => {
          const status = getStatusBadge(candidate);
          const borderClass = getCardBorder(candidate);

          return (
            <Card key={candidate.id} className={borderClass}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>{candidate.name}</CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <span className="text-2xl font-bold">{candidate.trustScore}</span>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI-Gen Probability</span>
                    <span>{(candidate.aiGenProbability * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={candidate.aiGenProbability * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Anomaly Score</span>
                    <span>{(candidate.anomalyScore * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={candidate.anomalyScore * 100} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Claims Verified: {candidate.verifiedClaims} / {candidate.totalClaims}
                </p>
                {candidate.redFlags.length > 0 && (
                  <ul className="space-y-1">
                    {candidate.redFlags.map((flag, i) => (
                      <li key={i} className="text-sm text-red-500">&#x2022; {flag}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
