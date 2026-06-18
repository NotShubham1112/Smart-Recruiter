import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@helix/ui';

interface MockDebate {
  id: string;
  candidateName: string;
  roleTitle: string;
  recommendation: 'strong_hire' | 'hire' | 'consider' | 'pass';
  confidenceScore: number;
  date: string;
}

const mockDebates: MockDebate[] = [
  { id: 'd1', candidateName: 'Alice Chen', roleTitle: 'Senior Frontend Engineer', recommendation: 'strong_hire', confidenceScore: 92, date: '2026-06-15' },
  { id: 'd2', candidateName: 'Bob Martinez', roleTitle: 'Backend Developer', recommendation: 'hire', confidenceScore: 78, date: '2026-06-14' },
  { id: 'd3', candidateName: 'Carol Smith', roleTitle: 'Product Manager', recommendation: 'consider', confidenceScore: 62, date: '2026-06-13' },
  { id: 'd4', candidateName: 'David Kim', roleTitle: 'DevOps Engineer', recommendation: 'hire', confidenceScore: 84, date: '2026-06-12' },
  { id: 'd5', candidateName: 'Eve Johnson', roleTitle: 'Data Scientist', recommendation: 'pass', confidenceScore: 38, date: '2026-06-11' },
];

const variantMap: Record<string, 'success' | 'default' | 'secondary' | 'destructive'> = {
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

export default function DebatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Agent Debates</h1>
      <Card>
        <CardHeader><CardTitle>Debate Results</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDebates.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <Link href={`/debates/${d.id}`} className="text-blue-600 hover:underline font-medium">
                      {d.candidateName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.roleTitle}</TableCell>
                  <TableCell>
                    <Badge variant={variantMap[d.recommendation]}>
                      {d.recommendation.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className={confidenceColor(d.confidenceScore)}>
                    {d.confidenceScore}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
