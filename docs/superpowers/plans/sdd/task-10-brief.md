### Task 10: Remaining 5 MCP Services

Create 5 MCP services, each with the same structure as Task 9 (Candidate Intelligence MCP). Each service gets: `package.json`, `tsconfig.json`, `src/index.ts`, `src/server.ts`, `src/transport.ts`, `src/tools/index.ts`, tool handlers, `.env.example`, `README.md`.

The package.json for each service should use the format:
```json
{
  "name": "@helix/<service-name>",
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
    "fastify": "^5.2.0",
    "zod": "^3.24.0",
    "pino": "^9.6.0"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.7.0"
  }
}
```

The tsconfig.json for each:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

The src/index.ts for each:
```ts
import { startServer } from './server.js';
const PORT = Number(process.env.PORT ?? <PORT NUMBER>);
async function main() {
  const server = await startServer(PORT);
  process.on('SIGTERM', async () => { await server.close(); process.exit(0); });
}
main().catch(console.error);
```

The src/server.ts for each:
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
  app.get('/health', async () => ({ status: 'ok', service: '<service-name>' }));
  await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`<Service Name> running on port ${port}`);
  return app;
}
```

The src/transport.ts for each (identical pattern):
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
export class MCPTransport {
  private url: string;
  constructor(url: string) { this.url = url; }
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

The src/tools/index.ts for each follows the same pattern as Task 9 but with different tools.

**.env.example** for each:
```bash
PORT=<port>
LOG_LEVEL=info
```

**README.md** for each describes the service and lists its tools.

---

### Service 1: trust-intelligence-mcp (port 4102)

`src/tools/index.ts`:
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
async function handleTrustScore(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { overall: 75, resumeConsistency: 70, careerProgressionConsistency: 80, evidenceDensity: 65, technicalSpecificity: 72, claimVerificationScore: 68, fraudRisk: 'LOW' };
}
async function handleVerifyClaims(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { totalClaims: 0, verifiedClaims: [], unverifiableClaims: [], contradictedClaims: [] };
}
async function handleDetectAnomalies(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { anomalies: [], riskLevel: 'LOW' };
}
const toolHandlers: Record<string, (params: Record<string, unknown>) => Promise<unknown>> = {
  calculate_trust_score: handleTrustScore,
  verify_claims: handleVerifyClaims,
  detect_resume_anomalies: handleDetectAnomalies,
};
export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
```

### Service 2: role-intelligence-mcp (port 4103)

`src/tools/index.ts`:
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
async function handleParseJobDesc(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { title: '', company: '', description: '', requirements: [], responsibilities: [] };
}
async function handleBuildRoleDNA(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { roleId: '', technicalDepth: 50, ownership: 50, adaptability: 50, communication: 50, leadership: 50, domainExpertise: {}, requiredSkills: {} };
}
async function handleExtractReq(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { required: [], preferred: [] };
}
const toolHandlers = {
  parse_job_description: handleParseJobDesc,
  build_role_dna: handleBuildRoleDNA,
  extract_requirements: handleExtractReq,
};
export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
```

### Service 3: graph-intelligence-mcp (port 4104)

`src/tools/index.ts`:
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
async function handleBuildGraph(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { nodes: [], edges: [], metadata: { nodeCount: 0, edgeCount: 0, density: 0, centralNodes: [] } };
}
async function handleQueryGraph(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { results: [] };
}
async function handleCareerPath(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { paths: [], recommendations: [] };
}
const toolHandlers = {
  build_career_graph: handleBuildGraph,
  query_graph: handleQueryGraph,
  career_path_analysis: handleCareerPath,
};
export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
```

### Service 4: simulation-engine-mcp (port 4105)

`src/tools/index.ts`:
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
async function handleSimulate(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { successProbability: 50, technicalFit: 50, teamFit: 50, growthPotential: 50, retentionProbability: 50, failureRisk: 50, confidenceScore: 50 };
}
async function handlePredictRetention(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { retentionProbability: 50, riskFactors: [] };
}
async function handleCounterfactual(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { scenarios: [], topImprovers: [] };
}
const toolHandlers = {
  simulate_candidate_success: handleSimulate,
  predict_retention: handlePredictRetention,
  counterfactual_analysis: handleCounterfactual,
};
export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
```

### Service 5: recruiter-agents-mcp (port 4106)

`src/tools/index.ts`:
```ts
import type { MCPRequest, MCPResponse } from '@helix/types';
async function handleCTOReview(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { agentId: 'cto-1', agentType: 'technical_recruiter', score: 50, reasoning: 'Technical review stub', strengths: [], concerns: [], questions: [] };
}
async function handleDebate(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { debateId: '', candidateId: '', roleId: '', agents: [], consensus: { finalScore: 50, agreementLevel: 0.5, summary: '', dissentingOpinions: [], recommendation: 'neutral' } };
}
async function handleConsensus(_params: Record<string, unknown>): Promise<Record<string, unknown>> {
  return { finalScore: 50, agreementLevel: 0.5, summary: 'Consensus stub', dissentingOpinions: [], recommendation: 'neutral' };
}
const toolHandlers = {
  run_cto_review: handleCTOReview,
  run_debate: handleDebate,
  generate_consensus: handleConsensus,
};
export async function registerTools(request: MCPRequest): Promise<MCPResponse> {
  const handler = toolHandlers[request.tool];
  if (!handler) {
    return { id: request.id, result: null, error: { code: 'TOOL_NOT_FOUND', message: `Unknown tool: ${request.tool}` }, metadata: { timestamp: new Date().toISOString(), durationMs: 0 } };
  }
  const startTime = Date.now();
  try {
    const result = await handler(request.params);
    return { id: request.id, result, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  } catch (error) {
    return { id: request.id, result: null, error: { code: 'TOOL_ERROR', message: (error as Error).message }, metadata: { timestamp: new Date().toISOString(), durationMs: Date.now() - startTime } };
  }
}
```

**Commit command:**
```bash
git add services/trust-intelligence-mcp/ services/role-intelligence-mcp/ services/graph-intelligence-mcp/ services/simulation-engine-mcp/ services/recruiter-agents-mcp/
git commit -m "feat(services): add trust, role, graph, simulation, and recruiter MCP services"
```
