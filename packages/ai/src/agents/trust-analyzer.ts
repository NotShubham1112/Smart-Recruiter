import type { CandidateProfile } from '@helix/types';

export interface Claim {
  id: string;
  text: string;
  category: 'experience' | 'education' | 'achievement' | 'skill' | 'tenure';
  confidence: number;
  verified: boolean;
  verificationSource?: string;
}

export interface TrustReport {
  candidateId: string;
  overallTrustScore: number;
  claimCount: number;
  verifiedClaims: number;
  suspiciousClaims: number;
  aiGeneratedProbability: number;
  anomalyScore: number;
  claims: Claim[];
  redFlags: string[];
}

const KNOWN_COMPANIES = new Set([
  'google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix',
  'stripe', 'spotify', 'ibm', 'oracle', 'salesforce', 'uber',
  'airbnb', 'twitter', 'linkedin', 'intel', 'cisco', 'adobe',
  'vmware', 'dell', 'hp', 'tesla', 'spacex', 'shopify',
  'github', 'gitlab', 'reddit', 'pinterest', 'snap', 'square',
  'palantir', 'datadog', 'twilio', 'slack', 'sap', 'accenture',
  'deloitte', 'pwc', 'goldman sachs', 'jpmorgan', 'bloomberg',
]);

const KNOWN_SKILLS = new Set([
  'react', 'python', 'typescript', 'aws', 'docker', 'postgresql',
  'node.js', 'java', 'go', 'rust',
]);

const TITLE_PATTERN = /engineer|developer|architect|lead|manager|scientist|analyst/i;

const AI_PATTERNS = [
  /demonstrated\s+(a\s+)?proven/i,
  /passionate\s+(about|to)\s+(deliver|drive|leverage)/i,
  /results-oriented\s+professional/i,
  /synergize|leverage|cross-functional/i,
  /spearheaded|orchestrated|architected/i,
];

function isCompanyKnown(company: string): boolean {
  return KNOWN_COMPANIES.has(company.toLowerCase().trim());
}

function extractClaims(profile: CandidateProfile): Claim[] {
  const claims: Claim[] = [];

  for (const exp of profile.experience) {
    const titleMatch = TITLE_PATTERN.test(exp.title);
    const companyKnown = isCompanyKnown(exp.company);
    const titleVerified = (titleMatch && exp.company.length > 2) || companyKnown;

    claims.push({
      id: `exp-title-${exp.id}`,
      text: `${exp.title} at ${exp.company}`,
      category: 'experience',
      confidence: titleVerified ? 0.9 : 0.3,
      verified: titleVerified,
      verificationSource: titleVerified ? (companyKnown ? 'Known company' : 'Title pattern matched') : undefined,
    });

    if (exp.description) {
      const achievementVerified = exp.description.length > 20;
      claims.push({
        id: `exp-achievement-${exp.id}`,
        text: exp.description,
        category: 'achievement',
        confidence: achievementVerified ? 0.7 : 0.2,
        verified: achievementVerified,
        verificationSource: achievementVerified ? 'Detailed description' : undefined,
      });
    }
  }

  for (const edu of profile.education) {
    const eduVerified = edu.degree.length > 5;
    claims.push({
      id: `edu-${edu.id}`,
      text: `${edu.degree} in ${edu.field} at ${edu.institution}`,
      category: 'education',
      confidence: eduVerified ? 0.8 : 0.3,
      verified: eduVerified,
      verificationSource: eduVerified ? 'Degree detail provided' : undefined,
    });
  }

  for (const skill of profile.skills) {
    const skillVerified = KNOWN_SKILLS.has(skill.name.toLowerCase().trim());
    claims.push({
      id: `skill-${skill.name}`,
      text: skill.name,
      category: 'skill',
      confidence: skillVerified ? 0.85 : 0.3,
      verified: skillVerified,
      verificationSource: skillVerified ? 'Known skill' : undefined,
    });
  }

  return claims;
}

function computeAnomalyScore(claims: Claim[], profile: CandidateProfile): number {
  let score = 0;

  if (profile.experience.length > 7) {
    score += 0.3;
  }

  if (profile.skills.length > 25) {
    score += 0.3;
  }

  if (claims.length > 0 && claims.every((c) => c.verified)) {
    score += 0.2;
  }

  if (profile.experience.length === 0 && profile.skills.length > 10) {
    score += 0.4;
  }

  return Math.max(0, Math.min(1, score));
}

function detectAIGenerated(profile: CandidateProfile): number {
  const textToScan = [profile.summary ?? ''];
  for (const exp of profile.experience) {
    textToScan.push(exp.description);
  }
  const combined = textToScan.join(' ');

  let matchCount = 0;
  for (const pattern of AI_PATTERNS) {
    if (pattern.test(combined)) {
      matchCount++;
    }
  }

  return Math.max(0, Math.min(1, matchCount * 0.2));
}

function findRedFlags(
  anomalyScore: number,
  skillsCount: number,
  experiencesCount: number,
  unverifiedRatio: number,
  aiGenProb: number,
): string[] {
  const flags: string[] = [];

  if (anomalyScore > 0.5) {
    flags.push('High anomaly score detected');
  }

  if (skillsCount > 25) {
    flags.push('Unusually large number of skills listed');
  }

  if (experiencesCount > 7) {
    flags.push('Unusually large number of positions listed');
  }

  if (unverifiedRatio > 0.5) {
    flags.push('More than 50% of claims could not be verified');
  }

  if (aiGenProb > 0.5) {
    flags.push('Resume shows signs of AI-generated content');
  }

  return flags;
}

export function analyzeTrust(profile: CandidateProfile): TrustReport {
  const claims = extractClaims(profile);
  const verifiedClaims = claims.filter((c) => c.verified);
  const suspiciousClaims = claims.filter((c) => !c.verified);

  const anomalyScore = computeAnomalyScore(claims, profile);
  const aiGeneratedProbability = detectAIGenerated(profile);

  const unverifiedRatio = claims.length > 0 ? suspiciousClaims.length / claims.length : 0;
  const redFlags = findRedFlags(
    anomalyScore,
    profile.skills.length,
    profile.experience.length,
    unverifiedRatio,
    aiGeneratedProbability,
  );

  const totalClaims = claims.length;
  const suspiciousCount = suspiciousClaims.length;
  const overallTrustScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - (suspiciousCount / Math.max(totalClaims, 1)) * 30 - anomalyScore * 20 - aiGeneratedProbability * 15),
    ),
  );

  return {
    candidateId: profile.id,
    overallTrustScore,
    claimCount: totalClaims,
    verifiedClaims: verifiedClaims.length,
    suspiciousClaims: suspiciousCount,
    aiGeneratedProbability,
    anomalyScore: Math.round(anomalyScore * 100) / 100,
    claims,
    redFlags,
  };
}
