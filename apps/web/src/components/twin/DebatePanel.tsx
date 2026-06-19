'use client';

import { motion } from 'framer-motion';
import { useDebateByCandidate } from '@/hooks/useDebates';

interface Props {
  candidateId: string;
}

const agentColors: Record<string, string> = {
  CTO: 'border-info bg-info/5',
  Trust: 'border-green-500 bg-green-500/5',
  Growth: 'border-purple-500 bg-purple-500/5',
};

const agentIcons: Record<string, string> = {
  CTO: '🔧',
  Trust: '🛡️',
  Growth: '📈',
};

const stanceIcons: Record<string, string> = {
  support: '✅',
  caution: '⚠️',
  neutral: '➖',
};

export function DebatePanel({ candidateId }: Props) {
  const { data: debate, isLoading } = useDebateByCandidate(candidateId);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Agent Debate</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-background rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Agent Debate</h2>
        <p className="text-sm text-muted-foreground">No debate available for this candidate.</p>
      </div>
    );
  }

  const args = (debate.arguments as any[]) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Agent Debate</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Recommendation:</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            debate.recommendation === 'strong_hire' ? 'bg-green-500/10 text-green-500' :
            debate.recommendation === 'hire' ? 'bg-info/10 text-info' :
            debate.recommendation === 'consider' ? 'bg-yellow-500/10 text-yellow-500' :
            'bg-red-500/10 text-red-500'
          }`}>
            {debate.recommendation?.replace('_', ' ')}
          </span>
          <span className="text-sm font-bold text-foreground">{debate.confidence_score}%</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 p-4 bg-background rounded-lg border border-border">
        {debate.synthesis}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {args.map((arg: any, i: number) => (
          <motion.div
            key={arg.agent}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className={`border-l-4 ${agentColors[arg.agent] || 'border-border'} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{agentIcons[arg.agent] || '🤖'}</span>
                <span className="text-sm font-semibold text-foreground">{arg.agent}</span>
              </div>
              <span className="text-lg font-bold text-foreground">{arg.confidence}%</span>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <span>{stanceIcons[arg.stance] || '➖'}</span>
              <span className="text-xs text-muted-foreground capitalize">{arg.stance}</span>
            </div>

            <p className="text-xs text-muted-foreground mb-3">{arg.reasoning}</p>

            <div className="space-y-1">
              {(arg.points || []).map((p: string, j: number) => (
                <div key={j} className="flex items-start gap-1.5 text-xs">
                  <span className="text-green-500 mt-0.5">+</span>
                  <span className="text-foreground">{p}</span>
                </div>
              ))}
              {(arg.counterpoints || []).map((cp: string, j: number) => (
                <div key={j} className="flex items-start gap-1.5 text-xs">
                  <span className="text-yellow-500 mt-0.5">-</span>
                  <span className="text-yellow-500">{cp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
