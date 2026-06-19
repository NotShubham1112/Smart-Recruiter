'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import { useDebates } from '@/hooks/useDebates';
import { useCandidates } from '@/hooks/useCandidates';
import { useRoles } from '@/hooks/useRoles';

export default function DebatesPage() {
  const { data: debates, isLoading } = useDebates();
  const { data: candidates } = useCandidates();
  const { data: roles } = useRoles();

  const getCandidateName = (id: string) => candidates?.find((c) => c.id === id)?.full_name || 'Unknown';
  const getRoleTitle = (id: string) => roles?.find((r) => r.id === id)?.title || 'Unknown Role';

  const variantMap: Record<string, 'success' | 'default' | 'secondary' | 'destructive'> = {
    strong_hire: 'success',
    hire: 'default',
    consider: 'secondary',
    pass: 'destructive',
  };

  function confidenceColor(score: number): string {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Agent Debates</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${debates?.length || 0} debates completed`}
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Debate Results</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-background rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(debates || []).map((d) => (
                <Link
                  key={d.id}
                  href={`/candidates/${d.candidate_id}`}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-info/50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{getCandidateName(d.candidate_id)}</div>
                    <div className="text-xs text-muted-foreground">{getRoleTitle(d.role_id)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={variantMap[d.recommendation] || 'outline'}>
                      {d.recommendation?.replace('_', ' ')}
                    </Badge>
                    <span className={`text-sm font-bold ${confidenceColor(d.confidence_score)}`}>
                      {d.confidence_score}%
                    </span>
                  </div>
                </Link>
              ))}
              {(!debates || debates.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No debates yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
