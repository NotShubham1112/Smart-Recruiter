'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase, type DbDebate } from '@/lib/supabase';

export function useDebates() {
  return useQuery({
    queryKey: ['debates'],
    queryFn: async (): Promise<DbDebate[]> => {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useDebate(id: string) {
  return useQuery({
    queryKey: ['debates', id],
    queryFn: async (): Promise<DbDebate | null> => {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useDebateByCandidate(candidateId: string) {
  return useQuery({
    queryKey: ['debates', 'candidate', candidateId],
    queryFn: async (): Promise<DbDebate | null> => {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!candidateId,
  });
}
