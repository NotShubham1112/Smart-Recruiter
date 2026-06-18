import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../lib/logger.js';

const connection = new IORedis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
});

export const analysisWorker = new Worker(
  'candidate-analysis',
  async (job) => {
    const { candidateId, roleId } = job.data;
    logger.info({ candidateId, roleId }, 'Processing analysis job');
    return { status: 'completed', candidateId, roleId };
  },
  { connection, concurrency: 5 },
);

analysisWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Analysis job completed');
});

analysisWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err.message }, 'Analysis job failed');
});
