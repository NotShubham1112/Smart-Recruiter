import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function RolesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Role Intelligence</h1>
      <Card>
        <CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">Role list and analysis will appear here.</p></CardContent>
      </Card>
    </div>
  );
}
