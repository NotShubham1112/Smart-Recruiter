import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
});

export const analysisQueue = new Queue('candidate-analysis', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { age: 3600, count: 100 },
  },
});

export async function enqueueAnalysis(candidateId: string, roleId: string): Promise<string> {
  const job = await analysisQueue.add('analyze', { candidateId, roleId });
  return job.id ?? '';
}
