export const MODEL_ROUTES = {
  CANDIDATE_EXTRACTION: 'qwen-3-32b',
  ROLE_EXTRACTION: 'qwen-3-32b',
  TRUST_INTELLIGENCE: 'qwen-3-32b',
  SKILL_INFERENCE: 'qwen-3-32b',
  DEBATE_REASONING: 'gpt-oss-120b',
  SUCCESS_SIMULATION: 'gpt-oss-120b',
  COUNTERFACTUAL_ANALYSIS: 'gpt-oss-120b',
  EXPLANATION_GENERATION: 'gpt-oss-120b',
} as const;

export type ModelTask = keyof typeof MODEL_ROUTES;

export function resolveModel(task: ModelTask): string {
  return MODEL_ROUTES[task];
}

export const MODEL_CAPABILITIES: Record<string, string[]> = {
  'qwen-3-32b': ['extraction', 'classification', 'scoring', 'analysis'],
  'gpt-oss-120b': ['reasoning', 'debate', 'simulation', 'generation', 'explanation'],
};
