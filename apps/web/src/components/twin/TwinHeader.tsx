'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Download, Share2, Play, FileText } from 'lucide-react';
import type { MockCandidate } from '@/lib/mock-data';
import { getScoreColor } from '@/lib/mock-data';

interface Props {
  candidate: MockCandidate;
}

export function TwinHeader({ candidate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Link href="/candidates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Candidates
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center text-info font-bold text-xl flex-shrink-0">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">{candidate.name}</h1>
            <p className="text-lg text-muted-foreground mb-2">{candidate.title}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{candidate.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{candidate.experience}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <div className={`text-5xl font-bold ${getScoreColor(candidate.helixScore)}`}>{candidate.helixScore}%</div>
            <div className="text-sm text-muted-foreground">Helix Score</div>
          </div>
          <button className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-info text-white rounded-xl text-sm font-medium hover:bg-info/90 transition-colors">
            <Play className="w-4 h-4" />
            Run Simulation
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors">
            <FileText className="w-4 h-4" />
            Generate Interview
          </button>
        </div>
      </div>
    </motion.div>
  );
}
