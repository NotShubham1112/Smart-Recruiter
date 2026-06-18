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
