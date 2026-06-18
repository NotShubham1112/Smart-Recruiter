'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { MockCandidate } from '@/lib/mock-data';

interface Props {
  candidate: MockCandidate;
}

export function TrustSection({ candidate }: Props) {
  const { trust } = candidate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border rounded-xl p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-info" />
        Trust Intelligence
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-background rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">AI-Generated Probability</div>
          <div className="text-2xl font-bold text-foreground">{trust.aiGeneratedProbability}%</div>
          <div className="w-full h-1.5 bg-card rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${trust.aiGeneratedProbability > 50 ? 'bg-danger' : trust.aiGeneratedProbability > 25 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${trust.aiGeneratedProbability}%` }}
            />
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Anomaly Score</div>
          <div className="text-2xl font-bold text-foreground">{(trust.anomalyScore * 100).toFixed(0)}%</div>
          <div className="w-full h-1.5 bg-card rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${trust.anomalyScore > 0.5 ? 'bg-danger' : trust.anomalyScore > 0.25 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${trust.anomalyScore * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Claims Verified</div>
          <div className="text-2xl font-bold text-foreground">{trust.verifiedClaims}/{trust.totalClaims}</div>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Trust Score</div>
          <div className={`text-2xl font-bold ${candidate.trustScore >= 80 ? 'text-success' : candidate.trustScore >= 60 ? 'text-warning' : 'text-danger'}`}>
            {candidate.trustScore}
          </div>
        </div>
      </div>

      {trust.redFlags.length > 0 && (
        <div className="space-y-2">
          {trust.redFlags.map((flag, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-danger/5 border border-danger/20 rounded-lg text-sm text-danger">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {flag}
            </div>
          ))}
        </div>
      )}

      {trust.redFlags.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-lg text-sm text-success">
          <CheckCircle className="w-4 h-4" />
          All claims verified. No red flags detected.
        </div>
      )}
    </motion.div>
  );
}
