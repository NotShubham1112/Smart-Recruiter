'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CandidateSearch } from '@/components/candidates/CandidateSearch';
import { CandidateFilters } from '@/components/candidates/CandidateFilters';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { useCandidates, type CandidateWithDNA } from '@/hooks/useCandidates';
import type { MockCandidate } from '@/lib/mock-data';

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

export default function CandidatesPage() {
  const { data: candidates, isLoading, error } = useCandidates();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const mapped = useMemo(() => (candidates || []).map(mapToMock), [candidates]);

  const filtered = useMemo(() => {
    let result = mapped;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    switch (filter) {
      case 'high-trust':
        result = result.filter((c) => c.trustScore >= 85);
        break;
      case 'low-risk':
        result = result.filter((c) => c.riskLevel === 'Low');
        break;
      case 'top-scorers':
        result = result.filter((c) => c.helixScore >= 85);
        break;
    }

    return result;
  }, [mapped, search, filter]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Candidate Explorer</h1>
          <p className="text-sm text-muted-foreground">Loading candidates...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-background" />
                <div className="space-y-2">
                  <div className="h-4 bg-background rounded w-24" />
                  <div className="h-3 bg-background rounded w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-background rounded" />
                <div className="h-2 bg-background rounded" />
                <div className="h-2 bg-background rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Candidate Explorer</h1>
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          Failed to load candidates. Make sure your Supabase tables are set up.
          <br />
          <span className="text-sm opacity-75">{(error as Error).message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Candidate Explorer</h1>
        <p className="text-sm text-muted-foreground">{mapped.length} candidates analyzed</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <CandidateSearch value={search} onChange={setSearch} />
        </div>
        <CandidateFilters activeFilter={filter} onFilterChange={setFilter} />
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
      </p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filtered.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No candidates match your search.</p>
        </div>
      )}
    </div>
  );
}
