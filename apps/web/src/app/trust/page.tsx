'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@helix/ui';
import { useCandidates } from '@/hooks/useCandidates';

export default function TrustPage() {
  const { data: candidates, isLoading } = useCandidates();

  const verified = (candidates || []).filter((c) => c.trust && (c.trust.red_flags as any)?.length === 0 && c.trust.trust_score >= 70);
  const suspicious = (candidates || []).filter((c) => c.trust && (c.trust.red_flags as any)?.length === 0 && (c.trust.trust_score < 70 || Number(c.trust.anomaly_score) > 0.3));
  const flagged = (candidates || []).filter((c) => c.trust && (c.trust.red_flags as any)?.length > 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Trust Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${candidates?.length || 0} candidates analyzed`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader><CardTitle className="text-sm">Verified</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{verified.length}</p>
            <p className="text-xs text-muted-foreground">High trust scores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Suspicious</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">{suspicious.length}</p>
            <p className="text-xs text-muted-foreground">Flagged for review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Flagged</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">{flagged.length}</p>
            <p className="text-xs text-muted-foreground">Red flags detected</p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(candidates || []).map((c) => {
            const trust = c.trust;
            if (!trust) return null;
            const redFlags = (trust.red_flags as string[]) || [];
            const isFlagged = redFlags.length > 0;
            const isSuspicious = !isFlagged && (trust.trust_score < 70 || Number(trust.anomaly_score) > 0.3);

            return (
              <div
                key={c.id}
                className={`p-4 bg-card border rounded-lg ${
                  isFlagged ? 'border-red-500' : isSuspicious ? 'border-yellow-500' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{c.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{c.title}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${trust.trust_score >= 80 ? 'text-green-500' : trust.trust_score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {trust.trust_score}
                    </div>
                    <div className="text-xs text-muted-foreground">Trust Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">AI-Gen: </span>
                    <span className="font-medium">{Number(trust.ai_generated_probability)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Anomaly: </span>
                    <span className="font-medium">{(Number(trust.anomaly_score) * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Claims: </span>
                    <span className="font-medium">{trust.verified_claims}/{trust.total_claims}</span>
                  </div>
                </div>

                {redFlags.length > 0 && (
                  <div className="space-y-1">
                    {redFlags.map((flag, i) => (
                      <div key={i} className="text-xs text-red-500">⚠ {flag}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
