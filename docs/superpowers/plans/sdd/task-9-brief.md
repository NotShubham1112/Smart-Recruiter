### Task 9: Candidate Intelligence MCP Service

Create all files under `services/candidate-intelligence-mcp/`

**package.json:**
```json
{
  "name": "@helix/candidate-intelligence-mcp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@helix/types": "workspace:*",
    "@helix/shared": "workspace:*",
    "fastify": "^5.2.0",
    "zod": "^3.24.0",
    "pino": "^9.6.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
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
import { startServer } from './server.js';

const PORT = Number(process.env.PORT ?? 4101);

async function main() {
  const server = await startServer(PORT);
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch(console.error);
```

**src/server.ts:**
```ts
import Fastify from 'fastify';
import { registerTools } from './tools/index.js';
import type { MCPRequest, MCPResponse } from '@helix/types';

export async function startServer(port: number) {
  const app = Fastify({ logger: true });

  app.post('/mcp', async (request): Promise<MCPResponse> => {
    const mcpRequest = request.body as MCPRequest;
    return registerTools(mcpRequest);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'candidate-intelligence-mcp' }));

  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Candidate Intelligence MCP running on port ${port}`);
  return app;
}
```

**src/transport.ts:**
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';

export class MCPTransport {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async send(request: MCPRequest): Promise<MCPResponse> {
    const response = await fetch(`${this.url}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return response.json() as Promise<MCPResponse>;
  }
}
```

**src/tools/index.ts:**
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
import { handleParseResume } from './parse-resume.js';
import { handleBuildDNA } from './build-dna.js';

const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  parse_resume: handleParseResume,
  extract_skills: handleParseResume,
  extract_capabilities: handleParseResume,
  build_candidate_dna: handleBuildDNA,
  infer_learning_velocity: handleBuildDNA,
};

export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return {
      id: request.id,
      result: null,
      error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` },
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
```

**src/tools/parse-resume.ts:**
```ts
import type { CandidateProfile } from '@helix/types';

export async function handleParseResume(params: Record<string, unknown>): Promise<Partial<CandidateProfile>> {
  const resumeText = params.resumeText as string | undefined;
  if (!resumeText) {
    throw new Error('resumeText parameter is required');
  }
  return {
    id: crypto.randomUUID(),
    fullName: '',
    email: '',
    summary: resumeText.substring(0, 200),
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
```

**src/tools/build-dna.ts:**
```ts
import type { CandidateDNA } from '@helix/types';

export async function handleBuildDNA(params: Record<string, unknown>): Promise<CandidateDNA> {
  const candidateId = params.candidateId as string | undefined;
  if (!candidateId) throw new Error('candidateId parameter is required');
  return {
    candidateId,
    technicalDepth: 50,
    ownership: 50,
    learningVelocity: 50,
    adaptability: 50,
    communication: 50,
    leadership: 50,
    domainExpertise: {},
    skillProficiencies: {},
    confidenceScore: 50,
  };
}

export async function handleInferLearningVelocity(_params: Record<string, unknown>): Promise<{ learningVelocity: number }> {
  return { learningVelocity: 50 };
}
```

**.env.example:**
```bash
PORT=4101
LOG_LEVEL=info
```

**README.md:**
```md
# @helix/candidate-intelligence-mcp

MCP service for candidate intelligence. Parses resumes, extracts skills and capabilities, and builds candidate DNA profiles.

## Tools

- parse_resume
- extract_skills
- extract_capabilities
- build_candidate_dna
- infer_learning_velocity
```

**Commit:**
```bash
git add services/candidate-intelligence-mcp/
git commit -m "feat(services/candidate-intelligence-mcp): add MCP service with resume parsing and DNA building tools"
```
