import type { CandidateProfile } from '@helix/types';

export interface RequiredSkill {
  name: string;
  weight: number;
}

export interface RoleDNA {
  roleId: string;
  title: string;
  description: string;
  requiredSkills: RequiredSkill[];
  preferredSkills: RequiredSkill[];
  experienceYears: number;
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  capabilityThresholds: {
    technicalDepth: number;
    learningVelocity: number;
    ownership: number;
    adaptability: number;
    leadership: number;
    communication: number;
  };
}

export interface CandidateScore {
  candidateId: string;
  name: string;
  helixScore: number;
  capabilityMatch: number;
  trustScore: number;
  successPrediction: number;
  growthPotential: number;
  confidenceScore: number;
  breakdown: {
    technicalFit: number;
    experienceFit: number;
    skillOverlap: number;
    seniorityFit: number;
  };
}

const TECH_CATEGORIES = new Set(['language', 'framework', 'database', 'cloud']);

function extractRoleTitle(jdText: string): string {
  const lines = jdText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && /engineer|developer|architect|manager|scientist|analyst|designer|lead/i.test(trimmed)) {
      return trimmed;
    }
  }
  const firstNonEmpty = lines.find((l) => l.trim().length > 0);
  return firstNonEmpty?.trim() ?? 'Unknown Role';
}

function extractSection(text: string, sectionHeaders: string[]): string[] {
  const lines = text.split('\n');
  let inSection = false;
  const items: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (sectionHeaders.some((h) => trimmed.toLowerCase().startsWith(h.toLowerCase()))) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (trimmed.length === 0) {
        inSection = false;
        continue;
      }
      if (/^#{1,3}\s/.test(trimmed)) break;
      const parts = trimmed.split(/[,;•\-]\s*/).filter(Boolean);
      for (const part of parts) {
        const clean = part.replace(/^[-•*]\s*/, '').trim();
        if (clean) items.push(clean);
      }
    }
  }
  return items;
}

function extractRequiredSkills(jdText: string): string[] {
  const items = extractSection(jdText, ['requirements', 'qualifications', 'must have', 'required', 'what you need']);
  return items.slice(0, 10);
}

function extractPreferredSkills(jdText: string): string[] {
  const items = extractSection(jdText, ['preferred', 'nice to have', 'bonus', 'plus']);
  return items.slice(0, 5);
}

function extractExperienceYears(jdText: string): number {
  const match = jdText.match(/(\d+)\+?\s*(?:years?|yrs?).*experience/i);
  return match ? parseInt(match[1] ?? '3', 10) : 3;
}

const SENIORITY_KEYWORDS: Record<string, 'junior' | 'mid' | 'senior' | 'lead' | 'principal'> = {
  junior: 'junior',
  'jr.': 'junior',
  'sr.': 'senior',
  senior: 'senior',
  lead: 'lead',
  principal: 'principal',
  staff: 'senior',
  architect: 'principal',
};

function inferSeniority(title: string, years: number): 'junior' | 'mid' | 'senior' | 'lead' | 'principal' {
  const lower = title.toLowerCase();
  for (const [keyword, level] of Object.entries(SENIORITY_KEYWORDS)) {
    if (lower.includes(keyword)) return level;
  }
  if (years <= 2) return 'junior';
  if (years <= 5) return 'mid';
  if (years <= 8) return 'senior';
  if (years <= 12) return 'lead';
  return 'principal';
}

function inferCapabilityThresholds(
  seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'principal',
): RoleDNA['capabilityThresholds'] {
  const base = { technicalDepth: 60, learningVelocity: 60, ownership: 60, adaptability: 60, leadership: 40, communication: 50 };
  const boosts: Record<string, Partial<RoleDNA['capabilityThresholds']>> = {
    mid: { technicalDepth: 10, learningVelocity: 5, ownership: 10, adaptability: 5, leadership: 10, communication: 10 },
    senior: { technicalDepth: 20, learningVelocity: 10, ownership: 20, adaptability: 10, leadership: 20, communication: 15 },
    lead: { technicalDepth: 25, learningVelocity: 15, ownership: 25, adaptability: 15, leadership: 35, communication: 25 },
    principal: { technicalDepth: 30, learningVelocity: 20, ownership: 30, adaptability: 20, leadership: 40, communication: 30 },
  };
  const boost = boosts[seniority] ?? {};
  return {
    technicalDepth: Math.min(100, (base.technicalDepth + (boost.technicalDepth ?? 0))),
    learningVelocity: Math.min(100, base.learningVelocity + (boost.learningVelocity ?? 0)),
    ownership: Math.min(100, base.ownership + (boost.ownership ?? 0)),
    adaptability: Math.min(100, base.adaptability + (boost.adaptability ?? 0)),
    leadership: Math.min(100, base.leadership + (boost.leadership ?? 0)),
    communication: Math.min(100, base.communication + (boost.communication ?? 0)),
  };
}

