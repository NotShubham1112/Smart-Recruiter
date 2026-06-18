'use client';

import { useParams } from 'next/navigation';
import { mockCandidates } from '@/lib/mock-data';
import { TwinHeader } from '@/components/twin/TwinHeader';
import { ScoreCards } from '@/components/twin/ScoreCards';
import { DNARadar } from '@/components/twin/DNARadar';
import { TrustSection } from '@/components/twin/TrustSection';
import { DebatePanel } from '@/components/twin/DebatePanel';
import { Counterfactuals } from '@/components/twin/Counterfactuals';
import { CareerTimeline } from '@/components/twin/CareerTimeline';

export default function CandidateTwinPage() {
  const params = useParams();
  const candidate = mockCandidates.find((c) => c.id === params.id);

  if (!candidate) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">Candidate not found</h1>
        <p className="text-muted-foreground mt-2">The candidate you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <TwinHeader candidate={candidate} />
      <ScoreCards candidate={candidate} />
      <DNARadar candidate={candidate} />
      <TrustSection candidate={candidate} />
      <DebatePanel candidateId={candidate.id} />
      <Counterfactuals candidateId={candidate.id} />
      <CareerTimeline candidate={candidate} />
    </div>
  );
}
