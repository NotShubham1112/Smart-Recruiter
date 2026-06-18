import Link from 'next/link';
import { Badge } from '@helix/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@helix/ui';

interface MockRole {
  id: string;
  title: string;
  department: string;
  candidateCount: number;
  topScore: number;
  minScore: number;
  urgency: 'High' | 'Medium' | 'Low';
}

const mockRoles: MockRole[] = [
  { id: 'r1', title: 'Senior Frontend Engineer', department: 'Engineering', candidateCount: 12, topScore: 92, minScore: 54, urgency: 'High' },
  { id: 'r2', title: 'Backend Developer', department: 'Engineering', candidateCount: 8, topScore: 87, minScore: 48, urgency: 'Medium' },
  { id: 'r3', title: 'Product Designer', department: 'Design', candidateCount: 5, topScore: 78, minScore: 61, urgency: 'Low' },
  { id: 'r4', title: 'Data Scientist', department: 'Data', candidateCount: 10, topScore: 90, minScore: 52, urgency: 'High' },
  { id: 'r5', title: 'Engineering Manager', department: 'Engineering', candidateCount: 6, topScore: 85, minScore: 59, urgency: 'Medium' },
];

const urgencyVariant: Record<string, 'destructive' | 'secondary' | 'outline'> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
};

export default function RolesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Role Intelligence</h1>
      <Card>
        <CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Top Score</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Urgency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <Link href={`/roles/${role.id}`} className="font-medium text-primary hover:underline">
                      {role.title}
                    </Link>
                  </TableCell>
                  <TableCell>{role.department}</TableCell>
                  <TableCell>{role.candidateCount}</TableCell>
                  <TableCell>{role.topScore}</TableCell>
                  <TableCell>{role.minScore} – {role.topScore}</TableCell>
                  <TableCell>
                    <Badge variant={urgencyVariant[role.urgency]}>{role.urgency}</Badge>
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
