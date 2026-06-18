import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { WorkflowManager } from './workflow-manager.js';
import { logger } from './lib/logger.js';

export class QueueConsumer {
  private worker: Worker | null = null;
  private workflowManager = new WorkflowManager();
  private connection: IORedis;

  constructor() {
    this.connection = new IORedis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      maxRetriesPerRequest: null,
    });
  }

  async start(): Promise<void> {
    this.worker = new Worker(
      'candidate-analysis',
      async (job) => {
        const { candidateId, roleId } = job.data;
        logger.info({ candidateId, roleId }, 'Orchestrator processing job');
        return this.workflowManager.executeCandidateAnalysis(candidateId, roleId);
      },
      { connection: this.connection, concurrency: 3 },
    );
    logger.info('Orchestration engine started');
  }

  async stop(): Promise<void> {
    await this.worker?.close();
    await this.connection.quit();
  }
}
