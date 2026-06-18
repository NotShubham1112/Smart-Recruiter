export const HELIX_SCORE_WEIGHTS = {
  SUCCESS_PREDICTION: 0.4,
  CAPABILITY_MATCH: 0.25,
  TRUST_SCORE: 0.2,
  GROWTH_POTENTIAL: 0.1,
  CONFIDENCE_SCORE: 0.05,
} as const;

export const AGENT_TYPES = [
  'technical_recruiter',
  'hiring_manager',
  'growth_potential',
  'leadership',
  'risk_assessment',
  'trust_verification',
] as const;

export const DEBOUNCE_MS = 300;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
