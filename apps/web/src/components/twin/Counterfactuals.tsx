'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { mockDebates } from '@/lib/mock-data';

interface Props {
  candidateId: string;
}

export function Counterfactuals({ candidateId }: Props) {
  const debate = mockDebates.find((d) => d.candidateId === candidateId);

  if (!debate || debate.counterfactuals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-card border border-border rounded-xl p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-warning" />
        Counterfactual Analysis
      </h2>
      <p className="text-sm text-muted-foreground mb-4">What would improve {debate.candidateName}&apos;s ranking?</p>

      <div className="space-y-3">
        {debate.counterfactuals.map((cf, i) => (
          <div key={i} className="p-4 bg-background border border-border rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">{cf.scenario}</div>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="text-xs">
                <span className="text-muted-foreground">CTO: </span>
                <span className={`font-medium ${cf.impact.cto > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  +{cf.impact.cto}%
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Trust: </span>
                <span className={`font-medium ${cf.impact.trust > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  +{cf.impact.trust}%
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Growth: </span>
                <span className={`font-medium ${cf.impact.growth > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  +{cf.impact.growth}%
                </span>
              </div>
            </div>
            <div className="text-xs text-info">{cf.outcome}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
