'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, Sprout } from 'lucide-react';
import type { MockCandidate } from '@/lib/mock-data';
import { getScoreColor } from '@/lib/mock-data';

interface Props {
  candidate: MockCandidate;
}

export function ScoreCards({ candidate }: Props) {
  const cards = [
    {
      icon: Shield,
      label: 'Trust Score',
      value: candidate.trustScore,
      color: candidate.trustScore >= 80 ? 'text-success' : candidate.trustScore >= 60 ? 'text-warning' : 'text-danger',
      badge: candidate.trust.redFlags.length === 0 ? 'Verified' : candidate.trust.redFlags.length > 1 ? 'Flagged' : 'Suspicious',
      badgeColor: candidate.trust.redFlags.length === 0 ? 'bg-success/10 text-success' : candidate.trust.redFlags.length > 1 ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning',
    },
    {
      icon: TrendingUp,
      label: 'Success Probability',
      value: candidate.successProbability,
      color: getScoreColor(candidate.successProbability),
      badge: `${candidate.successProbability}%`,
      badgeColor: 'bg-info/10 text-info',
    },
    {
      icon: Sprout,
      label: 'Growth Potential',
      value: candidate.growthPotential,
      color: getScoreColor(candidate.growthPotential),
      badge: `${candidate.growthPotential}%`,
      badgeColor: 'bg-info/10 text-info',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <card.icon className="w-4 h-4" />
              <span className="text-sm">{card.label}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>
          <div className={`text-3xl font-bold ${card.color}`}>{card.value}%</div>
        </motion.div>
      ))}
    </div>
  );
}
