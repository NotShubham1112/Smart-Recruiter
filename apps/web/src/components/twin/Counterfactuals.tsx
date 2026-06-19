'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useDebateByCandidate } from '@/hooks/useDebates';

interface Props {
  candidateId: string;
}

export function Counterfactuals({ candidateId }: Props) {
  const { data: debate } = useDebateByCandidate(candidateId);

  if (!debate) return null;

  const counterfactuals = (debate.counterfactuals as any[]) || [];
  if (counterfactuals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-card border border-border rounded-xl p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        Counterfactual Analysis
      </h2>
      <p className="text-sm text-muted-foreground mb-4">What would improve this candidate&apos;s ranking?</p>

      <div className="space-y-3">
        {counterfactuals.map((cf: any, i: number) => (
          <div key={i} className="p-4 bg-background border border-border rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">{cf.scenario}</div>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="text-xs">
                <span className="text-muted-foreground">CTO: </span>
                <span className={`font-medium ${(cf.impact?.cto || 0) > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                  +{cf.impact?.cto || 0}%
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Trust: </span>
                <span className={`font-medium ${(cf.impact?.trust || 0) > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                  +{cf.impact?.trust || 0}%
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Growth: </span>
                <span className={`font-medium ${(cf.impact?.growth || 0) > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                  +{cf.impact?.growth || 0}%
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
