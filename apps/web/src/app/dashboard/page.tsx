import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Open positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Completed this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
