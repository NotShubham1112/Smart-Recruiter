import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function TrustPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trust Intelligence</h1>
      <Card>
        <CardHeader><CardTitle>Trust Analysis</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Trust scores and fraud detection will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
