'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CandidateSearch } from '@/components/candidates/CandidateSearch';
import { CandidateFilters } from '@/components/candidates/CandidateFilters';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { mockCandidates } from '@/lib/mock-data';

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = mockCandidates;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Filter
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
  }, [search, filter]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Candidate Explorer</h1>
        <p className="text-sm text-muted-foreground">{mockCandidates.length} candidates analyzed</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <CandidateSearch value={search} onChange={setSearch} />
        </div>
        <CandidateFilters activeFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
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
