import Fastify from 'fastify';
import { registerTools } from './tools/index.js';
import type { MCPRequest, MCPResponse } from '@helix/types';

export async function startServer(port: number) {
  const app = Fastify({ logger: true });

  app.post('/mcp', async (request): Promise<MCPResponse> => {
    const mcpRequest = request.body as MCPRequest;
    return registerTools(mcpRequest);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'recruiter-agents-mcp' }));

  await app.listen({ port, host: '0.0.0.0' });
  app.log.info('Recruiter Agents MCP running on port ${port}');
  return app;
}
