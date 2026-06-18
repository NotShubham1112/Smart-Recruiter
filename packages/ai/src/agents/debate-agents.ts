import type { CandidateProfile } from '@helix/types';
import type { RoleDNA } from '@helix/types';

export interface DebateArgument {
  agent: 'CTO' | 'Trust' | 'Growth';
  stance: 'support' | 'caution' | 'neutral';
  points: string[];
  reasoning: string;
  confidence: number;
  counterpoints?: string[];
}

export interface DebateRound {
  id: string;
  candidateId: string;
  candidateName: string;
  roleTitle: string;
  arguments: DebateArgument[];
  synthesis: string;
  recommendation: 'strong_hire' | 'hire' | 'consider' | 'pass';
  confidenceScore: number;
}

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const TECH_CATEGORIES: readonly string[] = ['language', 'framework', 'database', 'cloud'] as const;

function countTechSkills(profile: CandidateProfile): number {
  return profile.skills.filter((s) => (TECH_CATEGORIES as readonly string[]).includes(s.category)).length;
}

function countCategories(profile: CandidateProfile): number {
  return new Set(profile.skills.map((s) => s.category)).size;
}

function countLeadExperience(profile: CandidateProfile): number {
  const leadKeywords = ['lead', 'senior', 'head', 'manager', 'director', 'principal', 'architect'];
  return profile.experience.filter((exp) =>
    leadKeywords.some((kw) => exp.title.toLowerCase().includes(kw))
  ).length;
}

function countExperiences(profile: CandidateProfile): number {
  return profile.experience.length;
}

export function generateCTOArgument(
  profile: CandidateProfile,
  _role: RoleDNA
): DebateArgument {
  const techSkills = countTechSkills(profile);
  const leadExp = countLeadExperience(profile);
  const expCount = countExperiences(profile);

  const supportPoints: string[] = [];
  const cautionPoints: string[] = [];

  if (techSkills >= 5) {
    supportPoints.push(`Strong technical foundation with ${techSkills} technical skills`);
  }
  if (leadExp >= 1) {
    supportPoints.push(`Demonstrated leadership experience (${leadExp} leadership roles)`);
  }
  if (expCount >= 3) {
    supportPoints.push(`Substantial career experience with ${expCount} positions`);
  }

  if (techSkills < 3) {
    cautionPoints.push(`Limited technical skills (${techSkills}) for a technical leadership role`);
  }
  if (expCount === 0) {
    cautionPoints.push('No professional experience listed');
  }

  let stance: 'support' | 'caution' | 'neutral';
  if (supportPoints.length > cautionPoints.length) {
    stance = 'support';
  } else if (cautionPoints.length > supportPoints.length) {
    stance = 'caution';
  } else {
    stance = 'neutral';
  }

  const confidence = Math.min(100, 60 + techSkills * 5 + leadExp * 10);
  const points = stance === 'support' ? supportPoints : stance === 'caution' ? cautionPoints : [];

  return {
    agent: 'CTO',
    stance,
    points,
    reasoning:
      stance === 'support'
        ? 'Candidate demonstrates strong technical and leadership profile'
        : stance === 'caution'
          ? 'Candidate lacks sufficient technical depth or experience for this role'
          : 'Candidate has mixed technical signals requiring further evaluation',
    confidence,
    counterpoints: cautionPoints.length > 0 ? cautionPoints : undefined,
  };
}

