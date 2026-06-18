import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@helix/ui';

const statCards = [
  { label: 'Total Candidates', value: '47', change: '+12', href: '/candidates' },
  { label: 'Active Roles', value: '5', change: '+2', href: '/roles' },
  { label: 'Trust Verified', value: '32', change: '68%', href: '/trust' },
  { label: 'Debates Completed', value: '28', change: '+8', href: '/debates' },
];

const recentDebates = [
  { candidateName: 'Alice Chen', role: 'Senior Frontend Engineer', recommendation: 'strong_hire' as const, confidence: 92 },
  { candidateName: 'Bob Martinez', role: 'Backend Developer', recommendation: 'hire' as const, confidence: 78 },
  { candidateName: 'Carol Smith', role: 'Product Manager', recommendation: 'consider' as const, confidence: 62 },
  { candidateName: 'David Kim', role: 'DevOps Engineer', recommendation: 'hire' as const, confidence: 84 },
];

const topCandidates = [
  { id: 'c1', name: 'Alice Chen', role: 'Senior Frontend Engineer', score: 94 },
  { id: 'c2', name: 'David Kim', role: 'DevOps Engineer', score: 91 },
  { id: 'c3', name: 'Frank Lee', role: 'Backend Developer', score: 87 },
  { id: 'c4', name: 'Grace Wang', role: 'Data Scientist', score: 85 },
];

const trustAlerts = [
  { name: 'Henry Davis', role: 'Senior Backend Engineer', trustScore: 42, redFlag: 'Employment dates mismatch' },
  { name: 'Irene Patel', role: 'Product Designer', trustScore: 38, redFlag: 'Skill certifications unverifiable' },
];

const helixDistribution = [
  { range: '90-100%', count: 12, color: 'bg-green-500' },
  { range: '80-89%', count: 18, color: 'bg-blue-500' },
  { range: '70-79%', count: 10, color: 'bg-yellow-500' },
  { range: '<70%', count: 7, color: 'bg-red-500' },
];

const recommendationVariant: Record<string, 'success' | 'default' | 'secondary' | 'destructive'> = {
  strong_hire: 'success',
  hire: 'default',
  consider: 'secondary',
  pass: 'destructive',
};

function confidenceColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stat.value}</span>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Debates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentDebates.map((d) => (
              <div key={d.candidateName} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm">{d.candidateName}</p>
                  <p className="text-xs text-muted-foreground">{d.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={recommendationVariant[d.recommendation]}>
                    {d.recommendation.replace('_', ' ')}
                  </Badge>
                  <span className={`text-sm font-medium ${confidenceColor(d.confidence)}`}>
                    {d.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Candidates</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topCandidates.map((c) => (
              <Link key={c.id} href={`/candidates/${c.id}`} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 hover:bg-muted/50 rounded px-1 -mx-1 transition-colors">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
                <span className="text-sm font-bold text-green-600">{c.score}%</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Trust Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {trustAlerts.map((a) => (
              <Card key={a.name} className="border-red-500 border-2">
                <CardContent className="p-4 space-y-1">
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.role}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-600">{a.trustScore}/100</span>
                    <span className="text-xs text-red-500">{a.redFlag}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Helix Score Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {helixDistribution.map((item) => (
              <div key={item.range} className="text-center space-y-2">
                <div className={`h-2 rounded-full ${item.color}`} style={{ opacity: 0.7 }} />
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm text-muted-foreground">{item.range}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
