'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import { Users, Briefcase, Shield, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCandidates, type CandidateWithDNA } from '@/hooks/useCandidates';
import { useDebates } from '@/hooks/useDebates';

interface Props {
  stats: {
    totalCandidates: number;
    activeRoles: number;
    trustVerified: number;
    debatesCompleted: number;
  };
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-500';
  if (score >= 75) return 'text-yellow-500';
  return 'text-red-500';
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function WidgetGrid({ stats }: Props) {
  const { data: candidates } = useCandidates();
  const { data: debates } = useDebates();

  const topCandidates = (candidates || [])
    .sort((a, b) => (b.dna?.helix_score || 0) - (a.dna?.helix_score || 0))
    .slice(0, 4);

  const trustAlerts = (candidates || []).filter(
    (c) => c.trust && (c.trust.red_flags as any)?.length > 0
  );

  const recentDebates = (debates || []).slice(0, 4);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-6"
    >
      {/* Stats */}
      <motion.div variants={item}>
        <Link href="/candidates">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalCandidates}</div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Link href="/roles">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.activeRoles}</div>
              <p className="text-sm text-muted-foreground">Active Roles</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Link href="/trust">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.trustVerified}</div>
              <p className="text-sm text-muted-foreground">Trust Verified</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Link href="/debates">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.debatesCompleted}</div>
              <p className="text-sm text-muted-foreground">Debates Completed</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      {/* Top Candidates */}
      <motion.div variants={item} className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCandidates.map((c) => (
                <Link
                  key={c.id}
                  href={`/candidates/${c.id}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-background/50 rounded px-2 -mx-2 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{c.full_name}</div>
                    <div className="text-xs text-muted-foreground">{c.title}</div>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(c.dna?.helix_score || 0)}`}>
                    {c.dna?.helix_score || 0}%
                  </span>
                </Link>
              ))}
              {topCandidates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No candidates yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trust Alerts */}
      <motion.div variants={item} className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Trust Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trustAlerts.length > 0 ? trustAlerts.map((c) => {
                const flags = (c.trust?.red_flags as string[]) || [];
                return (
                  <div key={c.id} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">{c.full_name}</div>
                        <div className="text-xs text-destructive">{flags[0]}</div>
                      </div>
                      <span className="text-sm font-bold text-destructive">{c.trust?.trust_score}%</span>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-sm text-muted-foreground text-center py-4">No trust alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Debates */}
      <motion.div variants={item} className="md:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recent Debates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentDebates.map((d) => {
                const candidate = candidates?.find((c) => c.id === d.candidate_id);
                return (
                  <Link
                    key={d.id}
                    href={`/candidates/${d.candidate_id}`}
                    className="p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="text-sm font-medium text-foreground mb-1">
                      {candidate?.full_name || 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {candidate?.title || ''}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={d.recommendation === 'strong_hire' ? 'default' : d.recommendation === 'hire' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {d.recommendation?.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm font-bold text-foreground">{d.confidence_score}%</span>
                    </div>
                  </Link>
                );
              })}
              {recentDebates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4 col-span-4">No debates yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
