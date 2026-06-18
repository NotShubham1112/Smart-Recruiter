import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <Card>
        <CardHeader><CardTitle>Generated Reports</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Candidate reports will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