export function generateTrustArgument(
  profile: CandidateProfile,
  _role: RoleDNA
): DebateArgument {
  const experienceClaims = countExperiences(profile);
  const skillDiversity = countCategories(profile);
  const skills = profile.skills.length;

  const supportPoints: string[] = [];
  const cautionPoints: string[] = [];

  if (experienceClaims >= 2) {
    supportPoints.push(`Multiple experience entries (${experienceClaims}) can be cross-referenced`);
  }
  if (skillDiversity >= 3) {
    supportPoints.push(`Broad skill diversity across ${skillDiversity} categories suggests well-rounded profile`);
  }

  if (experienceClaims > 5) {
    cautionPoints.push(`High number of experience claims (${experienceClaims}) requires thorough verification`);
  }
  if (skills > 20) {
    cautionPoints.push(`Unusually high skill count (${skills}) may indicate overstatement`);
  }
  if (skillDiversity === 0) {
    cautionPoints.push('No skill categorization available for trust analysis');
  }

  let stance: 'support' | 'caution' | 'neutral';
  if (supportPoints.length > cautionPoints.length && supportPoints.length > 0) {
    stance = 'support';
  } else if (cautionPoints.length > supportPoints.length) {
    stance = 'caution';
  } else {
    stance = 'neutral';
  }

  const penalty = skills > 20 ? 10 : 0;
  const confidence = Math.min(100, 65 + experienceClaims * 5 - penalty);
  const points = stance === 'support' ? supportPoints : stance === 'caution' ? cautionPoints : [];

  return {
    agent: 'Trust',
    stance,
    points,
    reasoning:
      stance === 'support'
        ? 'Candidate profile appears consistent and verifiable'
        : stance === 'caution'
          ? 'Candidate profile has potential trust concerns that need verification'
          : 'Trust signals are mixed; manual verification recommended',
    confidence,
    counterpoints: cautionPoints.length > 0 ? cautionPoints : undefined,
  };
}

export function generateGrowthArgument(
  profile: CandidateProfile,
  _role: RoleDNA
): DebateArgument {
  const skills = profile.skills.length;
  const categories = countCategories(profile);
  const currentlyEmployed = profile.experience.some((e) => e.current);
  const expCount = countExperiences(profile);

  const supportPoints: string[] = [];
  const cautionPoints: string[] = [];

  if (skills >= 8) {
    supportPoints.push(`Strong skill set with ${skills} skills across ${categories} categories`);
  }
  if (currentlyEmployed) {
    supportPoints.push('Currently employed, indicating stable career trajectory');
  }
  if (expCount >= 3) {
    supportPoints.push(`Progressive career growth with ${expCount} positions`);
  }

  if (skills < 5) {
    cautionPoints.push(`Limited skill breadth (${skills}) may hinder growth potential`);
  }
  if (!currentlyEmployed && expCount === 0) {
    cautionPoints.push('Between positions with no prior experience, high risk');
  }

  let stance: 'support' | 'caution' | 'neutral';
  if (supportPoints.length > cautionPoints.length) {
    stance = 'support';
  } else if (cautionPoints.length > supportPoints.length) {
    stance = 'caution';
  } else {
    stance = 'neutral';
  }

  const confidence = Math.min(100, 55 + skills * 3 + categories * 5);
  const points = stance === 'support' ? supportPoints : stance === 'caution' ? cautionPoints : [];

  return {
    agent: 'Growth',
    stance,
    points,
    reasoning:
      stance === 'support'
        ? 'Candidate shows strong growth trajectory and skill breadth'
        : stance === 'caution'
          ? 'Candidate profile raises growth potential concerns'
          : 'Growth signals are inconclusive',
    confidence,
    counterpoints: cautionPoints.length > 0 ? cautionPoints : undefined,
  };
}

export function synthesizeDebate(
  args: DebateArgument[],
  profile: CandidateProfile,
  role: RoleDNA
): DebateRound {
  const avgConfidence = Math.round(
    args.reduce((sum, a) => sum + a.confidence, 0) / args.length
  );
  const supporters = args.filter((a) => a.stance === 'support').length;

  let synthesis: string;
  let recommendation: DebateRound['recommendation'];

  if (supporters >= 2) {
    synthesis = `Panel leans toward hiring ${profile.fullName} for ${role.roleId}. ` +
      `Majority of agents see favorable signals with ${avgConfidence}% average confidence.`;
    recommendation = avgConfidence >= 80 ? 'strong_hire' : 'hire';
  } else {
    synthesis = `Panel has reservations about ${profile.fullName} for ${role.roleId}. ` +
      `Insufficient positive signals across agent panel (${avgConfidence}% confidence).`;
    recommendation = 'consider';
  }

  return {
    id: generateId(),
    candidateId: profile.id,
    candidateName: profile.fullName,
    roleTitle: role.roleId,
    arguments: args,
    synthesis,
    recommendation,
    confidenceScore: avgConfidence,
  };
}
