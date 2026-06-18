export function calculateHelixScore(params: {
  successPrediction: number;
  capabilityMatch: number;
  trustScore: number;
  growthPotential: number;
  confidenceScore: number;
}): number {
  return (
    0.4 * params.successPrediction +
    0.25 * params.capabilityMatch +
    0.2 * params.trustScore +
    0.1 * params.growthPotential +
    0.05 * params.confidenceScore
  );
}

export function normalizeScore(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.round(((value - min) / (max - min)) * 100);
}

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function weightedAverage(values: { score: number; weight: number }[]): number {
  const totalWeight = values.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = values.reduce((sum, v) => sum + v.score * v.weight, 0);
  return clampScore(Math.round(weightedSum / totalWeight));
}
