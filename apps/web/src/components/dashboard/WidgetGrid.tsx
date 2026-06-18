'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@helix/ui';
import { mockDashboardStats, mockCandidates, mockDebates, getScoreColor, getRiskColor } from '@/lib/mock-data';
import { Users, Briefcase, Shield, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function WidgetGrid() {
  const stats = mockDashboardStats;
  const topCandidates = [...mockCandidates].sort((a, b) => b.helixScore - a.helixScore).slice(0, 4);
  const trustAlerts = mockCandidates.filter((c) => c.trust.redFlags.length > 0);
  const recentDebates = mockDebates.slice(0, 4);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-6"
    >
      <motion.div variants={item}>
        <Link href="/candidates">
          <Card className="hover:border-info/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-success">{stats.candidatesTrend}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalCandidates}</div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Link href="/roles">
          <Card className="hover:border-info/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-success">{stats.rolesTrend}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.activeRoles}</div>
              <p className="text-sm text-muted-foreground">Active Roles</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Link href="/trust">
          <Card className="hover:border-info/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-success">{stats.verifiedPercent}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.trustVerified}</div>
              <p className="text-sm text-muted-foreground">Trust Verified</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Link href="/debates">
          <Card className="hover:border-info/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-success">{stats.debatesTrend}</span>
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.debatesCompleted}</div>
              <p className="text-sm text-muted-foreground">Debates Completed</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

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
                    <div className="text-sm font-medium text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.title}</div>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(c.helixScore)}`}>{c.helixScore}%</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
              {trustAlerts.length > 0 ? trustAlerts.map((c) => (
                <div key={c.id} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-destructive">{c.trust.redFlags[0]}</div>
                    </div>
                    <span className="text-sm font-bold text-destructive">{c.trustScore}%</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No trust alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
              {recentDebates.map((d) => (
                <Link
                  key={d.id}
                  href={`/debates/${d.id}`}
                  className="p-3 bg-background border border-border rounded-lg hover:border-info/50 transition-colors"
                >
                  <div className="text-sm font-medium text-foreground mb-1">{d.candidateName}</div>
                  <div className="text-xs text-muted-foreground mb-2">{d.roleTitle}</div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={d.recommendation === 'strong_hire' ? 'default' : d.recommendation === 'hire' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {d.recommendation.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm font-bold text-foreground">{d.confidenceScore}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
