'use client';

import Link from 'next/link';
import { Badge } from '@helix/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';
import { useRoles } from '@/hooks/useRoles';

export default function RolesPage() {
  const { data: roles, isLoading } = useRoles();

  const urgencyVariant: Record<string, 'destructive' | 'secondary' | 'outline'> = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Role Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${roles?.length || 0} active roles`}
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-background rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(roles || []).map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-info/50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{role.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {role.department} • {role.seniority_level} • {role.experience_years}+ yrs
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(role.required_skills) ? role.required_skills.slice(0, 3) : []).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-card border border-border rounded text-[10px] text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                    <Badge variant={urgencyVariant['Medium'] || 'outline'}>Active</Badge>
                  </div>
                </div>
              ))}
              {(!roles || roles.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No roles yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