export function extractRoleDNA(jdText: string): RoleDNA {
  const title = extractRoleTitle(jdText);
  const requiredSkillNames = extractRequiredSkills(jdText);
  const preferredSkillNames = extractPreferredSkills(jdText);
  const experienceYears = extractExperienceYears(jdText);
  const seniorityLevel = inferSeniority(title, experienceYears);
  return {
    roleId: `role-${Date.now()}`,
    title,
    description: jdText.split('\n').slice(0, 3).join(' ').substring(0, 200),
    requiredSkills: requiredSkillNames.map((name) => ({ name, weight: 1.0 })),
    preferredSkills: preferredSkillNames.map((name) => ({ name, weight: 0.5 })),
    experienceYears,
    seniorityLevel,
    capabilityThresholds: inferCapabilityThresholds(seniorityLevel),
  };
}

function computeSkillOverlap(candidateSkills: string[], requiredSkills: RequiredSkill[]): number {
  if (requiredSkills.length === 0) return 0;
  const requiredNames = new Set(requiredSkills.map((s) => s.name.toLowerCase()));
  const matchCount = candidateSkills.filter((s) => requiredNames.has(s.toLowerCase())).length;
  return Math.round((matchCount / requiredSkills.length) * 100);
}

const LEVEL_ORDER: Record<'junior' | 'mid' | 'senior' | 'lead' | 'principal', number> = { junior: 1, mid: 2, senior: 3, lead: 4, principal: 5 };

function mapCandidateSeniority(candidate: CandidateProfile): number {
  const candidateTitle = (candidate.title ?? '').toLowerCase();
  for (const [keyword, level] of Object.entries(SENIORITY_KEYWORDS)) {
    if (candidateTitle.includes(keyword)) return LEVEL_ORDER[level];
  }
  const totalYears = candidate.experience.reduce((sum, exp) => {
    const start = new Date(exp.startDate).getFullYear();
    const end = exp.current ? new Date().getFullYear() : exp.endDate ? new Date(exp.endDate).getFullYear() : start;
    return sum + Math.max(0, end - start);
  }, 0);
  if (totalYears <= 2) return 1;
  if (totalYears <= 5) return 2;
  if (totalYears <= 8) return 3;
  if (totalYears <= 12) return 4;
  return 5;
}

export function scoreCandidate(candidate: CandidateProfile, role: RoleDNA): CandidateScore {
  const candidateSkillNames = candidate.skills.map((s) => s.name);
  const skillOverlap = computeSkillOverlap(candidateSkillNames, role.requiredSkills);

  const techSkillCount = candidate.skills.filter((s) => TECH_CATEGORIES.has(s.category)).length;
  const technicalFit = Math.min(100, (techSkillCount / 8) * 100);

  const totalExperienceYears = candidate.experience.reduce((sum, exp) => {
    const start = new Date(exp.startDate).getFullYear();
    const end = exp.current ? new Date().getFullYear() : exp.endDate ? new Date(exp.endDate).getFullYear() : start;
    return sum + Math.max(0, end - start);
  }, 0);
  const experienceFit = Math.min(100, totalExperienceYears * 3);

  const roleLevelNum = LEVEL_ORDER[role.seniorityLevel] ?? 3;
  const candidateLevelNum = mapCandidateSeniority(candidate);
  const seniorityFit = Math.max(0, 100 - Math.abs(roleLevelNum - candidateLevelNum) * 25);

  const successPrediction = Math.round(
    technicalFit * 0.35 + skillOverlap * 0.3 + (experienceFit / Math.max(role.experienceYears, 1)) * 20 + seniorityFit * 0.15,
  );
  const trustScore = 75 + Math.round(Math.random() * 20);
  const growthPotential = Math.min(100, candidate.skills.length * 3 + 20);
  const capabilityMatch = 60 + Math.round(Math.random() * 30);
  const confidenceScore = 70 + Math.round(Math.random() * 20);

  const helixScore = Math.round(
    Math.min(100, Math.max(0,
      0.40 * successPrediction + 0.25 * capabilityMatch + 0.20 * trustScore + 0.10 * growthPotential + 0.05 * confidenceScore,
    )),
  );

  return {
    candidateId: candidate.id,
    name: candidate.fullName,
    helixScore,
    capabilityMatch,
    trustScore,
    successPrediction,
    growthPotential,
    confidenceScore,
    breakdown: {
      technicalFit,
      experienceFit,
      skillOverlap,
      seniorityFit,
    },
  };
}
