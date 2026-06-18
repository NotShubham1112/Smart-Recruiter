'use client';

import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { MockCandidate } from '@/lib/mock-data';

interface Props {
  candidate: MockCandidate;
}

export function DNARadar({ candidate }: Props) {
  const data = [
    { dimension: 'Technical Depth', value: candidate.dna.technicalDepth },
    { dimension: 'Leadership', value: candidate.dna.leadership },
    { dimension: 'Ownership', value: candidate.dna.ownership },
    { dimension: 'Communication', value: candidate.dna.communication },
    { dimension: 'Adaptability', value: candidate.dna.adaptability },
    { dimension: 'Learning Velocity', value: candidate.dna.learningVelocity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-xl p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">Candidate DNA</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="#262626" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A1A1AA', fontSize: 10 }} />
              <Radar name="DNA" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                labelStyle={{ color: '#FAFAFA' }}
                itemStyle={{ color: '#3B82F6' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.dimension}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">{d.dimension}</span>
                <span className="text-sm font-bold text-foreground">{d.value}/100</span>
              </div>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.value}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className={`h-full rounded-full ${d.value >= 85 ? 'bg-success' : d.value >= 70 ? 'bg-info' : d.value >= 55 ? 'bg-warning' : 'bg-danger'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
