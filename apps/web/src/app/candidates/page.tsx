import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function CandidatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Explorer</h1>
      <Card>
        <CardHeader><CardTitle>All Candidates</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Candidate list and search will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
