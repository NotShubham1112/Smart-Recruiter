import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function SimulationsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Simulation Results</h1>
      <Card>
        <CardHeader><CardTitle>Success Simulations</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Candidate success predictions will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
