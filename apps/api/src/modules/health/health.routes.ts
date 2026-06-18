import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  });
  app.get('/ready', async () => {
    return { status: 'ready', timestamp: new Date().toISOString() };
  });
}
