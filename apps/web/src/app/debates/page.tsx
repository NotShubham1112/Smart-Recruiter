import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function DebatesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Recruiter Debates</h1>
      <Card>
        <CardHeader><CardTitle>Agent Debate Results</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Multi-agent debate results will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
