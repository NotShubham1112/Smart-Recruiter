import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  _supabase = createClient(url, key);
  return _supabase;
}

// Convenience alias
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as any)[prop];
  },
});

// ─── Database Types ────────────────────────────────────────

export interface DbCandidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  title: string | null;
  summary: string | null;
  experience: any[];
  education: any[];
  skills: any[];
  github_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCandidateDNA {
  id: string;
  candidate_id: string;
  technical_depth: number;
  leadership: number;
  ownership: number;
  communication: number;
  adaptability: number;
  learning_velocity: number;
  confidence_score: number;
  helix_score: number;
}

export interface DbTrustReport {
  id: string;
  candidate_id: string;
  trust_score: number;
  ai_generated_probability: number;
  anomaly_score: number;
  verified_claims: number;
  total_claims: number;
  red_flags: any;
}

export interface DbRole {
  id: string;
  title: string;
  department: string;
  seniority_level: string;
  experience_years: number;
  required_skills: any;
  preferred_skills: any;
  description: string;
}

export interface DbDebate {
  id: string;
  candidate_id: string;
  role_id: string;
  recommendation: string;
  confidence_score: number;
  synthesis: string;
  arguments: any;
  counterfactuals: any;
  created_at: string;
}
