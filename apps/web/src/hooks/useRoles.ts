'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase, type DbRole } from '@/lib/supabase';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<DbRole[]> => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: async (): Promise<DbRole | null> => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
