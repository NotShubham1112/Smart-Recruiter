'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import { useDebates } from '@/hooks/useDebates';
import { useCandidates } from '@/hooks/useCandidates';
import { useRoles } from '@/hooks/useRoles';
import { motion, AnimatePresence } from 'framer-motion';

const variantMap: Record<string, 'success' | 'default' | 'secondary' | 'destructive'> = {
  strong_hire: 'success',
  hire: 'default',
  consider: 'secondary',
  pass: 'destructive',
};

const colorMap: Record<string, string> = {
  strong_hire: 'text-green-500',
  hire: 'text-blue-500',
  consider: 'text-yellow-500',
  pass: 'text-red-500',
};

const bgColorMap: Record<string, string> = {
  strong_hire: 'bg-green-500/10',
  hire: 'bg-blue-500/10',
  consider: 'bg-yellow-500/10',
  pass: 'bg-red-500/10',
};

function confidenceColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

interface DebateWithNames {
  debate: any;
  candidateName: string;
  roleTitle: string;
}

export default function SimulationsPage() {
  const { data: debates, isLoading: loadingDebates } = useDebates();
  const { data: candidates, isLoading: loadingCandidates } = useCandidates();
  const { data: roles, isLoading: loadingRoles } = useRoles();

  const [filterRecommendation, setFilterRecommendation] = useState<string>('all');
  const [minConfidence, setMinConfidence] = useState<number>(0);

  const isLoading = loadingDebates || loadingCandidates || loadingRoles;

  const getCandidateName = (id: string) => candidates?.find((c) => c.id === id)?.full_name || 'Unknown';
  const getRoleTitle = (id: string) => roles?.find((r) => r.id === id)?.title || 'Unknown Role';

  const enrichedDebates: DebateWithNames[] = (debates || []).map((d) => ({
    debate: d,
    candidateName: getCandidateName(d.candidate_id),
    roleTitle: getRoleTitle(d.role_id),
  }));

  const filtered = enrichedDebates.filter(({ debate }) => {
    if (filterRecommendation !== 'all' && debate.recommendation !== filterRecommendation) return false;
    if (debate.confidence_score < minConfidence) return false;
    return true;
  });

  const counts = {
    strong_hire: enrichedDebates.filter((e) => e.debate.recommendation === 'strong_hire').length,
    hire: enrichedDebates.filter((e) => e.debate.recommendation === 'hire').length,
    consider: enrichedDebates.filter((e) => e.debate.recommendation === 'consider').length,
    pass: enrichedDebates.filter((e) => e.debate.recommendation === 'pass').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Success Simulations</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${debates?.length || 0} simulations completed`}
        </p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(['strong_hire', 'hire', 'consider', 'pass'] as const).map((rec) => (
          <Card key={rec}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground capitalize">
                {rec.replace('_', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${colorMap[rec]}`}>{counts[rec]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Recommendation:</label>
          <select
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value)}
            className="bg-card border border-border rounded px-3 py-1.5 text-sm text-foreground"
          >
            <option value="all">All</option>
            <option value="strong_hire">Strong Hire</option>
            <option value="hire">Hire</option>
            <option value="consider">Consider</option>
            <option value="pass">Pass</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Min Confidence:</label>
          <select
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="bg-card border border-border rounded px-3 py-1.5 text-sm text-foreground"
          >
            <option value={0}>Any</option>
            <option value={25}>25%+</option>
            <option value={50}>50%+</option>
            <option value={75}>75%+</option>
          </select>
        </div>
        {filterRecommendation !== 'all' || minConfidence > 0 ? (
          <button
            onClick={() => { setFilterRecommendation('all'); setMinConfidence(0); }}
            className="text-xs text-info hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Simulation Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {debates?.length === 0 ? 'No simulations yet.' : 'No simulations match your filters.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filtered.map(({ debate, candidateName, roleTitle }) => {
              const args = Array.isArray(debate.arguments) ? debate.arguments : [];
              const cfs = Array.isArray(debate.counterfactuals) ? debate.counterfactuals : [];

              return (
                <motion.div
                  key={debate.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/candidates/${debate.candidate_id}`}
                    className="block"
                  >
                    <Card className="hover:border-info/50 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base text-foreground">{candidateName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{roleTitle}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={variantMap[debate.recommendation] || 'outline'}>
                              {debate.recommendation?.replace('_', ' ')}
                            </Badge>
                            <span className={`text-lg font-bold ${confidenceColor(debate.confidence_score)}`}>
                              {debate.confidence_score}%
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {args.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Key Factors</p>
                            <div className="flex flex-wrap gap-2">
                              {args.map((arg: any, i: number) => (
                                <span
                                  key={i}
                                  className={`text-xs px-2 py-1 rounded-full ${bgColorMap[debate.recommendation] || 'bg-background'} text-foreground`}
                                >
                                  {arg.agent}: {arg.stance}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {cfs.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">Counterfactuals</p>
                            <div className="space-y-1">
                              {cfs.map((cf: any, i: number) => (
                                <p key={i} className="text-xs text-foreground">
                                  <span className="text-muted-foreground">{cf.scenario}</span>
                                  {' → '}
                                  <span className={cf.outcome === 'positive' ? 'text-green-500' : cf.outcome === 'negative' ? 'text-red-500' : 'text-muted-foreground'}>
                                    {cf.impact}
                                  </span>
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {debate.synthesis && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{debate.synthesis}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
