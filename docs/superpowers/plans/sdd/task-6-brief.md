### Task 6: apps/api — Fastify Server

**Files:** Create all under `apps/api/`
- `package.json`, `tsconfig.json`, `README.md`, `.env.example`
- `src/index.ts`
- `src/plugins/auth.ts`
- `src/modules/health/health.routes.ts`
- `src/modules/candidate/candidate.routes.ts`
- `src/modules/role/role.routes.ts`
- `src/queues/analysis.queue.ts`
- `src/workers/analysis.worker.ts`
- `src/lib/logger.ts`

**package.json:**
```json
{
  "name": "@helix/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "fastify": "^5.2.0",
    "@fastify/cors": "^10.0.0",
    "@fastify/jwt": "^9.0.0",
    "@fastify/helmet": "^13.0.0",
    "@fastify/websocket": "^11.0.0",
    "bullmq": "^5.40.0",
    "ioredis": "^5.4.0",
    "pino": "^9.6.0",
    "pino-pretty": "^13.0.0",
    "zod": "^3.24.0",
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/exporter-trace-otlp-proto": "^0.57.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0"
  }
}
```

**tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2024"]
  },
  "include": ["src"]
}
```

**src/index.ts:**
```ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { healthRoutes } from './modules/health/health.routes.js';
import { candidateRoutes } from './modules/candidate/candidate.routes.js';
import { roleRoutes } from './modules/role/role.routes.js';
import { logger } from './lib/logger.js';

const app = Fastify({
  logger: false,
});

await app.register(cors, { origin: true });
await app.register(helmet);
await app.register(healthRoutes, { prefix: '/api/health' });
await app.register(candidateRoutes, { prefix: '/api/candidates' });
await app.register(roleRoutes, { prefix: '/api/roles' });

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    logger.info('API server running on port 4000');
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
};

start();
```

**src/plugins/auth.ts:**
```ts
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export async function authPlugin(app: FastifyInstance): Promise<void> {
  await app.register(jwt, { secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production' });
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}

export default fp(authPlugin);
```

**src/modules/health/health.routes.ts:**
```ts
import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  });
  app.get('/ready', async () => {
    return { status: 'ready', timestamp: new Date().toISOString() };
  });
}
```

**src/modules/candidate/candidate.routes.ts:**
```ts
import type { FastifyInstance } from 'fastify';

export async function candidateRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { candidates: [], total: 0, page: 1 };
  });
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return { id: request.params.id, message: 'Candidate detail endpoint' };
  });
  app.post('/', async (request) => {
    return { id: 'new-candidate-id', message: 'Candidate created' };
  });
}
```

**src/modules/role/role.routes.ts:**
```ts
import type { FastifyInstance } from 'fastify';

export async function roleRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { roles: [], total: 0, page: 1 };
  });
  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return { id: request.params.id, message: 'Role detail endpoint' };
  });
  app.post('/', async (request) => {
    return { id: 'new-role-id', message: 'Role created' };
  });
}
```

**src/queues/analysis.queue.ts:**
```ts
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
```

**src/workers/analysis.worker.ts:**
```ts
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
```

**src/lib/logger.ts:**
```ts
import pino from 'pino';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  level: process.env.LOG_LEVEL ?? 'info',
});
```

**.env.example:**
```bash
# Server
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Auth
JWT_SECRET=change-me-in-production

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=helix-api
```

**README.md:**
```md
# @helix/api

Thin API server for the Helix platform. Built with Fastify.

This API does NOT execute AI workloads directly. It enqueues analysis jobs to BullMQ for the orchestration engine to process.

## Development

```bash
pnpm dev
```

## Routes

- GET /api/health - Health check
- GET /api/candidates - List candidates
- POST /api/candidates - Create candidate
- GET /api/roles - List roles
- POST /api/roles - Create role
```
