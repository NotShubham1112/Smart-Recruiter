'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@helix/ui';
import { useCandidates, type CandidateWithDNA } from '@/hooks/useCandidates';
import { motion } from 'framer-motion';

type SortKey = 'name' | 'helix' | 'trust';
type SortDir = 'asc' | 'desc';

function getHelixColor(score: number) {
  if (score >= 85) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-red-500';
}

function getTrustColor(score: number) {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

function getRiskLevel(c: CandidateWithDNA): { label: string; color: string } {
  const redFlags = ((c.trust?.red_flags as string[]) || []).length;
  const trustScore = c.trust?.trust_score ?? 0;

  if (redFlags > 0 || trustScore < 50) {
    return { label: 'High', color: 'bg-red-500/10 text-red-500' };
  }
  if (trustScore < 70) {
    return { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-500' };
  }
  return { label: 'Low', color: 'bg-green-500/10 text-green-500' };
}

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="ml-1 text-muted-foreground/40">↕</span>;
  return <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>;
}

export default function ReportsPage() {
  const { data: candidates, isLoading } = useCandidates();
  const [sortKey, setSortKey] = useState<SortKey>('helix');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = useMemo(() => {
    if (!candidates) return [];
    const list = [...candidates];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') {
        cmp = (a.full_name || '').localeCompare(b.full_name || '');
      } else if (sortKey === 'helix') {
        cmp = (a.dna?.helix_score ?? 0) - (b.dna?.helix_score ?? 0);
      } else if (sortKey === 'trust') {
        cmp = (a.trust?.trust_score ?? 0) - (b.trust?.trust_score ?? 0);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [candidates, sortKey, sortDir]);

  const stats = useMemo(() => {
    if (!candidates || candidates.length === 0) {
      return { total: 0, avgHelix: 0, avgTrust: 0, redFlagCount: 0 };
    }
    const total = candidates.length;
    const helixScores = candidates.map((c) => c.dna?.helix_score ?? 0);
    const trustScores = candidates.map((c) => c.trust?.trust_score ?? 0);
    const avgHelix = helixScores.reduce((a, b) => a + b, 0) / total;
    const avgTrust = trustScores.reduce((a, b) => a + b, 0) / total;
    const redFlagCount = candidates.filter(
      (c) => ((c.trust?.red_flags as string[]) || []).length > 0
    ).length;
    return { total, avgHelix, avgTrust, redFlagCount };
  }, [candidates]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Candidate Intelligence Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Loading...'
              : `${stats.total} candidates analyzed`}
          </p>
        </div>
        <Button
          onClick={() => alert('Report generated!')}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {isLoading ? '—' : stats.total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Helix Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${getHelixColor(stats.avgHelix)}`}>
              {isLoading ? '—' : stats.avgHelix.toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${getTrustColor(stats.avgTrust)}`}>
              {isLoading ? '—' : stats.avgTrust.toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Red Flags Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">
              {isLoading ? '—' : stats.redFlagCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No candidates found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => toggleSort('name')}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Name
                    <SortArrow active={sortKey === 'name'} dir={sortDir} />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => toggleSort('helix')}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Helix Score
                    <SortArrow active={sortKey === 'helix'} dir={sortDir} />
                  </button>
                </th>
                <th className="text-left py-3 px-4">
                  <button
                    onClick={() => toggleSort('trust')}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Trust Score
                    <SortArrow active={sortKey === 'trust'} dir={sortDir} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  AI-Gen Prob
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Skills
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => {
                const helixScore = c.dna?.helix_score ?? 0;
                const trustScore = c.trust?.trust_score ?? 0;
                const aiProb = Number(c.trust?.ai_generated_probability ?? 0);
                const skillsCount = Array.isArray(c.skills) ? c.skills.length : 0;
                const risk = getRiskLevel(c);

                return (
                  <tr
                    key={c.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/candidates/${c.id}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        <span className="font-medium">{c.full_name}</span>
                        {c.title && (
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            {c.title}
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${getHelixColor(helixScore)}`}>
                        {helixScore}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${getTrustColor(trustScore)}`}>
                        {trustScore}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">
                        {aiProb}%
                        {aiProb > 20 && (
                          <span className="ml-1 text-yellow-500" title="High AI-generated probability">⚠</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-muted-foreground">{skillsCount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={risk.color}>{risk.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
