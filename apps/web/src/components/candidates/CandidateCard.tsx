'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import type { MockCandidate } from '@/lib/mock-data';
import { getScoreColor, getRiskColor, getScoreBg } from '@/lib/mock-data';

interface Props {
  candidate: MockCandidate;
}

export function CandidateCard({ candidate }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/candidates/${candidate.id}`}>
        <div className="bg-card border border-border rounded-xl p-5 hover:border-info/50 transition-all cursor-pointer group">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info font-semibold text-sm">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground group-hover:text-info transition-colors">
                  {candidate.name}
                </h3>
                <p className="text-sm text-muted-foreground">{candidate.title}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{candidate.experience}</span>
          </div>

          {/* Scores */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Helix Score</span>
              <span className={`text-sm font-bold ${getScoreColor(candidate.helixScore)}`}>{candidate.helixScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getScoreBg(candidate.helixScore)}`} style={{ width: `${candidate.helixScore}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Success Probability</span>
              <span className={`text-sm font-bold ${getScoreColor(candidate.successProbability)}`}>{candidate.successProbability}%</span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getScoreBg(candidate.successProbability)}`} style={{ width: `${candidate.successProbability}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Trust Score</span>
              <span className="text-sm font-bold text-foreground">{candidate.trustScore}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Risk</span>
              <span className={`text-sm font-bold ${getRiskColor(candidate.riskLevel)}`}>{candidate.riskLevel}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 5).map((skill) => (
              <span key={skill} className="px-2 py-0.5 bg-background border border-border rounded text-[11px] text-muted-foreground">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 5 && (
              <span className="px-2 py-0.5 bg-background border border-border rounded text-[11px] text-muted-foreground">
                +{candidate.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
