import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Application settings will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
