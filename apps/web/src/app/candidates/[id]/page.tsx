'use client';

import { useParams } from 'next/navigation';
import { useCandidate, type CandidateWithDNA } from '@/hooks/useCandidates';
import { useDebateByCandidate } from '@/hooks/useDebates';
import { TwinHeader } from '@/components/twin/TwinHeader';
import { ScoreCards } from '@/components/twin/ScoreCards';
import { DNARadar } from '@/components/twin/DNARadar';
import { TrustSection } from '@/components/twin/TrustSection';
import { DebatePanel } from '@/components/twin/DebatePanel';
import { Counterfactuals } from '@/components/twin/Counterfactuals';
import { CareerTimeline } from '@/components/twin/CareerTimeline';
import type { MockCandidate, MockDebate } from '@/lib/mock-data';

function mapToMock(c: CandidateWithDNA): MockCandidate {
  const skills = Array.isArray(c.skills) ? c.skills : [];
  const experience = Array.isArray(c.experience) ? c.experience : [];
  const dna = c.dna;
  const trust = c.trust;

  return {
    id: c.id,
    name: c.full_name,
    title: c.title || 'Unknown Role',
    location: c.location || 'Remote',
    experience: experience.length > 0 ? `${experience.length} positions` : 'Not specified',
    helixScore: dna?.helix_score || 0,
    successProbability: dna?.confidence_score || 0,
    trustScore: trust?.trust_score || 0,
    riskLevel: (trust?.red_flags as any)?.length > 0 ? 'High' : (trust?.trust_score || 0) >= 80 ? 'Low' : 'Medium',
    growthPotential: dna?.learning_velocity || 0,
    skills: skills.map((s: any) => s.name),
    summary: c.summary || '',
    dna: {
      technicalDepth: dna?.technical_depth || 0,
      leadership: dna?.leadership || 0,
      ownership: dna?.ownership || 0,
      communication: dna?.communication || 0,
      adaptability: dna?.adaptability || 0,
      learningVelocity: dna?.learning_velocity || 0,
    },
    trust: {
      aiGeneratedProbability: Number(trust?.ai_generated_probability) || 0,
      anomalyScore: Number(trust?.anomaly_score) || 0,
      verifiedClaims: trust?.verified_claims || 0,
      totalClaims: trust?.total_claims || 0,
      redFlags: (trust?.red_flags as string[]) || [],
    },
    experience_history: experience.map((e: any) => ({
      company: e.company,
      title: e.title,
      period: e.current ? `${new Date(e.start_date).getFullYear()} - Present` : `${new Date(e.start_date).getFullYear()} - ${e.end_date ? new Date(e.end_date).getFullYear() : ''}`,
      description: e.description,
    })),
    education: Array.isArray(c.education) ? c.education.map((e: any) => ({
      institution: e.institution,
      degree: `${e.degree} ${e.field}`,
      year: e.end_date ? new Date(e.end_date).getFullYear().toString() : '',
    })) : [],
  };
}

function mapDebate(d: any): MockDebate {
  return {
    id: d.id,
    candidateName: '',
    candidateId: d.candidate_id,
    roleTitle: '',
    recommendation: d.recommendation,
    confidenceScore: d.confidence_score,
    date: d.created_at?.split('T')[0] || '',
    arguments: d.arguments || [],
    synthesis: d.synthesis || '',
    counterfactuals: d.counterfactuals || [],
  };
}

export default function CandidateTwinPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: candidate, isLoading, error } = useCandidate(id);
  const { data: debate } = useDebateByCandidate(id);

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-card rounded w-48" />
          <div className="h-24 bg-card rounded" />
          <div className="h-64 bg-card rounded" />
          <div className="h-48 bg-card rounded" />
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">Candidate not found</h1>
        <p className="text-muted-foreground mt-2">
          {error ? (error as Error).message : "The candidate you're looking for doesn't exist."}
        </p>
      </div>
    );
  }

  const mockCandidate = mapToMock(candidate);
  const mockDebate = debate ? mapDebate(debate) : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <TwinHeader candidate={mockCandidate} />
      <ScoreCards candidate={mockCandidate} />
      <DNARadar candidate={mockCandidate} />
      <TrustSection candidate={mockCandidate} />
      <DebatePanel candidateId={candidate.id} />
      <Counterfactuals candidateId={candidate.id} />
      <CareerTimeline candidate={mockCandidate} />
    </div>
  );
}
