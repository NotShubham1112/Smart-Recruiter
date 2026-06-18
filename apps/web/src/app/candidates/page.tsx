'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@helix/ui';

interface MockCandidate {
  id: string;
  name: string;
  title: string;
  helixScore: number;
  trustScore: number;
  match: number;
}

const mockCandidates: MockCandidate[] = [
  { id: 'c1', name: 'Alice Chen', title: 'Senior Frontend Engineer', helixScore: 92, trustScore: 88, match: 95 },
  { id: 'c2', name: 'Bob Martinez', title: 'Full Stack Developer', helixScore: 78, trustScore: 82, match: 71 },
  { id: 'c3', name: 'Carol Smith', title: 'DevOps Engineer', helixScore: 85, trustScore: 90, match: 88 },
  { id: 'c4', name: 'David Kim', title: 'Data Scientist', helixScore: 65, trustScore: 70, match: 60 },
  { id: 'c5', name: 'Eva Johansson', title: 'Product Manager', helixScore: 88, trustScore: 85, match: 82 },
];

function scoreColor(score: number): string {
  if (score >= 85) return 'text-green-600 dark:text-green-400';
  if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export default function CandidatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Explorer</h1>
      <Card>
        <CardHeader><CardTitle>All Candidates</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Helix Score</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCandidates.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/candidates/${c.id}`} className="font-medium text-primary hover:underline">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell className={scoreColor(c.helixScore)}>{c.helixScore}</TableCell>
                  <TableCell>{c.trustScore}</TableCell>
                  <TableCell>
                    <Badge variant={c.match >= 85 ? 'success' : c.match >= 75 ? 'warning' : 'destructive'}>
                      {c.match}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
