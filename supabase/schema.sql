-- ─── Helix Schema for Supabase ──────────────────────────────
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  title TEXT,
  summary TEXT,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Candidate DNA scores
CREATE TABLE IF NOT EXISTS candidate_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  technical_depth INTEGER DEFAULT 0,
  leadership INTEGER DEFAULT 0,
  ownership INTEGER DEFAULT 0,
  communication INTEGER DEFAULT 0,
  adaptability INTEGER DEFAULT 0,
  learning_velocity INTEGER DEFAULT 0,
  confidence_score INTEGER DEFAULT 0,
  helix_score INTEGER DEFAULT 0
);

-- Trust reports
CREATE TABLE IF NOT EXISTS trust_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  trust_score INTEGER DEFAULT 0,
  ai_generated_probability NUMERIC(5,2) DEFAULT 0,
  anomaly_score NUMERIC(5,2) DEFAULT 0,
  verified_claims INTEGER DEFAULT 0,
  total_claims INTEGER DEFAULT 0,
  red_flags JSONB DEFAULT '[]'::jsonb
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  seniority_level TEXT,
  experience_years INTEGER DEFAULT 3,
  required_skills JSONB DEFAULT '[]'::jsonb,
  preferred_skills JSONB DEFAULT '[]'::jsonb,
  description TEXT
);

-- Debates
CREATE TABLE IF NOT EXISTS debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  recommendation TEXT,
  confidence_score INTEGER DEFAULT 0,
  synthesis TEXT,
  arguments JSONB DEFAULT '[]'::jsonb,
  counterfactuals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_candidate_dna_candidate ON candidate_dna(candidate_id);
CREATE INDEX IF NOT EXISTS idx_trust_reports_candidate ON trust_reports(candidate_id);
CREATE INDEX IF NOT EXISTS idx_debates_candidate ON debates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_debates_role ON debates(role_id);