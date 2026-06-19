'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase, type DbCandidate, type DbCandidateDNA, type DbTrustReport } from '@/lib/supabase';

export interface CandidateWithDNA extends DbCandidate {
  dna: DbCandidateDNA | null;
  trust: DbTrustReport | null;
}

export function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async (): Promise<CandidateWithDNA[]> => {
      const { data: candidates, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch DNA and trust for each candidate
      const results = await Promise.all(
        (candidates || []).map(async (c) => {
          const [dnaRes, trustRes] = await Promise.all([
            supabase.from('candidate_dna').select('*').eq('candidate_id', c.id).single(),
            supabase.from('trust_reports').select('*').eq('candidate_id', c.id).single(),
          ]);
          return {
            ...c,
            dna: dnaRes.data,
            trust: trustRes.data,
          };
        })
      );

      return results;
    },
  });
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: async (): Promise<CandidateWithDNA | null> => {
      const { data: candidate, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!candidate) return null;

      const [dnaRes, trustRes] = await Promise.all([
        supabase.from('candidate_dna').select('*').eq('candidate_id', id).single(),
        supabase.from('trust_reports').select('*').eq('candidate_id', id).single(),
      ]);

      return {
        ...candidate,
        dna: dnaRes.data,
        trust: trustRes.data,
      };
    },
    enabled: !!id,
  });
}
