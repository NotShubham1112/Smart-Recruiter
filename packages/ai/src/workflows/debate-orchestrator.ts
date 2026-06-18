import type { CandidateProfile } from '@helix/types';
import type { RoleDNA } from '@helix/types';
import {
  generateCTOArgument,
  generateTrustArgument,
  generateGrowthArgument,
  synthesizeDebate,
  type DebateRound,
} from '../agents/debate-agents';

export function runDebate(profile: CandidateProfile, role: RoleDNA): DebateRound {
  const cto = generateCTOArgument(profile, role);
  const trust = generateTrustArgument(profile, role);
  const growth = generateGrowthArgument(profile, role);
  return synthesizeDebate([cto, trust, growth], profile, role);
}

export function runBatchDebate(profiles: CandidateProfile[], role: RoleDNA): DebateRound[] {
  return profiles.map((p) => runDebate(p, role));
}
