'use client';

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import type { MockCandidate } from '@/lib/mock-data';

interface Props {
  candidate: MockCandidate;
}

export function CareerTimeline({ candidate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Career Timeline</h2>

      <div className="relative">
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {candidate.experience_history.map((exp, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-9 h-9 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0 relative z-10">
                <Briefcase className="w-4 h-4 text-info" />
              </div>
              <div className="flex-1 pb-6 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground">{exp.title}</h3>
                  <span className="text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="text-xs text-info mb-1">{exp.company}</p>
                <p className="text-xs text-muted-foreground">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>

        {candidate.education.length > 0 && (
          <div className="mt-6 space-y-4">
            {candidate.education.map((edu, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 relative z-10">
                  <GraduationCap className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-xs text-muted-foreground">{edu.institution} &bull; {edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
