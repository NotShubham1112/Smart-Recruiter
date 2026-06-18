### Task 8: services/orchestration-engine

**Files:** Create all under `services/orchestration-engine/`
- `package.json`, `tsconfig.json`, `README.md`, `.env.example`
- `src/index.ts`
- `src/queue-consumer.ts`
- `src/workflow-manager.ts`
- `src/memory-store.ts`
- `src/tool-router.ts`
- `src/lib/logger.ts`

**package.json:**
```json
{
  "name": "@helix/orchestration-engine",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "@helix/ai": "workspace:*",
    "bullmq": "^5.40.0",
    "ioredis": "^5.4.0",
    "pino": "^9.6.0",
    "zod": "^3.24.0"
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
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**src/index.ts:**
```ts
import { QueueConsumer } from './queue-consumer.js';

async function main() {
  const consumer = new QueueConsumer();
  await consumer.start();
  process.on('SIGTERM', async () => {
    await consumer.stop();
    process.exit(0);
  });
}

main().catch(console.error);
```

**src/queue-consumer.ts:**
```ts
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
```

**src/workflow-manager.ts:**
```ts
import type { CandidateProfile, RoleProfile } from '@helix/types';
import type { AnalysisOutput } from '@helix/ai';
import { logger } from './lib/logger.js';

export class WorkflowManager {
  async executeCandidateAnalysis(candidateId: string, roleId: string): Promise<AnalysisOutput> {
    const candidate = await this.getCandidateProfile(candidateId);
    const role = await this.getRoleProfile(roleId);
    const analysis = await this.runAnalysis(candidate, role);
    logger.info({ candidateId, roleId, score: analysis.helixScore }, 'Analysis complete');
    return analysis;
  }

  private async getCandidateProfile(_candidateId: string): Promise<CandidateProfile> {
    throw new Error('Database integration not yet implemented');
  }

  private async getRoleProfile(_roleId: string): Promise<RoleProfile> {
    throw new Error('Database integration not yet implemented');
  }

  private async runAnalysis(_candidate: CandidateProfile, _role: RoleProfile): Promise<AnalysisOutput> {
    throw new Error('AI agent integration not yet implemented');
  }
}
```

**src/memory-store.ts:**
```ts
export interface MemoryEntry {
  key: string;
  value: unknown;
  ttl?: number;
  createdAt: number;
}

export class MemoryStore {
  private store = new Map<string, MemoryEntry>();

  set(key: string, value: unknown, ttlMs?: number): void {
    this.store.set(key, { key, value, ttl: ttlMs, createdAt: Date.now() });
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.ttl && Date.now() - entry.createdAt > entry.ttl) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
```

**src/tool-router.ts:**
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';

type ToolHandler = (params: Record<string, unknown>) => Promise<unknown>;

export class ToolRouter {
  private tools = new Map<string, ToolHandler>();

  register(name: string, handler: ToolHandler): void {
    this.tools.set(name, handler);
  }

  async execute(request: MCPRequest): Promise<MCPResponse> {
    const handler = this.tools.get(request.tool);
    if (!handler) {
      return {
        id: request.id,
        result: null,
        error: { code: 'TOOL_NOT_FOUND', message: `Tool '${request.tool}' not found` },
        metadata: { timestamp: new Date().toISOString(), durationMs: 0 },
      };
    }
    const startTime = Date.now();
    try {
      const result = await handler(request.params);
      return {
        id: request.id,
        result,
        metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
      };
    } catch (error) {
      return {
        id: request.id,
        result: null,
        error: { code: 'TOOL_ERROR', message: (error as Error).message },
        metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime },
      };
    }
  }
}
```

**src/lib/logger.ts:**
```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  },
});
```

**.env.example:**
```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Logging
LOG_LEVEL=info
```

**README.md:**
```md
# @helix/orchestration-engine

LangGraph-based orchestration engine for the Helix platform.

Consumes analysis jobs from BullMQ and coordinates MCP services for candidate evaluation.

## Development

```bash
pnpm dev
```
```

**Commit:**
```bash
git add services/orchestration-engine/
git commit -m "feat(services/orchestration-engine): add LangGraph orchestration with queue consumer and tool router"
```
